import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
import BalancesManager from "./balances.js";
export default class CostumersManager {
  static async getAll() {
    try {
      const [costumers] = await pool.query("SELECT * FROM costumers WHERE deleted_at IS NULL ORDER BY id ASC");
      return { payload: costumers };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async getById(id) {
    try {
      const [[costumer]] = await pool.execute("SELECT * FROM costumers WHERE id = ?", [id]);
      return { payload: costumer };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
  static async update(id, data) {
    try {
      await pool.execute("UPDATE costumers SET name=?, account_number=? , logo=? , logo_public_id=?  WHERE id=?", [data.name, data.account_number, data.logo, data.logo_public_id, id]);
      return { payload: data };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
  static async delete(id) {
    try {
      const [deletedCostumer] = await pool.execute("UPDATE costumers SET deleted_at = CURRENT_TIMESTAMP WHERE id =?", [id]);
      return { payload: deletedCostumer };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
  static async create(data) {
    try {
      const [newCostumer] = await pool.execute("INSERT INTO costumers (name, account_number, logo, logo_public_id) VALUES(?,?,?,?);", [data.name, data.account_number, data.logo || null, data.logo_public_id || null]);
      console.log(newCostumer);
      await BalancesManager.create({ costumer_id: newCostumer.insertId });
      return { payload: newCostumer };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async getImgPublicIdById(id) {
    try {
      const [[payload]] = await pool.execute("SELECT logo_public_id FROM costumers WHERE id = ?", [id]);
      return { payload: payload.logo_public_id };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
}
