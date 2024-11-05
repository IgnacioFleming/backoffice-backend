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

      return { payload: body };
    } catch (error) {
      return { error };
    } finally {
      if (connection) connection.release();
    }
  }

  static async getAll() {
    try {
      const [users] = await pool.query("SELECT * FROM users;");
      return { payload: users };
    } catch (error) {
      throw { error };
    }
  }

  static async getByUsername(username) {
    try {
      const [[user]] = await pool.execute("SELECT * FROM users WHERE username = ?", [username]);
      if (!user) return { error: "User does not exist." };
      return { payload: user };
    } catch (error) {
      throw { error };
    }
  }

  static async getById(id) {
    try {
      const [[user]] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
      if (!user) return { status: "error", error: "User does not exist." };
      return { payload: user };
    } catch (error) {
      throw { error };
    }
  }
  static async handleUserState(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [[{ is_enabled }]] = await connection.execute("SELECT is_enabled FROM users WHERE id = ?", [id]);
      const newState = is_enabled === 0 ? 1 : 0;
      const [state] = await connection.execute("UPDATE users SET is_enabled = ? WHERE id = ?;", [newState, id]);
      return { payload: state };
    } catch (error) {
      throw { error };
    } finally {
      if (connection) connection.release();
    }
  }
}
