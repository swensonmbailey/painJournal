const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,   // your phpMyAdmin password
    database: process.env.DATABASE
});

module.exports = pool;