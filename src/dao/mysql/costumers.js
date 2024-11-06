import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
export default class CostumersManager {
  static async getAll() {
    try {
      const [costumers] = await pool.query("SELECT * FROM costumers WHERE deleted_at IS NULL ORDER BY id ASC");
      return { payload: costumers };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED, error?.sqlMessage);
    }
  }

  static async getById(id) {
    try {
      const [[costumer]] = await pool.execute("SELECT * FROM costumers WHERE id = ?", [id]);
      return { payload: costumer };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED, error?.sqlMessage);
    }
  }
  static async update(id, data) {
    try {
      console.log(data);
      console.log(id);
      await pool.execute("UPDATE costumers SET name=?, account_number=? , logo=? , logo_public_id=?  WHERE id=?", [data.name, data.account_number, data.logo, data.logo_public_id, id]);
      return { payload: data };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED, error?.sqlMessage);
    }
  }
  static async delete(id) {
    try {
      await pool.execute("UPDATE costumers SET deleted_at = CURRENT_TIMESTAMP WHERE id =?", [id]);
      return { payload: "Costumer deleted" };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED, error?.sqlMessage);
    }
  }
  static async create(data) {
    try {
      console.log(data, "desde el model");
      const newCostumer = await pool.execute("INSERT INTO costumers (name, account_number, logo, logo_public_id) VALUES(?,?,?,?);", [data.name, data.account_number, data.logo, data.logo_public_id]);
      console.log(newCostumer);
      return { payload: "Costumer created." };
    } catch (error) {
      console.log(error);
      throw createCustomError(ERRORS.UNHANDLED, error?.sqlMessage);
    }
  }

  static async getImgPublicIdById(id) {
    try {
      const [[{ logo_public_id }]] = await pool.execute("SELECT logo_public_id FROM costumers WHERE id = ?", [id]);
      return { payload: logo_public_id };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED, error?.sqlMessage);
    }
  }
}
