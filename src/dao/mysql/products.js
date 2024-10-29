import { pool } from "../../config/dbconfig-mysql.js";
import { productSchema } from "../../schemas/product.js";
export default class ProductsManager {
  static async getAll() {
    const [products] = await pool.query("SELECT * FROM products where deleted_at is null ORDER BY id ASC;");
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
    await pool.execute("UPDATE products SET deleted_at = current_timestamp WHERE id =?", [id]);
    return { status: "success" };
  }
  static async create(body) {
    const { success, data, error } = productSchema.safeParse({ id: 1, ...body });
    if (!success) return { error };
    if (error) return { status: "error", error: error.issues[0].path };
    await pool.query("INSERT INTO products (name, price, stock, category, description, thumbnail) VALUES(?,?,?,?,?,?)", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail]);

    return { status: "success" };
  }
}
