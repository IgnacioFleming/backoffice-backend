import { pool } from "../../config/dbconfig-mysql.js";
import CustomError from "../../utils/errors/customError.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
import OrdersManager from "./orders.js";
import SalesManager from "./sales.js";
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
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      const [payload] = await pool.execute("UPDATE products SET name=?, price=? ,cost=?, stock=?, category=?, description=?, thumbnail=?, thumbnail_public_id=?  WHERE id=?", [data.name, data.price, data.cost, data.stock, data.category, data.description, data.thumbnail || null, data.thumbnail_public_id || null, id]);
      connection.commit();
      return { payload };
    } catch (error) {
      if (connection) connection.rollback();
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(error, null, 2));
    } finally {
      if (connection) connection.release();
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
      const [payload] = await pool.query("INSERT INTO products (name, price,cost, stock, category, description, thumbnail, thumbnail_public_id) VALUES(?,?,?,?,?,?,?)", [data.name, data.price, data.cost, data.stock, data.category, data.description, data.thumbnail, data.thumbnail_public_id]);
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
      throw err.sqlMessage ? createCustomError(ERRORS.DATABASE, err.sqlMessage) : createCustomError(ERRORS.UNHANDLED, JSON.stringify(err, null, 2));
    }
  }
  static async getProductCostByProductId(product_id) {
    try {
      const [[{ cost }]] = await pool.execute("SELECT cost FROM products WHERE id = ?", [product_id]);
      return cost;
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    }
  }
  static async updateProductStock(product_id, stock_update, connection) {
    let dbClient;
    try {
      dbClient = connection || (await pool.getConnection());
      const [result] = await dbClient.execute(
        `
        UPDATE products SET stock = stock + ? WHERE id = ?
        `,
        [stock_update, product_id]
      );
      return result;
    } catch (error) {
      throw error.sqlMessage ? createCustomError(ERRORS.DATABASE, error.sqlMessage) : createCustomError(ERRORS.UNHANDLED, error);
    } finally {
      if (!connection && dbClient) dbClient.release();
    }
  }
}
