import { pool } from "../../config/dbconfig-pg.js";
import { costumerSchema } from "../../schemas/costumers.js";
export default class CostumersManager {
  static async getAll() {
    const costumers = await pool.query("SELECT * FROM costumers ORDER BY id ASC");
    return costumers.rows;
  }

  static async getById(id) {
    const result = await pool.query("SELECT * FROM costumers WHERE id = $1", [id]);
    const [costumer] = result.rows;
    return costumer;
  }
  static async update(id, body) {
    const costumer = await this.getById(id);
    if (!costumer) return { error: "The id provided does not correspond to any existing costumer" };
    const { success, data, error } = costumerSchema.safeParse({ ...costumer, ...body });
    if (!success) return { error };
    const result = await pool.query("UPDATE costumers SET name=$1, account_number=$2 , logo=$3  WHERE id=$4 RETURNING *", [data.name, data.account_number, data.logo, id]);
    const [updatedCostumer] = result.rows;
    return updatedCostumer;
  }
  static async delete(id) {
    const deletedCostumer = await pool.query("DELETE FROM costumers WHERE id =$1 RETURNING *", [id]);
    return deletedCostumer;
  }
  static async create(body) {
    try {
      const { success, data, error } = costumerSchema.safeParse({ id: 1, ...body });
      if (!success) return { error };

      const result = await pool.query("INSERT INTO costumers (name, account_number, logo) VALUES($1,$2,$3) RETURNING *", [data.name, data.account_number, data.logo]);

      const [costumer] = result.rows;
      return costumer;
    } catch (error) {
      return { error };
    }
  }
}
