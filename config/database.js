require("dotenv").config();
const { Sequelize } = require("sequelize");

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql"
};

// SSL uniquement en production
if (process.env.NODE_ENV === "production") {
    config.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    };
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    config
);

console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);

module.exports = sequelize;