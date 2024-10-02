import { pool } from "../../config/dbconfig-mysql.js";
import { productSchema } from "../../schemas/products.js";
export default class ProductsManager {
  static async getAll() {
    const [products] = await pool.query("SELECT * FROM products ORDER BY id ASC");
    return products;
  }

  static async getById(id) {
    const [[product]] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
    return product;
  }
  static async update(id, body) {
    const product = await this.getById(id);
    const updatedProduct = { ...product, ...body };
    if (!product) return { error: "The id provided does not correspond to any existing product" };
    const { success, data, error } = productSchema.safeParse(updatedProduct);
    if (!success) return { error };
    await pool.execute("UPDATE products SET name=?, price=? , stock=?, category=?, description=?, thumbnail=?  WHERE id=?", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail, id]);
    return updatedProduct;
  }
  static async delete(id) {
    await pool.execute("DELETE FROM products WHERE id =?", [id]);
    const deletedProduct = await this.getById(id);
    return deletedProduct;
  }
  static async create(body) {
    const { success, data, error } = productSchema.safeParse({ id: 1, ...body });
    if (!success) return { error };
    const [result] = await pool.query("INSERT INTO products (name, price, stock, category, description, thumbnail) VALUES(?,?,?,?,?,?)", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail]);
    const product = await this.getById(result.insertId);
    return product;
  }
}
