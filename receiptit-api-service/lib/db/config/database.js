require('dotenv').config();
let dbConfig = {
    "development": {
        "username": process.env.DEV_DB_USER,
        "password": process.env.DEV_DB_PASSWORD,
        "database": process.env.DEV_DB_DATABASE,
        "host": process.env.DEV_DB_HOST,
        "dialect": process.env.DEV_DB_DIALECT
    },
    "production": {
        "username": process.env.PROD_DB_USER,
        "password": process.env.PROD_DB_PASSWORD,
        "database": process.env.PROD_DB_DATABASE,
        "host": process.env.PROD_DB_HOST,
        "dialect": process.env.PROD_DB_DIALECT
    }
};

module.exports = dbConfig;