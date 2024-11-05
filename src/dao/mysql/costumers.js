import { pool } from "../../config/dbconfig-mysql.js";
import { statusTypes } from "../../utils/responses.js";
export default class CostumersManager {
  static async getAll() {
    try {
      const [costumers] = await pool.query("SELECT * FROM costumers WHERE deleted_at IS NULL ORDER BY id ASC");
      return { payload: costumers };
    } catch (error) {
      throw { error };
    }
  }

  static async getById(id) {
    try {
      const [[costumer]] = await pool.execute("SELECT * FROM costumers WHERE id = ?", [id]);
      return { payload: costumer };
    } catch (error) {
      throw { error };
    }
  }
  static async update(id, data) {
    try {
      console.log(data);
      console.log(id);
      await pool.execute("UPDATE costumers SET name=?, account_number=? , logo=? , logo_public_id=?  WHERE id=?", [data.name, data.account_number, data.logo, data.logo_public_id, id]);
      return { payload: data };
    } catch (error) {
      throw { error };
    }
  }
  static async delete(id) {
    try {
      await pool.execute("UPDATE costumers SET deleted_at = CURRENT_TIMESTAMP WHERE id =?", [id]);
      return { payload: "Costumer deleted" };
    } catch (error) {
      throw { error };
    }
  }
  static async create(data) {
    try {
      await pool.execute("INSERT INTO costumers (name, account_number, logo, logo_public_id) VALUES(?,?,?,?);", [data.name, data.account_number, data.logo, data.logo_public_id]);
      return { payload: "Costumer created." };
    } catch (error) {
      throw { error };
    }
  }

  static async getImgPublicIdById(id) {
    try {
      const [[{ logo_public_id }]] = await pool.execute("SELECT logo_public_id FROM costumers WHERE id = ?", [id]);
      return { payload: logo_public_id };
    } catch (error) {
      throw { error };
    }
  }
}
