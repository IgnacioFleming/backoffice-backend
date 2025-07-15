import mysql from "mysql2/promise";
import config from "./config.js";

export const connectionOptions = {
  host: config.db.mysql.host,
  user: config.db.mysql.user,
  database: config.db.mysql.database,
  password: config.db.mysql.password,
  port: config.db.mysql.port,
};
<<<<<<< HEAD

=======
>>>>>>> develop
export const pool = mysql.createPool(connectionOptions);
