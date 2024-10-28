import { pool } from "../../config/dbconfig-mysql.js";
import { costumerSchema } from "../../schemas/costumer.js";
export default class CostumersManager {
  static async getAll() {
    const [costumers] = await pool.query("SELECT * FROM costumers ORDER BY id ASC");
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
      await pool.execute("UPDATE costumers SET name=?, account_number=? , logo=?  WHERE id=?", [data.name, data.account_number, data.logo, id]);
      return updatedCostumer;
    } catch (error) {
      console.log(error);
    }
  }
  static async delete(id) {
    await pool.execute("DELETE FROM costumers WHERE id =?", [id]);

    return { status: "success" };
  }
  static async create(body) {
    try {
      const { success, data, error } = costumerSchema.safeParse({ id: 1, ...body });
      if (!success) return { error };

      await pool.execute("INSERT INTO costumers (name, account_number, logo) VALUES(?,?,?)", [data.name, data.account_number, data.logo]);
      return { status: "success" };
    } catch (error) {
      return { error };
    }
  }
}
