import { pool } from "../../config/dbconfig-mysql.js";
import { orderSchema } from "../../schemas/order.js";
export default class SalesManager {
  static async getAll() {
    const [sales] = await pool.query("SELECT * from sales INNER JOIN costumers ON sales.costumer_id = costumers.id");
    return sales;
  }

  static async getById(id) {
    const [[sale]] = await pool.execute("SELECT * FROM sales WHERE id = ?", [id]);
    return sale;
  }
  //   static async update(id, body) {
  //     const sale = await this.getById(id);
  //     const updatedOrder = { ...order, ...body };
  //     if (!order) return { error: "The id provided does not correspond to any existing order" };
  //     const { success, data, error } = orderSchema.safeParse(updatedOrder);
  //     if (!success) return { error };
  //     await pool.execute("UPDATE orders SET order_number=?, product_id=? , quantity=?, amount=?  WHERE id=?", [data.order_number, data.product_id, data.quantity, data.amount, id]);
  //     return updatedOrder;
  //   }
  static async delete(id) {
    await pool.execute("DELETE FROM orders WHERE id =?", [id]);
    return { status: "success" };
  }
  static async create(body) {
    const { success, data, error } = orderSchema.safeParse({ id: 1, ...body });
    if (!success) return { error };
    if (error) {
      console.log(error);
      console.log(error.issues[0].path);
    }
    await pool.query("INSERT INTO orders (order_number, product_id, quantity, amount) VALUES(?,?,?,?)", [data.order_number, data.product_id, data.quantity, data.amount]);

    return { status: "success" };
  }
}
