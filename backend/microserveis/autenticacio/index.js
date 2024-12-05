const express = require('express');
const cors = require('cors');
const port = 22556;
const { fork } = require('child_process');

const app = express();
app.use(cors());

app.get("/hola", (req, res) => {
    res.send("Autenticacio!")
});

app.get("/centres", (req, res) => {
    
    res.send(centres)
});

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