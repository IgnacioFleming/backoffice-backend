import { pool } from "../../config/dbconfig-mysql.js";

export default class UsersManager {
  static async create(body) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [[existingUser]] = await connection.execute("SELECT id FROM users WHERE username = ?", [body.username]);
      if (existingUser) return { status: "error", error: "Username already exists." };
      const [result] = await connection.execute("INSERT INTO users (username, password,email, first_name, last_name) VALUES (?, ?, ?, ?, ?)", [body.username, body.password, body.email, body.first_name, body.last_name]);
      body.id = result.insertId;

      return { status: "success", payload: body };
    } catch (error) {
      return { status: "error", error };
    } finally {
      if (connection) connection.release();
    }
  }

  static async getAll() {
    try {
      const [users] = await pool.query("SELECT * FROM users;");
      return { payload: users };
    } catch (error) {
      throw error;
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

  static async getById(id) {
    try {
      const [[user]] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
      if (!user) return { status: "error", error: "User does not exist." };
      return { status: "success", payload: user };
    } catch (error) {
      return { status: "error", error };
    }
  }
  static async handleUserState(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [[{ is_enabled }]] = await connection.execute("SELECT is_enabled FROM users WHERE id = ?", [id]);
      const newState = is_enabled === 0 ? 1 : 0;
      const [state] = await connection.execute("UPDATE users SET is_enabled = ? WHERE id = ?;", [newState, id]);
      return { status: "success", payload: state };
    } catch (error) {
      return { status: "error", error };
    } finally {
      if (connection) connection.release();
    }
  }
}
