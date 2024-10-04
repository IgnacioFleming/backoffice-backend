import pg from "pg";
import config from "./config.js";
const { Pool, types } = pg;
types.setTypeParser(1700, (val) => {
  return val === null ? null : parseFloat(val);
});
export const pool = new Pool({
  user: config.db.pg.user,
  password: config.db.pg.password,
  host: config.db.pg.host,
  port: config.db.pg.port,
  database: config.db.pg.database,
});
