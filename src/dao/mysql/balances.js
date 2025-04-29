import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";

export default class BalancesManager {
  static async getAll() {
    try {
      const [balances] = await pool.query("SELECT costumer_id ,balance_amount ,costumers.account_number, costumers.name, costumers.logo FROM balances JOIN costumers ON balances.costumer_id = costumers.id WHERE costumers.deleted_at is null;");
      return { payload: balances };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
  static async create({ costumer_id, balance_amount = 0 }) {
    try {
      const [newBalance] = await pool.execute("INSERT INTO balances (costumer_id,balance_amount) VALUES (?,?)", [costumer_id, balance_amount]);
      return { payload: newBalance };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
  static async addDebitCredit(costumer_id, amount, connection) {
    const dbClient = connection || pool;
    try {
      const [newCredit] = await dbClient.execute("UPDATE balances SET balance_amount = balance_amount + ? WHERE costumer_id = ?", [amount, costumer_id]);
      return { payload: newCredit };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
}
