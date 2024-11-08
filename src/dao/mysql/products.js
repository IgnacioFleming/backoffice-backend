import { pool } from "../../config/dbconfig-mysql.js";
import CustomError from "../../utils/errors/customError.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
export default class ProductsManager {
  static async getAll() {
    try {
      const [products] = await pool.query("SELECT * FROM products where deleted_at IS NULL ORDER BY id ASC;");
      return { payload: products };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async getById(id) {
    try {
      const [[product]] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
      return { payload: product };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
  static async update(id, data) {
    try {
      console.log("llego al update");
      const [payload] = await pool.execute("UPDATE products SET name=?, price=? , stock=?, category=?, description=?, thumbnail=?, thumbnail_public_id=?  WHERE id=?", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail || null, data.thumbnail_public_id || null, id]);
      return { payload };
    } catch (error) {
      console.log("paso por el catch");
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
  static async delete(id) {
    try {
      const [payload] = await pool.execute("UPDATE products SET deleted_at = current_timestamp WHERE id =?", [id]);
      return { payload };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }
  static async create(data) {
    try {
      const [payload] = await pool.query("INSERT INTO products (name, price, stock, category, description, thumbnail, thumbnail_public_id) VALUES(?,?,?,?,?,?,?)", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail, data.thumbnail_public_id]);
      return { payload };
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    }
  }

  static async getImgPublicIdById(id) {
    try {
      const [[payload]] = await pool.execute("SELECT thumbnail_public_id FROM products WHERE id = ?", [id]);
      return { payload: payload?.thumbnail_public_id };
    } catch (err) {
      throw err.sqlMessage ? createCustomError(ERRORS.DATABASE, err.sqlMessage) : reateCustomError(ERRORS.UNHANDLED, JSON.stringify(err, null, 2));
    }
  }
}
