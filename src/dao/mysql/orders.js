import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
import BalancesManager from "./balances.js";
import ProductsManager from "./products.js";
import SalesManager from "./sales.js";
export default class OrdersManager {
  static async getAll() {
    try {
      const [orders] = await pool.query("SELECT orders.id ,orders.sale_id, products.name, products.price, orders.quantity, orders.amount,orders.order_cost, products.category FROM orders INNER JOIN products ON orders.product_id = products.id ORDER BY orders.id ASC");
      return { payload: orders };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async getById(id, connection) {
    try {
      const dbClient = connection || pool;
      const [[order]] = await dbClient.execute("SELECT * FROM orders WHERE id = ?", [id]);
      return { payload: order };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async getByOrderNumber(sale_id) {
    try {
      const [orders] = await pool.execute("SELECT orders.id ,orders.sale_id, products.name, products.price, orders.quantity, orders.amount,orders.order_cost, products.category FROM orders INNER JOIN products ON orders.product_id = products.id WHERE orders.sale_id = ? ORDER BY orders.id ASC", [sale_id]);
      return { payload: orders };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async update(id, data) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      const order = await this.getById(id);
      const [updatedOrder] = await connection.execute("UPDATE orders SET sale_id=?, product_id=? , quantity=?, amount=((SELECT price from products where id = ?)*?)  WHERE id=?", [data.sale_id, data.product_id, data.quantity, data.product_id, data.quantity, id]);
      await this.updateOrderCost(order, data.quantity, connection);
      await ProductsManager.updateProductStock(id, data.quantity - order.quantity, connection);
      await SalesManager.recalculateSaleData(data.sale_id, connection);
      // await connection.execute("UPDATE sales SET items_quantity = (SELECT SUM(quantity) FROM orders WHERE sale_id = ? ), total_amount= (SELECT SUM(amount) FROM orders WHERE sale_id = ?) WHERE id = ?", [data.sale_id, data.sale_id, data.sale_id]);
      connection.commit();
      return { payload: updatedOrder };
    } catch (error) {
      if (connection) connection.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (connection) connection.release();
    }
  }

  static async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      const [[{ sale_id, amount, product_id, quantity }]] = await connection.execute("SELECT sale_id,amount, quantity, product_id FROM orders WHERE id=?", [id]);
      const [deletedOrder] = await connection.execute("DELETE FROM orders WHERE id =?", [id]);

      const { payload: orders } = await this.getByOrderNumber(sale_id);
      if (orders.length === 0) {
        await SalesManager.delete(sale_id);
      } else {
        await connection.execute("UPDATE sales SET items_quantity = (SELECT SUM(quantity) FROM orders WHERE sale_id = ? ), total_amount= (SELECT SUM(amount) FROM orders WHERE sale_id = ?) WHERE id = ?", [sale_id, sale_id, sale_id]);
        const [[{ costumer_id }]] = await connection.execute("SELECT costumer_id FROM sales WHERE id = ?", [sale_id]);
        await BalancesManager.addDebitCredit(costumer_id, -amount, connection);
        await SalesManager.recalculateSaleData(sale_id, connection);
      }
      await ProductsManager.updateProductStock(product_id, quantity, connection);
      await connection.commit();
      return { payload: deletedOrder };
    } catch (error) {
      if (connection) connection.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    } finally {
      if (connection) connection.release();
    }
  }

  static async create(data) {
    let connection;
    try {
      connection = await pool.getConnection();
      connection.beginTransaction();
      await connection.execute("INSERT INTO orders (sale_id, product_id, quantity, amount,order_cost) VALUES(?,?,?,?,?)", [data.sale_id, data.product_id, data.quantity, data.amount, data.order_cost]);
      await ProductsManager.updateProductStock(data.product_id, -data.quantity, connection);
      await connection.commit();
      return { payload: "Order created." };
    } catch (error) {
      if (connection) await connection.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (connection) connection.release();
    }
  }

  static async getOrdersByProductId(product_id) {
    try {
      const [orders] = await pool.execute("SELECT id,sale_id, quantity FROM orders WHERE product_id = ?", [product_id]);
      return { payload: orders };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    }
  }
  static async updateOrderCost({ quantity, cost }, connection) {
    let dbClient;
    try {
      dbClient = connection || (await pool.getConnection());
      const [update] = await dbClient.execute("UPDATE orders SET order_cost = ? WHERE id = ?", [cost * quantity, order_id]);
      return { payload: update };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (connection) connection.release();
    }
  }
}
