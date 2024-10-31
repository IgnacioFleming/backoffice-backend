import { pool } from "../../config/dbconfig-mysql.js";
import { costumerSchema } from "../../schemas/costumer.js";
export default class CostumersManager {
  static async getAll() {
    const [costumers] = await pool.query("SELECT * FROM costumers WHERE deleted_at IS NULL ORDER BY id ASC");
    return costumers;
  }

  static async getById(id) {
    const [[costumer]] = await pool.execute("SELECT * FROM costumers WHERE id = ?", [id]);
    return costumer;
  }
  static async update(id, body) {
    try {
      const costumer = await this.getById(id);
      const updatedCostumer = { ...costumer, ...body };
      if (!costumer) return { error: "The id provided does not correspond to any existing costumer" };
      const { success, data, error } = costumerSchema.safeParse(updatedCostumer);
      if (!success) return { error };
      await pool.execute("UPDATE costumers SET name=?, account_number=? , logo=? , logo_public_id=?  WHERE id=?", [data.name, data.account_number, data.logo, data.logo_public_id, id]);
      return updatedCostumer;
    } catch (error) {
      console.log(error);
    }
  }
  static async delete(id) {
    await pool.execute("UPDATE costumers SET deleted_at = CURRENT_TIMESTAMP WHERE id =?", [id]);

    return { status: "success" };
  }
  static async create(body) {
    try {
      const { success, data, error } = costumerSchema.safeParse({ id: 1, ...body });
      if (!success) return { error };
      await pool.execute("INSERT INTO costumers (name, account_number, logo,logo_public_id) VALUES(?,?,?,?);", [data.name, data.account_number, data.logo, data.logo_public_id]);
      return { status: "success" };
    } catch (error) {
      return { error };
    }
  }

  static async getImgPublicIdById(id) {
    try {
      const [[{ logo_public_id }]] = await pool.execute("SELECT logo_public_id FROM costumers WHERE id = ?", [id]);
      return logo_public_id;
    } catch (error) {}
  }
}
