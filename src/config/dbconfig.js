import pg from "pg";
import config from "./config.js";
const { Pool, types } = pg;
types.setTypeParser(1700, (val) => {
  return val === null ? null : parseFloat(val);
});
export const pool = new Pool({
  user: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
});
