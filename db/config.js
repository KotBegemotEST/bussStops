const mysql = require("mysql")
const connection = mysql.createConnetction({

    host:"localhost",
    user:"root",
    password:"",
    database:"bussstops"
})

connection.connect()