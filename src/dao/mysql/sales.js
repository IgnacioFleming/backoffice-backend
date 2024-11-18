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

  static async delete(id, connection) {
    let dbClient;
    try {
      dbClient = connection || (await pool.getConnection());
      if (!connection) await dbClient.beginTransaction();
      const { payload: orders } = await OrdersManager.getByOrderNumber(id, connection);
      await Promise.all(orders.map(async (order) => await OrdersManager.delete(order.id, connection)));
      const [payload] = await dbClient.execute("DELETE FROM sales WHERE id =?", [id]);
      if (!connection) await dbClient.commit();
      return { payload };
    } catch (error) {
      if (!connection && dbClient) await dbClient.rollback();
      throw err.sqlMessage ? createCustomError(ERRORS.DATABASE, err.sqlMessage) : reateCustomError(ERRORS.UNHANDLED, JSON.stringify(err, null, 2));
    } finally {
      if (!connection && dbClient) dbClient.release();
    }
  }
  static async create(data) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      //creo la venta con items y monto en cero
      const [result] = await connection.execute("INSERT INTO sales (costumer_id, items_quantity, total_amount,sale_cost) VALUES(?,?,?,?)", [data.costumer_id, 0, data.total_amount, 0]);
      const sale_id = result.insertId;
      let sale_cost = 0;
      let sale_items_quantity = 0;
      await Promise.all(
        data.products.map(async ({ product_id, quantity, amount }) => {
          const cost = await ProductsManager.getProductCostByProductId(product_id);
          const order_cost = cost * quantity;
          sale_cost += order_cost;
          sale_items_quantity += quantity;
          await OrdersManager.create({ sale_id, product_id, quantity, amount, order_cost }, connection);
        })
      );

      await this.recalculateSaleData(sale_id, connection);
      await BalancesManager.addDebitCredit(data.costumer_id, data.total_amount);
      await connection.commit();
      return { payload: "The transaction was completed successfully" };
    } catch (error) {
      if (connection) await connection.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (connection) connection.release();
    }
  }

  static async recalculateSaleData(sale_id, connection) {
    const dbClient = connection || pool;
    try {
      const [[{ total_cost, total_quantity, total_amount }]] = await dbClient.execute("SELECT sum(order_cost) as total_cost, sum(quantity) as total_quantity, sum(amount) as total_amount FROM orders WHERE sale_id = ?", [sale_id]);
      const [result] = await connection.execute("UPDATE sales SET sale_cost = ?,items_quantity = ?, total_amount = ? WHERE id = ?", [total_cost, total_quantity, total_amount, sale_id]);
      return { payload: result };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    }
  }

  static async getThisMonthSales() {
    try {
      const [monthlySales] = await pool.query(`
        SELECT SUM(total_amount) AS total_amount_per_day, DAY(sale_date) AS sale_day, MONTH(sale_date) AS sale_month
        FROM sales
        WHERE sale_date >= NOW() - INTERVAL 1 MONTH
        GROUP BY sale_day, sale_month;
        `);
      return { payload: monthlySales };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    }
  }
}
