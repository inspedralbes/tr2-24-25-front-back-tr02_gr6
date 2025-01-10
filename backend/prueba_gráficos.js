// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());

// Configuración de la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Cambiar por la contraseña real
    database: 'cesc' // Cambiar por el nombre de tu base de datos
};

// Ruta para obtener datos de `respostes`
app.get('/respostes', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM respostes');
        res.json(rows);
        connection.end();
    } catch (error) {
        console.error('Problema al obtener respuestas');
    }
});


// Ruta para obtener resultados
app.get('/resultats', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM resultats');
        res.json(rows);
        connection.end();
    } catch (error) {
        console.error('Problema al obtener resultados')
    }
});

// Servidor en marcha
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
