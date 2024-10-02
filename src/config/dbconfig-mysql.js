import mysql from "mysql2/promise";
import config from "./config.js";
export const pool = mysql.createPool({
  host: config.db.mysql.host,
  user: config.db.mysql.user,
  database: config.db.mysql.database,
  password: config.db.mysql.password,
  port: config.db.mysql.port,
});
