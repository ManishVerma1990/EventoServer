import mysql from "mysql2/promise";

const mysqlPool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "evento",
});

export default mysqlPool;
