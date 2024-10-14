import { pool } from "../../config/dbconfig-mysql.js";
import { saleSchema } from "../../schemas/sale.js";
export default class SalesManager {
  static async getAll() {
    const [sales] = await pool.query("SELECT sales.id as salesId , sales.*, costumers.* from sales INNER JOIN costumers ON sales.costumer_id = costumers.id");
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
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute("DELETE FROM sales WHERE id =?", [id]);
      if (result.affectedRows === 0) return { status: "error", message: "The sale register weren't found" };
      return { status: "success", message: "Sale successfully deleted." };
    } catch (error) {
      return { status: "error", error };
    } finally {
      if (connection) connection.release();
    }
  }
  static async create({ costumer_id, items_quantity, total_amount, products }) {
    let connection;
    try {
      const saleData = { id: 1, order_number: 1, costumer_id, items_quantity, total_amount, is_payed: false, is_delivered: false };
      const { success, data, error } = saleSchema.safeParse(saleData);
      if (!success) return { error };
      if (error) {
        console.log(error);
        console.log(error.issues[0].path);
      }
      connection = await pool.getConnection();
      await connection.beginTransaction();
      const [result] = await connection.execute("INSERT INTO sales (costumer_id, items_quantity, total_amount) VALUES(?,?,?)", [data.costumer_id, data.items_quantity, data.total_amount]);
      const saleId = result.insertId;

      await Promise.all(
        products.map(async (product) => {
          await connection.execute("INSERT INTO orders (order_number, product_id, quantity, amount) VALUES(?,?,?,?)", [saleId, product.id, product.quantity, product.amount]);
        })
      );

      await connection.commit();
      console.log("transaccion completada con exito");
    } catch (error) {
      if (connection) await connection.rollback();
      console.log("error en la transacción, se revierten los cambios ", error);
    } finally {
      if (connection) connection.release();
    }

    return { status: "success" };
  }
}
