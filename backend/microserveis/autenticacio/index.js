const express = require('express');
const cors = require('cors');
const port = 22556;
const fetch = globalThis.fetch;

const app = express();
app.use(cors());

app.get("/hola", (req, res) => {
    res.send("Autenticacio!")
});

app.get("/centres", async (req, res) => {
    const centres = await getSQL("centres");
    res.send(centres);
});

async function getSQL(endpoint) {
        const resposta = await fetch(`http://localhost:26666/${endpoint}`, {
            method: 'GET',
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
            console.log(`Servei d'Autenticacio corrents a ${port}`);
        });
    }
    if (message.action === 'stop') {
        process.send('exit')
        process.exit();
    }
});