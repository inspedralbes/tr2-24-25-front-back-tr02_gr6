const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch;
const { v4: uuidv4 } = require('uuid');
const path = require('path');
module.exports = { isAuthProfe, isAuthAlumne };
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const fs = require('fs')
const URL = process.env.URL;
const port = process.env.PORT_AUTH;
const portBBDD = process.env.PORT_BBDD;


const sessionsProfeAutenticades = []
const sessionsAlumneAutenticades = []

const app = express();
app.use(cors());

app.get("/auth", async (req, res) => {
    const { email, contrassenya } = req.query;
    if (!email || !contrassenya) {
        return res.status(400).send({ error: "Falten paràmetres: email i/o contrassenya." });
    }
    const auth = await getSQL("auth", { email, contrassenya });
    if (auth.resposta == "profeAutenticat") {
        const tutorId = auth.tutorId;
        if (alreadySessionProfe(tutorId)) {
            return res.json(getSessionProfe(tutorId));
        } else {
            const sessionId = uuidv4();
            const tutorAutenticat = { sessionId, tutorId };
            registrarSessioProfe(tutorAutenticat);
            getSessionsProfe();
            console.log(sessionsProfeAutenticades);
            return res.json(tutorAutenticat);
        }
    }
    if (auth.resposta == "alumneAutenticat") {
        const alumneId = auth.alumneId;
        if (alreadySessionAlumne(alumneId)) {
            return res.json(getSessionAlumne(alumneId));
        } else {
            const sessionId = uuidv4();
            const alumneAutenticat = { sessionId, alumneId };
            registrarSessioAlumne(alumneAutenticat);
            getSessionsAlumne();
            console.log(sessionsAlumneAutenticades);
            return res.json(alumneAutenticat);
        }
    }
    if (auth.resposta == "noAutenticat") {
        return res.json({ Error: "No Autenticat" });
    }
});

app.get("/comprovar", async (req, res) => {
    res.json(sessionsProfeAutenticades)
});

app.get("/comprovarAlumnes", async (req, res) => {
    res.json(sessionsAlumneAutenticades)
});


async function getSQL(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${URL}:${portBBDD}/${endpoint}?${queryParams}` : `${URL}:${portBBDD}/${endpoint}`;

    const resposta = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const dades = await resposta.json();
    return dades;
}

function isAuthProfe(sessionId, tutorId) {
    for (const sessio of sessionsProfeAutenticades) {
        if (sessio.sessionId === sessionId && sessio.tutorId === Number(tutorId)) {
            return true;
        }
    }
    console.log(`Sessió no vàlida per sessionId: ${sessionId}, tutorId: ${tutorId}`);
    return false;
}


function alreadySessionProfe(tutorId) {
    for (const sessio of sessionsProfeAutenticades) {
        if (sessio.tutorId === tutorId) {
            return true;
        }
    }
    return false;
}

function getSessionProfe(tutorId) {
    for (const sessio of sessionsProfeAutenticades) {
        if (sessio.tutorId === tutorId) {
            return sessio;
        }
    }
    return false;
}

function getSessionsProfe() {
    const filePath = `${process.cwd()}/sessions`;
    const filePathSession = `${process.cwd()}/sessions/profes.json`;
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    if (!fs.existsSync(filePathSession)) {
        fs.writeFileSync(filePathSession, '[]');
    }
    const data = fs.readFileSync(filePathSession, 'utf-8');
    try {
        const jsonData = JSON.parse(data || '[]');
        sessionsProfeAutenticades.push(...jsonData);
    } catch (err) {
        console.error("Error analitzant el JSON:", err);
    }
}

function registrarSessioProfe(sessio) {
    const filePathSession = `${process.cwd()}/sessions/profes.json`;
    let dadesExistents = [];
    if (fs.existsSync(filePathSession)) {
        const dades = fs.readFileSync(filePathSession, 'utf-8');
        if (dades) {
            try {
                dadesExistents = JSON.parse(dades);
            } catch (err) {
                console.error("Error analitzant el JSON existent:", err);
            }
        }
    }
    dadesExistents.push(sessio);
    try {
        fs.writeFileSync(filePathSession, JSON.stringify(dadesExistents, null, 2));
    } catch (err) {
        console.error("Error escrivint al fitxer:", err);
    }
}




function isAuthAlumne(sessionId, alumneId) {
    for (const sessio of sessionsAlumneAutenticades) {
        if (sessio.sessionId === sessionId && sessio.alumneId === Number(alumneId)) {
            return true;
        }
    }
    console.log(`Sessió no vàlida per sessionId: ${sessionId}, alumneId: ${alumneId}`);
    return false;
}

function alreadySessionAlumne(alumneId) {
    for (const sessio of sessionsAlumneAutenticades) {
        if (sessio.alumneId === alumneId) {
            return true;
        }
    }
    return false;
}

function getSessionAlumne(alumneId) {
    for (const sessio of sessionsAlumneAutenticades) {
        if (sessio.alumneId === alumneId) {
            return sessio;
        }
    }
    return false;
}

function getSessionsAlumne() {
    const filePath = `${process.cwd()}/sessions`;
    const filePathSession = `${process.cwd()}/sessions/alumnes.json`;
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    if (!fs.existsSync(filePathSession)) {
        fs.writeFileSync(filePathSession, '[]');
    }
    const data = fs.readFileSync(filePathSession, 'utf-8');
    try {
        const jsonData = JSON.parse(data || '[]');
        sessionsAlumneAutenticades.push(...jsonData);
    } catch (err) {
        console.error("Error analitzant el JSON:", err);
    }
}

function registrarSessioAlumne(sessio) {
    const filePathSession = `${process.cwd()}/sessions/alumnes.json`;
    let dadesExistents = [];
    if (fs.existsSync(filePathSession)) {
        const dades = fs.readFileSync(filePathSession, 'utf-8');
        if (dades) {
            try {
                dadesExistents = JSON.parse(dades);
            } catch (err) {
                console.error("Error analitzant el JSON existent:", err);
            }
        }
    }
    dadesExistents.push(sessio);
    try {
        fs.writeFileSync(filePathSession, JSON.stringify(dadesExistents, null, 2));
    } catch (err) {
        console.error("Error escrivint al fitxer:", err);
    }
}

process.on('message', (message) => {
    if (message.action === 'start') {
        getSessionsProfe();
        getSessionsAlumne();
        app.listen(port, () => {
            console.log(`Servei d'Autenticacio corrents a ${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`El port ${port} ja està en ús.`);
            } else {
                console.error(err);
            }
        });
    }
    if (message.action === 'stop') {
        process.send('exit')
        process.exit();
    }
});