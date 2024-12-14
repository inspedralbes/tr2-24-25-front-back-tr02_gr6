const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch;
const { isAuthProfe } = require('../autenticacio/index');
const { isAuthAlumne } = require('../autenticacio/index');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const URL = process.env.URL;
const port = process.env.PORT_ENDPOINTS;
const portBBDD = process.env.PORT_BBDD;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("Falten Camps");
    }
    if (!isAuthProfe(sessionId, userId)) {
        return res.send("No Autenticat");
    } else {
        const classes = await getSQL("classes");
        res.json(classes);
    }
});

app.get("/tutors", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId, userId)) {
        return res.send("No Autenticat");
    } else {
        const tutors = await getSQL("tutors");
        res.json(tutors);
    }
});

app.get("/alumnes", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId, userId)) {
        return res.send("No Autenticat");
    } else {
        const alumnes = await getSQL("alumnes");
        res.json(alumnes);
    }
});

app.post("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId,  userId)) {
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
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId,  userId)) {
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
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("No Autenticat");
    }
    if (!isAuthProfe(sessionId,  userId)) {
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

app.post("/registre", async (req, res) => {
    try {
        const { email, contrassenya, nom, cognoms } = req.body;
        if (!nom || !email || !cognoms || !contrassenya) {
            return res.status(400).send("Falten paràmetres");
        }
        const missatge = await postSQL("registre", { email, nom, cognoms, contrassenya });
        res.send(missatge)
    } catch(error){
        console.log("Error /registre: " + error);
        return res.status(500).send("Falten paràmetres");
    }
    
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

async function postSQL(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${URL}:${portBBDD}/${endpoint}?${queryParams}` : `${URL}:${portBBDD}/${endpoint}`;

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
    const url = queryParams ? `${URL}:${portBBDD}/${endpoint}?${queryParams}` : `${URL}:${portBBDD}/${endpoint}`;

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
    const url = queryParams ? `${URL}:${portBBDD}/${endpoint}?${queryParams}` : `${URL}:${portBBDD}/${endpoint}`;

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


