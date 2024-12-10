const express = require('express');
const cors = require('cors');
const port = 22556;
const fetch = globalThis.fetch;
const { isAuthProfe } = require('../autenticacio/index');
const { isAuthAlumne } = require('../autenticacio/index');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env')});
const URL = process.env.URL;

const app = express();
app.use(cors());

app.get("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    if (!req.query.sessionId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId)) {
        return res.send("No Autenticat");
    } else {
        const classes = await getSQL("classes");
        res.json(classes);
    }
});

app.get("/tutors", async (req, res) => {
    sessionId = req.query.sessionId;
    if (!req.query.sessionId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId)) {
        return res.send("No Autenticat");
    } else {
        const tutors = await getSQL("tutors");
        res.json(tutors);
    }
});

app.get("/alumnes", async (req, res) => {
    sessionId = req.query.sessionId;
    if (!req.query.sessionId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId)) {
        return res.send("No Autenticat");
    } else {
        const alumnes = await getSQL("alumnes");
        res.json(alumnes);
    }
});

app.post("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    if (!req.query.sessionId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId)) {
        return res.send("No Autenticat");
    } else {
        const nomClasse = req.query.nomClasse;
        if (!nomClasse) {
            return res.status(400).send("Falta paràmetre nomClasse");
        }
        const classes = await postSQL("classe", { nomClasse });
        res.json(classes);
    }
});

app.delete("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    if (!req.query.sessionId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId)) {
        return res.send("No Autenticat");
    } else {
        const idClasse = req.query.idClasse;
        if (!idClasse) {
            return res.status(400).send("Falta paràmetre idClasse");
        }
        const classes = await deleteSQL("classe", { idClasse });
        res.json(classes);
    }
});

app.put("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    if (!req.query.sessionId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId)) {
        return res.send("No Autenticat");
    } else {
        const nomClasse = req.query.nomClasse;
        const idClasse = req.query.idClasse;
        if (!nomClasse || !idClasse) {
            return res.status(400).send("Falta paràmetre nomClasse o idClasse");
        }
        const classes = await putSQL("classe", { nomClasse, idClasse });
        res.json(classes);
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

async function postSQL(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${URL}:26666/${endpoint}?${queryParams}` : `${URL}:26666/${endpoint}`;

    const resposta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await resposta.json();
}

async function deleteSQL(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${URL}:26666/${endpoint}?${queryParams}` : `${URL}:26666/${endpoint}`;

    const resposta = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const dades = await resposta.json();
    return dades;
}

async function putSQL(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${URL}:26666/${endpoint}?${queryParams}` : `${URL}:26666/${endpoint}`;

    const resposta = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const dades = await resposta.json();
    return dades;
}


process.on('message', (message) => {
    if (message.action === 'start') {
        app.listen(port, () => {
            console.log(`Servei d'Endpoints corrent al port ${port}`);
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