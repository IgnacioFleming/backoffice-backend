import { pool } from "../../config/dbconfig-mysql.js";
import { costumerSchema } from "../../schemas/costumers.js";
export default class CostumersManager {
  static async getAll() {
    const costumers = await pool.query("SELECT * FROM costumers ORDER BY id ASC");
    return costumers.rows;
  }

  static async getById(id) {
    const [costumer] = await pool.execute("SELECT * FROM costumers WHERE id = ?", [id]);
    return costumer;
  }
  static async update(id, body) {
    const costumer = await this.getById(id);
    const updatedCostumer = { ...costumer, ...body };
    if (!costumer) return { error: "The id provided does not correspond to any existing costumer" };
    const { success, data, error } = costumerSchema.safeParse(updatedCostumer);
    if (!success) return { error };
    await pool.execute("UPDATE costumers SET name=?, account_number=? , logo=?  WHERE id=?", [data.name, data.account_number, data.logo, id]);
    return updatedCostumer;
  }
  static async delete(id) {
    await pool.execute("DELETE FROM costumers WHERE id =? RETURNING *", [id]);
    const deletedCostumer = this.getById(id);
    return deletedCostumer;
  }
  static async create(body) {
    try {
      const { success, data, error } = costumerSchema.safeParse({ id: 1, ...body });
      if (!success) return { error };

      const result = await pool.execute("INSERT INTO costumers (name, account_number, logo) VALUES(?,?,?)", [data.name, data.account_number, data.logo]);
      const costumer = await this.getById(result.insertId);
      return costumer;
    } catch (error) {
      return { error };
    }
  }
}
