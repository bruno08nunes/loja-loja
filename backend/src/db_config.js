const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "loja_loja"
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySQL Conectado");
});

module.exports = connection;