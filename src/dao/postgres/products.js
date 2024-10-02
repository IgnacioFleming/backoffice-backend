import { pool } from "../../config/dbconfig-pg.js";
import { productSchema } from "../../schemas/products.js";
export default class ProductsManager {
  static async getAll() {
    const products = await pool.query("SELECT * FROM products ORDER BY id ASC");
    return products.rows;
  }

  static async getById(id) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    const [product] = result.rows;
    return product;
  }
  static async update(id, body) {
    const product = await this.getById(id);
    if (!product) return { error: "The id provided does not correspond to any existing product" };
    const { success, data, error } = productSchema.safeParse({ ...product, ...body });
    if (!success) return { error };
    const result = await pool.query("UPDATE products SET name=$1, price=$2 , stock=$3, category=$4, description=$5, thumbnail=$6  WHERE id=$7 RETURNING *", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail, id]);
    const [updatedProduct] = result.rows;
    return updatedProduct;
  }
  static async delete(id) {
    const deletedProduct = await pool.query("DELETE FROM products WHERE id =$1 RETURNING *", [id]);
    return deletedProduct;
  }
  static async create(body) {
    const { success, data, error } = productSchema.safeParse({ id: 1, ...body });
    if (!success) return { error };
    const result = await pool.query("INSERT INTO products (name, price, stock, category, description, thumbnail) VALUES($1,$2,$3,$4,$5,$6) RETURNING *", [data.name, data.price, data.stock, data.category, data.description, data.thumbnail]);
    const [product] = result.rows;
    return product;
  }
}
