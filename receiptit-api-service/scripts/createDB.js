require('dotenv').config();
const mysql = require("mysql2/promise");
const env = process.env.NODE_ENV || "development";
const dbConfig = require("../lib/db/config/database")[env];

mysql.createConnection({
    host: dbConfig.host || "127.0.0.1",
    port: dbConfig.port || "3306",
    user: dbConfig.username || "root",
    password: dbConfig.password || "password",
}).then(connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`).then((res) => {
        console.info("Database create or successfully checked");
        process.exit(0);
    });
});