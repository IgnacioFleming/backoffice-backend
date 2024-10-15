import { pool } from "../../config/dbconfig-mysql.js";
import UserDto from "../dto/user.js";

export default class UsersManager {
  static async create(body) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [[existingUser]] = await connection.execute("SELECT id FROM users WHERE username = ?", [body.username]);
      if (existingUser) return { status: "error", error: "Username already exists." };
      const [result] = await connection.execute("INSERT INTO users (username, password, first_name, last_name) VALUES (?, ?, ?, ?)", [body.username, body.password, body.first_name, body.last_name]);
      body.id = result.insertId;

      return { status: "success", payload: body };
    } catch (error) {
      return { status: "error", error };
    } finally {
      if (connection) connection.release();
    }
  }

  static async getByUsername(username) {
    try {
      const [[user]] = await pool.execute("SELECT * FROM users WHERE username = ?", [username]);
      if (!user) return { status: "error", error: "User does not exist." };
      return { status: "success", payload: user };
    } catch (error) {
      return { status: "error", error };
    }
  }
}
