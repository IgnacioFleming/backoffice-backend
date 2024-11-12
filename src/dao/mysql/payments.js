import { pool } from "../../config/dbconfig-mysql.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
import BalancesManager from "./balances.js";

export default class PaymentsManager {
  static async create(body) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [payload] = await pool.execute("INSERT INTO payments (costumer_id, payment_amount) VALUES (?,?)", [body.costumer_id, -body.payment_amount]);
      await BalancesManager.addDebitCredit(body.costumer_id, -body.payment_amount, connection);
      return { payload };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (connection) connection.release();
    }
  }
}
