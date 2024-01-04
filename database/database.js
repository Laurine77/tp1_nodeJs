const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.DBHOST,
    database: process.env.DBDATABSE,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD
})

module.exports = pool