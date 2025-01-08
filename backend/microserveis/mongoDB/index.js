const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT_MONGO;
const user = process.env.MONGO_USER;
const passsowrd = process.env.MONGO_PASSWORD;
const cluster = process.env.MONGO_CLUSTER;

const logSchema = new mongoose.Schema({
    microservei: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);


async function logMessage(microservei, message) {
    try {
        const log = new Log({ microservei, message });
        await log.save();
    } catch (err) {
        console.error('Error en guardar el log:', err);
    }
}

async function getLogs(microservei) {
    try {
        const logs = await Log.find({ microservei }).sort({ timestamp: -1 });
        return logs;
    } catch (err) {
        console.error('Error en obtenir els logs:', err);
        return [];
    }
}

process.on('message', async (message) => { // Assegura't que és async
    if (message.action === 'start') {
        app.listen(port, () => {
            console.log(`Servei de MongoDB corrent a ${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`El port ${port} ja està en ús, però el servidor està funcionant.`);
            } else {
                console.error(err);
            }
        });
        mongoose.connect(`mongodb+srv://${user}:${passsowrd}@${cluster}.hrrx5.mongodb.net/?retryWrites=true&w=majority&appName=TR2G6`)
            .catch(err => console.error('Error en connectar a MongoDB Atlas:', err));
    }
    if (message.action === 'stop') {
        process.send('exit');
        process.exit();
    }
    if (message.action === 'getLog') {
        const logs = await getLogs(message.servei);
        const simplifiedLogs = logs.map(log => ({
            message: log.message,
            timestamp: log.timestamp
        }));
        process.send({ logs: simplifiedLogs });
    }
    if (message.action === 'encendreLog') {
        await logMessage(message.servei, `Microservei de ${message.servei} encés.`);
    }
    if (message.action === 'apagarLog') {
        await logMessage(message.servei, `Microservei de ${message.servei} apagat.`);
    }
});