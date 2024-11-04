import { pool } from "../../config/dbconfig-mysql.js";
import { saleSchema } from "../../schemas/sale.js";
export default class SalesManager {
  static async getAll() {
    try {
      const [sales] = await pool.query("SELECT sales.id as salesId , sales.*, costumers.* from sales INNER JOIN costumers ON sales.costumer_id = costumers.id");
      return { payload: sales };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const [[sale]] = await pool.execute("SELECT * FROM sales WHERE id = ?", [id]);
    return sale;
  }

  static async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute("DELETE FROM sales WHERE id =?", [id]);
      if (result.affectedRows === 0) return { status: "error", message: "The sale register weren't found" };
      return { status: "success", message: "Sale successfully deleted." };
    } catch (error) {
      return { status: "error", error };
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
        products.map(async (product) => {
          await connection.execute("INSERT INTO orders (sale_id, product_id, quantity, amount) VALUES(?,?,?,?)", [saleId, product.id, product.quantity, product.amount]);
        })
      );

      await connection.commit();
      return { payload: "The transaction was completed successfully" };
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}
