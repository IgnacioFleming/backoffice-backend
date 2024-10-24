import MySQLStore from "express-mysql-session";
import session from "express-session";
import { connectionOptions, pool } from "./dbconfig-mysql.js";
import mysql from "mysql2";

const mySQLStore = MySQLStore(session);
const connection = mysql.createPool(connectionOptions);

export const sessionStore = new mySQLStore({}, connection);
