import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
import BalancesManager from "./balances.js";
import ProductsManager from "./products.js";
import SalesManager from "./sales.js";
export default class OrdersManager {
  static async getAll() {
    try {
      const [orders] = await pool.query("SELECT orders.id ,orders.sale_id, products.name, products.price, orders.quantity, orders.amount,orders.order_cost, products.category FROM orders INNER JOIN products ON orders.product_id = products.id ORDER BY orders.id ASC;");
      return { payload: orders };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async getById(id, connection) {
    const dbClient = connection || pool;
    try {
      const [[order]] = await dbClient.execute("SELECT * FROM orders WHERE id = ?;", [id]);
      return { payload: order };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async getByOrderNumber(sale_id, connection) {
    try {
      const dbClient = connection || pool;
      const [orders] = await dbClient.execute("SELECT orders.id ,orders.sale_id, products.name, products.price, orders.quantity, orders.amount,orders.order_cost, products.category FROM orders INNER JOIN products ON orders.product_id = products.id WHERE orders.sale_id = ?  ORDER BY orders.id ASC;", [sale_id]);
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
      const { payload: order } = await this.getById(id);
      const [updatedOrder] = await connection.execute("UPDATE orders SET sale_id=?, product_id=? , quantity=?, amount=((SELECT price from products where id = ?)*?)  WHERE id=?;", [data.sale_id, data.product_id, data.quantity, data.product_id, data.quantity, id]);
      await this.updateOrderCost(order, data.quantity, connection);
      await ProductsManager.updateProductStock(order.product_id, order.quantity - data.quantity, connection);
      await SalesManager.recalculateSaleData(data.sale_id, connection);
      // await connection.execute("UPDATE sales SET items_quantity = (SELECT SUM(quantity) FROM orders WHERE sale_id = ? ), total_amount= (SELECT SUM(amount) FROM orders WHERE sale_id = ?) WHERE id = ?", [data.sale_id, data.sale_id, data.sale_id]);
      await connection.commit();
      return { payload: updatedOrder };
    } catch (error) {
      if (connection) connection.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (connection) connection.release();
    }
  }

  static async delete(id, connection) {
    let dbClient;
    try {
      dbClient = connection || (await pool.getConnection());
      await dbClient.beginTransaction();
      const [[{ sale_id, amount, product_id, quantity }]] = await dbClient.execute("SELECT sale_id,amount, quantity, product_id FROM orders WHERE id=?;", [id]);
      const [deletedOrder] = await dbClient.execute("DELETE FROM orders WHERE id =?;", [id]);
      const { payload: orders } = await this.getByOrderNumber(sale_id, dbClient);
      const [[{ costumer_id }]] = await dbClient.query("select costumer_id from sales where id = ?", [sale_id]);
      if (orders.length === 0) {
        await SalesManager.delete(sale_id, dbClient);
        await ProductsManager.updateProductStock(product_id, quantity, dbClient);
      } else {
        await dbClient.execute("UPDATE sales SET items_quantity = (SELECT SUM(quantity) FROM orders WHERE sale_id = ? ), total_amount= (SELECT SUM(amount) FROM orders WHERE sale_id = ?) WHERE id = ?;", [sale_id, sale_id, sale_id]);
        await SalesManager.recalculateSaleData(sale_id, dbClient);
        await ProductsManager.updateProductStock(product_id, quantity, dbClient);
      }
      await BalancesManager.addDebitCredit(costumer_id, -amount, dbClient);
      await dbClient.commit();
      return { payload: deletedOrder };
    } catch (error) {
      if (!connection && dbClient) dbClient.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    } finally {
      if (!connection && dbClient) dbClient.release();
    }
  }

  static async create(data, connection) {
    let dbClient;
    try {
      dbClient = connection || (await pool.getConnection());
      if (!connection) await dbClient.beginTransaction();
      await dbClient.execute("INSERT INTO orders (sale_id, product_id, quantity, amount,order_cost) VALUES(?,?,?,?,?)", [data.sale_id, data.product_id, data.quantity, data.amount, data.order_cost]);
      await ProductsManager.updateProductStock(data.product_id, -data.quantity, connection);
      if (!connection) await dbClient.commit();
      return { payload: "Order created." };
    } catch (error) {
      if (!connection && dbClient) await dbClient.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (!connection && dbClient) dbClient.release();
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
  static async updateOrderCost(order, quantity, connection) {
    let dbClient;
    try {
      dbClient = connection || (await pool.getConnection());
      const [[{ cost }]] = await dbClient.execute("SELECT cost FROM products WHERE id = ?", [order.product_id]);
      const [update] = await dbClient.execute("UPDATE orders SET order_cost = ? WHERE id = ?", [cost * quantity, order.id]);
      return { payload: update };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (!connection) dbClient.release();
    }
  }
}
