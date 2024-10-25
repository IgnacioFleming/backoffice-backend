import { pool } from "../../config/dbconfig-mysql.js";
import CostumersManager from "./costumers.js";

export default class MovementsManager {
  static async getById(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [movements] = await connection.execute(
        `
        SELECT  payment_amount AS amount, payment_date AS date, 'payment' AS type
        FROM payments
        WHERE costumer_id = ?
        UNION
        SELECT  total_amount AS amount, sale_date AS date, 'sale' AS type
        FROM sales 
        WHERE costumer_id = ?
        ORDER BY date ASC;`,
        [id, id]
      );
      const costumer = await CostumersManager.getById(id);
      const balance = movements.reduce((acc, { amount }) => acc + amount, 0);
      return { status: "success", payload: { costumer, movements, balance } };
    } catch (error) {
      console.log(error);
      return { status: "error", error };
    } finally {
      if (connection) connection.release();
    }
  }
}
