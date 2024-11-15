import MySQLStore from "express-mysql-session";
import session from "express-session";
import { pool } from "./dbconfig-mysql.js";

const mySQLStore = MySQLStore(session);
// const connection = mysql.createPool(connectionOptions);

export const sessionStore = new mySQLStore({}, pool);
