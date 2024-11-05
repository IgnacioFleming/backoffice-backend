import { pool } from "../../config/dbconfig-mysql.js";
import { productSchema } from "../../schemas/product.js";
export default class ProductsManager {
  static async getAll() {
    try {
      const [products] = await pool.query("SELECT * FROM products where deleted_at IS NULL ORDER BY id ASC;");
      return { payload: products };
    } catch (error) {
      throw { error };
    }
  }

  static async getById(id) {
    try {
      const [[product]] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
      return { payload: product };
    } catch (error) {
      throw { error };
    }
  }
  static async update(id, data) {
    try {
      await pool.execute("UPDATE products SET name=?, price=? , stock=?, category=?, description=?, thumbnail=?, thumbnail_public_id=?  WHERE id=?", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail, data.thumbnail_public_id, id]);
      return { payload: updatedProduct };
    } catch (error) {
      throw { error };
    }
  }
  static async delete(id) {
    try {
      await pool.execute("UPDATE products SET deleted_at = current_timestamp WHERE id =?", [id]);
      return { payload: "Product deleted." };
    } catch (error) {
      throw { error };
    }
  }
  static async create(data) {
    try {
      await pool.query("INSERT INTO products (name, price, stock, category, description, thumbnail, thumbnail_public_id) VALUES(?,?,?,?,?,?,?)", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail, data.thumbnail_public_id]);
      return { payload: "Product created." };
    } catch (error) {
      throw { error };
    }
  }

  static async getImgPublicIdById(id) {
    try {
      const [[{ thumbnail_public_id }]] = await pool.execute("SELECT thumbnail_public_id FROM products WHERE id = ?", [id]);
      return { payload: thumbnail_public_id };
    } catch (error) {
      throw { error };
    }
  }
}
