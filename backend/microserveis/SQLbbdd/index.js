const express = require('express');
const cors = require('cors');
const port = 26666;
const mysql = require('mysql2');

const app = express();
app.use(cors());

var centres = [];

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: 'tr6',
    port: 3306,
    connectionLimit: 10
});

app.get("/centres", (req, res) => {
    res.json(centres);
});

function getCentres(connection) {
    connection.query('SELECT * FROM centres', (err, results) => {
      if (err) {
        console.error('Error:', err);
      } else {
        centres = results;
      }
    });
  }

process.on('message', (message) => {
    if (message.action === 'start') {
        app.listen(port, () => {
            console.log(`Servei de Bases de Dades corrents a ${port}`);
        });
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection from pool:', err);
                return;
            }
        
            getCentres(connection);
        
            connection.release();
        });
    }
    if (message.action === 'stop') {
        process.send('exit')
        process.exit();
    }
});