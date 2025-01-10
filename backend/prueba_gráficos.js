// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const db = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'cesc'
};

app.get('/resultats/:id_clase', async (req, res) => {
    const id_clase = req.params.id_clase;
    const connection = await mysql.createConnection(db);
    const query = `SELECT res.id_clase, r.nom_alumne, 
        res.totalAgressivitat, res.agressivitatFisica, res.agressivitatVerbal, 
        res.agressivitatRelacional, res.prosocialitat, res.totalVictimitzacio, 
        res.victimitzacioFisica, res.victimitzacioVerbal, res.victimitzacioRelacional, 
        res.popular_SN, res.rebutjat_SN, res.ignorat_SN, res.controvertit_SN, 
        res.norma_SN FROM resultats res JOIN respostes_processades r 
        ON res.id_clase = r.id_clase AND res.id_alumne = r.id_alumne 
        WHERE res.id_clase = ?`;

    const [rows] = await connection.execute(query, [id_clase]);
    if (rows.length > 0) {
        const data = rows.map(row => ({
            name: row.nom_alumne,
            children: [
                {
                    name: 'Agressivitat',
                    children: [
                        { name: 'Física', value: row.agressivitatFisica },
                        { name: 'Verbal', value: row.agressivitatVerbal },
                        { name: 'Relacional', value: row.agressivitatRelacional }
                    ],
                },
                {
                    name: 'Prosocialitat',
                    value: row.prosocialitat,
                },
                {
                    name: 'Victimització',
                    children: [
                        { name: 'Física', value: row.victimitzacioFisica },
                        { name: 'Verbal', value: row.victimitzacioVerbal },
                        { name: 'Relacional', value: row.victimitzacioRelacional },
                    ]
                },
                {
                    name: 'Popular',
                    value: row.popular_SN
                },
                {
                    name: 'Rebutjat',
                    value: row.rebutjat_SN
                },
                {
                    name: 'Ignorat',
                    value: row.ignorat_SN
                },
                {
                    name: 'Controvertit',
                    value: row.controvertit_SN
                },
                {
                    name: 'Normatiu',
                    value: row.norma_SN
                }
            ]
        }));
        connection.end();
        res.json(data);
        console.log(data)
    }
    else {
        connection.end();
        console.log('Error al obtener datos desde el servidor.')
    }
});

const PORT = 19999;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
