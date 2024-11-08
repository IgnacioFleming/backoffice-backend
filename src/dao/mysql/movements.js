import { pool } from "../../config/dbconfig-mysql.js";
import CustomError from "../../utils/errors/customError.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
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
      const { payload: costumer } = await CostumersManager.getById(id);
      if (!costumer) throw createCustomError(ERRORS.NOT_FOUND);
      const balance = movements.reduce((acc, { amount }) => acc + amount, 0);
      return { payload: { costumer, movements, balance } };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    } finally {
      if (connection) connection.release();
    }
  }
}
