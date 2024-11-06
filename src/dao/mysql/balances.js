import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";

export default class BalancesManager {
  static async getAll() {
    try {
      const [balances] = await pool.query("SELECT costumer_id,balance_amount ,costumers.account_number, costumers.name, costumers.logo FROM balances JOIN costumers ON balances.costumer_id = costumers.id;");
      return { payload: balances };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED);
    }
  }
}
