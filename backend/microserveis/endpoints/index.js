const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch;
const { isAuthProfe } = require('../autenticacio/index');
const { isAuthAlumne } = require('../autenticacio/index');
const http = require('http')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Server } = require('socket.io');
const URL = process.env.URL;
const port = process.env.PORT_ENDPOINTS;
const portSocket = process.env.PORT_ENDPOINTS_SOCKET;
const portBBDD = process.env.PORT_BBDD;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        transports: ["websocket", "polling"]
    }
});

io.on('connection', (socket) => {
    console.log('Usuari connectat:', socket.id);

    socket.on('getClasses', async (sessionId, userId, email) => {
        if (!sessionId || !userId) {
            return socket.emit('error', { missatge: "No Autenticat" });
        }
        try {
            let alumnes;
            if (isAuthProfe(sessionId, userId)) {
                alumnes = await getSQL("alumnesClasseProfe", { email, sessionId, userId });
            } else if (isAuthAlumne(sessionId, userId)) {
                alumnes = await getSQL("alumnesClasseAlumne", { email, sessionId, userId });
            } else {
                return socket.emit('error', { missatge: "No Autenticat" });
            }
            socket.emit('alumnes', alumnes);
        } catch (error) {
            console.error("Error processant 'getClasses':", error);
            socket.emit('error', { missatge: "Error en processar la sol·licitud" });
        }
    });

    socket.on('afegirClasse', async (data) => {
        const { codi_classe, email, sessionId, userId } = data;

        if (!sessionId || !userId) {
            return socket.emit('error', "No Autenticat");
        }

        let resposta;

        if (isAuthProfe(sessionId, userId)) {
            resposta = await putSQL("afegirClasseProfe", { codi_classe, email, sessionId, userId });
        } else if (isAuthAlumne(sessionId, userId)) {
            resposta = await putSQL("afegirClasseAlumne", { codi_classe, email, sessionId, userId });
        } else {
            return socket.emit('error', { missatge: "No Autenticat" });
        }
        
        socket.emit('classeAfegida', resposta);
        socket.broadcast.emit('actualitzarAlumnes', { email, sessionId, userId });
    });

    socket.on('afegirFormulari', async (data) => {
        const { id_classe,email, formulari, sessionId, userId } = data;
        console.log(formulari)
        console.log(id_classe)
        if (!sessionId || !userId) {
            return socket.emit('error', "No Autenticat");
        }

        if (!isAuthAlumne(sessionId, userId)) {
            return socket.emit('error', "No Autenticat");
        }

        const formulariAfegir = JSON.stringify(formulari);

        if (!formulariAfegir) {
            return socket.emit('error', "Falten camps");
        }

        const resposta = await putSQL("formulari", { id_classe, userId, formulariAfegir });
        const resposta2 = await putSQL("formulariAlumne", {userId});
        console.log(resposta2);
        socket.emit('formulariAfegit', resposta);
        socket.broadcast.emit('actualitzarAlumnes', { email, sessionId, userId });
    });

    socket.on('disconnect', () => {
        console.log('Usuari desconnectat:', socket.id);
    });
});


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
    email= req.query.email;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }
    if (isAuthProfe(sessionId, userId)) {
        const alumnes = await getSQL("alumnesClasseProfe", { email,sessionId, userId });
        return res.json(alumnes);
    }

    if (isAuthAlumne(sessionId, userId)){
        const alumnes = await getSQL("alumnesClasseAlumne", { email,sessionId, userId });
        return res.json(alumnes);
    }

    res.json({missatge: "No Autenticat"});
});

app.get("/classe", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    email= req.query.email;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }
    if (isAuthProfe(sessionId, userId)) {
        const alumnes = await getSQL("classeProf", { email,sessionId, userId });
        console.log(alumnes)
        return res.json(alumnes);
    }

    if (isAuthAlumne(sessionId, userId)){
        const alumnes = await getSQL("classeAlum", { email,sessionId, userId });
        console.log(alumnes)
        return res.json(alumnes);
    }
    
});

app.get("/formulariRespost", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    email= req.query.email;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }

    if (isAuthAlumne(sessionId, userId)){
        const resposta = await getSQL("formulariRespost", { email });
        return res.json(resposta);
    }
    
});

app.get("/haFetFormulari", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }

    if (isAuthAlumne(sessionId, userId)){
        const haFetFormulari = await getSQL("haFetFormulari", { userId });
        return res.json(haFetFormulari);
    }

    res.json({missatge: "No Autenticat"});
});

app.get("/classeForma", async (req, res) => {
    email= req.query.email;
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    }
    if (isAuthProfe(sessionId, userId)) {
        const alumnes = await getSQL("classeFormaProfe", { email, userId });
        return res.json(alumnes);
    }

    if (isAuthAlumne(sessionId, userId)){
        const alumnes = await getSQL("classeFormaAlumne", { email, userId });
        console.log(alumnes)
        return res.json(alumnes);
    }

});

app.get("/tutor", async (req, res) => {
    id_classe= req.query.id_classe;
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    } else {
        const tutor = await getSQL("tutor", { id_classe });
        console.log(tutor)
        return res.json(tutor);
    }
});


app.post("/classes", async (req, res) => {
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    email= req.query.email;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("No Autenticat");
    }

    const { classe, codi_random, id_curs } = req.body;

    if (!classe || !codi_random || !id_curs) {
         res.json({missatge: "Falten camps"});
    }
        const classes = await postSQL("classes", { email, classe, codi_random, id_curs });
         res.json({classes});
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
    codi_classe= req.query.codi_classe;
    email= req.query.email;
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.send("No Autenticat");
    }
    if (isAuthProfe(sessionId, userId)) {
        const resposta = await putSQL("afegirClasseProfe", { codi_classe, email,sessionId, userId });
        return res.json(resposta);
    }
    if (isAuthAlumne(sessionId, userId)) {
        const resposta = await putSQL("afegirClasseAlumne", { codi_classe, email,sessionId, userId });
        return res.json(resposta);
    }
    res.json({missatge: "No Autenticat"});
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

  app.get("/resultats", async (req, res) => {
    id_classe= req.query.id_classe;
    sessionId = req.query.sessionId;
    userId = req.query.userId;
    if (!req.query.sessionId || !req.query.userId) {
        return res.json({missatge: "No Autenticat"});
    } else {
        const resultats = await getSQL("resultats", { id_classe,sessionId,userId });
        console.log("RESULTADOS DEL EDNPOINT /rESUKTATS",resultats)
        return res.json(resultats);
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
            console.log(`Servei d'Endpoints corrent a ${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`El port ${port} ja està en ús, però el servidor està funcionant.`);
            } else {
                console.error(err);
            }
        });
        server.listen(portSocket, () => {
            console.log(`Servidor Sockets Endpoints corrent a ${portSocket}`);
        });
    }
    if (message.action === 'stop') {
        process.send('exit')
        process.exit();
    }
});


