import { pool } from "../../config/dbconfig-mysql.js";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
export default class OrdersManager {
  static async getAll() {
    try {
      const [orders] = await pool.query("SELECT orders.id ,orders.sale_id, products.name, products.price, orders.quantity, orders.amount, products.category FROM orders INNER JOIN products ON orders.product_id = products.id ORDER BY orders.id ASC");
      return { payload: orders };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED);
    }
  }

  static async getById(id) {
    try {
      const [[order]] = await pool.execute("SELECT * FROM orders WHERE id = ?", [id]);
      return { payload: order };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED);
    }
  }

  static async getByOrderNumber(sale_id) {
    try {
      const [orders] = await pool.execute("SELECT orders.id ,orders.sale_id, products.name, products.price, orders.quantity, orders.amount, products.category FROM orders INNER JOIN products ON orders.product_id = products.id WHERE orders.sale_id = ? ORDER BY orders.id ASC", [sale_id]);
      return { payload: orders };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED);
    }
  }

  static async update(id, data) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      await connection.execute("UPDATE orders SET sale_id=?, product_id=? , quantity=?, amount=((SELECT price from products where id = ?)*?)  WHERE id=?", [data.sale_id, data.product_id, data.quantity, data.product_id, data.quantity, id]);
      await connection.execute("UPDATE sales SET items_quantity = (SELECT SUM(quantity) FROM orders WHERE sale_id = ? ), total_amount= (SELECT SUM(amount) FROM orders WHERE sale_id = ?) WHERE id = ?", [data.sale_id, data.sale_id, data.sale_id]);
      connection.commit();
      return { payload: updatedOrder };
    } catch (error) {
      if (connection) connection.rollback();
      throw createCustomError(ERRORS.UNHANDLED);
    } finally {
      if (connection) connection.release();
    }
  }

  static async delete(id) {
    try {
      await pool.execute("DELETE FROM orders WHERE id =?", [id]);
      return { payload: "Order deleted successfully." };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED);
    }
  }

  static async create(data) {
    try {
      await pool.query("INSERT INTO orders (sale_id, product_id, quantity, amount) VALUES(?,?,?,?)", [data.sale_id, data.product_id, data.quantity, data.amount]);
      return { payload: "Order created." };
    } catch (error) {
      throw createCustomError(ERRORS.UNHANDLED);
    }
  }
}
