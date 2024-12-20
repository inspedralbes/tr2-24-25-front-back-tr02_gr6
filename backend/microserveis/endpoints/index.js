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
    if (isAuthProfe(sessionId, userId)||isAuthAlumne(sessionId, userId)) {
        const classes = await getSQL("classes");
        return res.json(classes);
    }
});

app.get("/classes/:course_code", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("Falten Camps");
    }
    if (isAuthProfe(sessionId, userId)||isAuthAlumne(sessionId, userId)) {

    const courseCode = req.params.course_code;
        const classes = await getSQL("classes/" + courseCode);
        return res.json(classes);
}
});

app.get("/tutors", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }
    if (!isAuthProfe(sessionId, userId)) {
        return res.json({missatge: "No Autenticat"});
    } else {
        const tutors = await getSQL("tutors");
        res.json(tutors);
    }
});

app.get("/alumnes", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }
    if (!isAuthProfe(sessionId, userId)) {
        return res.json({missatge: "No Autenticat"});
    } else {
        const alumnes = await getSQL("alumnes");
        res.json(alumnes);
    }
});

app.get("/alumnesClasse", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }
    if (isAuthProfe(sessionId, userId)) {
        const alumnes = await getSQL("alumnesClasseProfe", { userId });
        return res.json(alumnes);
    }

    if (isAuthAlumne(sessionId, userId)){
        const alumnes = await getSQL("alumnesClasseAlumne", { userId });
        return res.json(alumnes);
    }

    res.json({missatge: "No Autenticat"});
});

app.post("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("No Autenticat");
    }

    if (!isAuthProfe(sessionId, userId)) {
        return res.json({missatge: "No Autenticat"});
    }

    const { classe, codi_random, id_curs } = req.body;

    if (!classe || !codi_random || !id_curs) {
        return res.json({missatge: "Falten camps"});
    }
        const classes = await postSQL("classes", { classe, codi_random, id_curs });
        return res.json(classes);
});

app.delete("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        res.json({missatge: "No Autenticat"});
    }
    if (!isAuthProfe(sessionId,  userId)) {
        res.json({missatge: "No Autenticat"});;
    } else {
        const idClasse = req.query.idClasse;
        if (!idClasse) {
            res.json({missatge: "Falta el paràmetre idClasse"});
        }
        const classes = await deleteSQL("classe", { idClasse });
        res.json(classes);
    }
});

app.put("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }
    if (!isAuthProfe(sessionId,  userId)) {
        return res.json({missatge: "No Autenticat"});
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

app.put("/afegirClasse", async (req, res) => {
    const { sessionId, userId, codi_classe } = req.query;
    if (!sessionId || !userId) {
        return res.send("No Autenticat");
    }
    if (isAuthProfe(sessionId, userId)) {
        const resposta = await putSQL("afegirClasseProfe", { userId, codi_classe });
        return res.json(resposta);
    }
    if (isAuthAlumne(sessionId, userId)) {
        const resposta = await putSQL("afegirClasseAlumne", { userId, codi_classe });
        return res.json(resposta);
    }
    res.json({missatge: "No Autenticat"});
});


app.put("/formulari", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }

    if (!isAuthAlumne(sessionId, userId)) {
        return res.json({missatge: "No Autenticat"});
    }

    const formulariEstringuejar = req.body;
    const formulari = JSON.stringify(formulariEstringuejar)

    if (!formulari) {
        return res.json({missatge: "Falten camps"});
    }
        
        const resposta = await putSQL("formulari", { userId, formulari });
        res.json(resposta);
});

app.post("/registre", async (req, res) => {
    try {
        const { email, contrassenya, nom, cognoms } = req.body;
        if (!nom || !email || !cognoms || !contrassenya) {
            return res.status(400).send("Falten paràmetres");
        }
        const missatge = await postSQL("registre", { email, nom, cognoms, contrassenya });
        res.send(missatge)
        console.log(missatge)
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
        body: JSON.stringify(params),
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


