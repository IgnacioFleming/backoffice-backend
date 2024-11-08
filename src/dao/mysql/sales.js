import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
import BalancesManager from "./balances.js";
import OrdersManager from "./orders.js";
import ProductsManager from "./products.js";
export default class SalesManager {
  static async getAll() {
    try {
      const [sales] = await pool.query("SELECT sales.id as salesId , sales.*, costumers.* from sales INNER JOIN costumers ON sales.costumer_id = costumers.id");
      return { payload: sales };
    } catch (error) {
      throw err.sqlMessage ? createCustomError(ERRORS.DATABASE, err.sqlMessage) : reateCustomError(ERRORS.UNHANDLED, JSON.stringify(err, null, 2));
    }
  }

  static async getById(id) {
    try {
      const [[sale]] = await pool.execute("SELECT * FROM sales WHERE id = ?", [id]);
      return { payload: sale };
    } catch (error) {
      throw err.sqlMessage ? createCustomError(ERRORS.DATABASE, err.sqlMessage) : reateCustomError(ERRORS.UNHANDLED, JSON.stringify(err, null, 2));
    }
  }

  static async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const { payload: sale } = await this.getById(id);
      const [payload] = await connection.execute("DELETE FROM sales WHERE id =?", [id]);
      await BalancesManager.addDebit(sale.costumer_id, sale.total_amount);
      return { payload };
    } catch (error) {
      throw err.sqlMessage ? createCustomError(ERRORS.DATABASE, err.sqlMessage) : reateCustomError(ERRORS.UNHANDLED, JSON.stringify(err, null, 2));
    } finally {
      if (connection) connection.release();
    }
  }
  static async create(data) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      //creo la venta con items y monto en cero
      const [result] = await connection.execute("INSERT INTO sales (costumer_id, items_quantity, total_amount,sale_cost) VALUES(?,?,?,?)", [data.costumer_id, 0, data.total_amount, 0]);
      console.log(result, "venta");
      const sale_id = result.insertId;
      //
      let sale_cost = 0;
      let sale_items_quantity = 0;
      await Promise.all(
        //itero los products para crear cada una de las ordenes
        data.products.map(async ({ product_id, quantity, amount }) => {
          //recupero el costo del producto.
          const cost = await ProductsManager.getProductCostByProductId(product_id);
          const order_cost = cost * quantity;
          sale_cost += order_cost;
          sale_items_quantity += quantity;
          //creo las ordenes
          const [result] = await connection.execute("INSERT INTO orders (sale_id, product_id, quantity, amount,order_cost) VALUES(?,?,?,?,?)", [sale_id, product_id, quantity, amount, order_cost]);
          console.log(result);
        })
      );
      // actualizo el costo y la cantidad de items de la venta.
      console.log("paso la creacion de ordenes");
      // await SalesManager.recalculateSaleCostAndItemsQuantity(sale_id);
      const [[{ total_cost, total_quantity }]] = await connection.execute("SELECT sum(order_cost) as total_cost, sum(quantity) as total_quantity FROM orders WHERE sale_id = ?", [sale_id]);
      await connection.execute("UPDATE sales SET sale_cost = ?,items_quantity = ? WHERE id = ?", [total_cost, total_quantity, sale_id]);
      console.log("recalculo la venta");
      //agrego el credito en el balance
      await BalancesManager.addCredit(data.costumer_id, data.total_amount);

      console.log("agrego el credito al balance");
      await connection.commit();
      return { payload: "The transaction was completed successfully" };
    } catch (error) {
      if (connection) await connection.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (connection) connection.release();
    }
  }

  static async recalculateSaleCostAndItemsQuantity(sale_id) {
    try {
      const [[{ total_cost, total_quantity }]] = await pool.execute("SELECT sum(order_cost) as total_cost, sum(quantity) as total_quantity FROM orders WHERE sale_id = ?", [sale_id]);
      const [update] = await pool.execute("UPDATE sales SET sale_cost = ?,items_quantity = ? WHERE id = ?", [total_cost, total_quantity, sale_id]);
      return { payload: update };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    }
  }
}
