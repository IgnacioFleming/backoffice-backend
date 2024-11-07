import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
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
      const [payload] = await connection.execute("DELETE FROM sales WHERE id =?", [id]);
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
      const [result] = await connection.execute("INSERT INTO sales (costumer_id, items_quantity, total_amount) VALUES(?,?,?)", [data.costumer_id, data.items_quantity, data.total_amount]);
      const saleId = result.insertId;

      await Promise.all(
        data.products.map(async (product) => {
          console.log(product, "product");
          await connection.execute("INSERT INTO orders (sale_id, product_id, quantity, amount) VALUES(?,?,?,?)", [saleId, product.product_id, product.quantity, product.amount]);
        })
      );
      await connection.commit();
      return { payload: "The transaction was completed successfully" };
    } catch (error) {
      if (connection) await connection.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED);
    } finally {
      if (connection) connection.release();
    }
  }
}
