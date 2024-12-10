const express = require('express');
const cors = require('cors');
const port = 22557;
const fetch = globalThis.fetch;
const { v4: uuidv4 } = require('uuid');
module.exports = { isAuthProfe, isAuthAlumne};
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env')});
const URL = process.env.URL;

let sessionsProfeAutenticades = []
let sessionsAlumneAutenticades = []

const app = express();
app.use(cors());

app.get("/auth", async (req, res) => {
    const { email, contrassenya } = req.query;
    if (!email || !contrassenya) {
        return res.status(400).send({ error: "Falten paràmetres: email i/o contrassenya." });
    }
    const auth = await getSQL("auth", { email, contrassenya });
    if (auth.resposta == "profeAutenticat") {
        sessionId = uuidv4();
        sessionsProfeAutenticades.push(sessionId);
        return res.send(sessionId);
    }
    if (auth.resposta == "alumneAutenticat") {
        sessionId = uuidv4();
        sessionsAlumneAutenticades.push(sessionId);
        return res.send(sessionId);
    }
    if (auth.resposta == "noAutenticat") {
        return res.send("No Autenticat");
    }
});

async function getSQL(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${URL}:26666/${endpoint}?${queryParams}` : `${URL}:26666/${endpoint}`;

    const resposta = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const dades = await resposta.json();
    return dades;
}

function isAuthProfe(sessionId) {
    for (const sessio of sessionsProfeAutenticades) {
        if (sessio == sessionId) {
            return true;
        }
    }
    return false;
}

function isAuthAlumne(sessionId) {
    for (const sessio of sessionsAlumneAutenticades) {
        if (sessio == sessionId) {
            return true;
        }
    }
    return false;
}

process.on('message', (message) => {
    if (message.action === 'start') {
        app.listen(port, () => {
            console.log(`Servei d'Autenticacio corrents a ${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`El port ${port} ja està en ús.`);
            } else {
                console.error(err);
            }
        });
        
        sessionsProfeAutenticades.push("root");
        sessionsAlumneAutenticades.push("root");
    }
    if (message.action === 'stop') {
        process.send('exit')
        process.exit();
    }
});