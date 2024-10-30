import { pool } from "../../config/dbconfig-mysql.js";
import { orderSchema } from "../../schemas/order.js";
export default class OrdersManager {
  static async getAll() {
    const [orders] = await pool.query("SELECT orders.id ,orders.sale_id, products.name, products.price, orders.quantity, orders.amount, products.category FROM orders INNER JOIN products ON orders.product_id = products.id ORDER BY orders.id ASC");
    return orders;
  }

  static async getById(id) {
    const [[order]] = await pool.execute("SELECT * FROM orders WHERE id = ?", [id]);
    return order;
  }

  static async getByOrderNumber(sale_id) {
    const [orders] = await pool.execute("SELECT orders.id ,orders.sale_id, products.name, products.price, orders.quantity, orders.amount, products.category FROM orders INNER JOIN products ON orders.product_id = products.id WHERE orders.sale_id = ? ORDER BY orders.id ASC", [sale_id]);
    return orders;
  }

  static async update(id, body) {
    let connection;
    try {
      const order = await this.getById(id);
      const updatedOrder = { ...order, ...body };
      if (!order) return { error: "The id provided does not correspond to any existing order" };
      const { success, data, error } = orderSchema.safeParse(updatedOrder);
      if (!success) return { error };
      connection = await pool.getConnection();
      await connection.beginTransaction();
      await connection.execute("UPDATE orders SET sale_id=?, product_id=? , quantity=?, amount=((SELECT price from products where id = ?)*?)  WHERE id=?", [data.sale_id, data.product_id, data.quantity, data.product_id, data.quantity, id]);
      await connection.execute("UPDATE sales SET items_quantity = (SELECT SUM(quantity) FROM orders WHERE sale_id = ? ), total_amount= (SELECT SUM(amount) FROM orders WHERE sale_id = ?) WHERE id = ?", [data.sale_id, data.sale_id, data.sale_id]);
      connection.commit();
      return updatedOrder;
    } catch (error) {
      if (connection) connection.rollback();
      return { status: "error", message: error };
    } finally {
      if (connection) connection.release();
    }
  }
  static async delete(id) {
    await pool.execute("DELETE FROM orders WHERE id =?", [id]);
    return { status: "success" };
  }
  static async create(body) {
    const { success, data, error } = orderSchema.safeParse({ id: 1, ...body });
    if (!success) return { error };
    if (error) {
      console.log(error.issues[0].path);
    }
    await pool.query("INSERT INTO orders (sale_id, product_id, quantity, amount) VALUES(?,?,?,?)", [data.sale_id, data.product_id, data.quantity, data.amount]);

    return { status: "success" };
  }
}
