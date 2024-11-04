import { pool } from "../../config/dbconfig-mysql.js";
import { productSchema, productSchemaOptional } from "../../schemas/product.js";
export default class ProductsManager {
  static async getAll() {
    const [products] = await pool.query("SELECT * FROM products where deleted_at IS NULL ORDER BY id ASC;");
    return { payload: products };
  }

  static async getById(id) {
    const [[product]] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
    return { payload: product };
  }
  static async update(id, body) {
    const product = await this.getById(id);
    if (!product) return { error: "The id provided does not correspond to any existing product" };
    const updatedProduct = { ...product, ...body };
    updatedProduct.thumbnail_public_id ?? delete updatedProduct.thumbnail_public_id;
    const { success, data, error } = productSchemaOptional.safeParse(updatedProduct);
    if (!success) return { error };
    await pool.execute("UPDATE products SET name=?, price=? , stock=?, category=?, description=?, thumbnail=?, thumbnail_public_id=?  WHERE id=?", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail, data.thumbnail_public_id || null, id]);
    return updatedProduct;
  }
  static async delete(id) {
    await pool.execute("UPDATE products SET deleted_at = current_timestamp WHERE id =?", [id]);
    return { status: "success" };
  }
  static async create(data) {
    await pool.query("INSERT INTO products (name, price, stock, category, description, thumbnail, thumbnail_public_id) VALUES(?,?,?,?,?,?,?)", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail, data.thumbnail_public_id]);
    return { status: statusTypes.SUCCESS, payload: "Product created." };
  }

  static async getImgPublicIdById(id) {
    try {
      const [[{ thumbnail_public_id }]] = await pool.execute("SELECT thumbnail_public_id FROM products WHERE id = ?", [id]);
      return thumbnail_public_id;
    } catch (error) {}
  }
}
