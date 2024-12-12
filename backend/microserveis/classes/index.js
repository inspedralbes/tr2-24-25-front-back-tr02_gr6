const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");
const { isAuthProfe } = require("../autenticacio/index");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const port = process.env.PORT_CLASSES || 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
let sessionsProfeAutenticades = []
let sessionsAlumneAutenticades = []

app.get("/classes", async (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId || !isAuthProfe(sessionId)) {
    return res.status(401).send("No Autenticat");
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SELECT * FROM Classes");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener clases:", err);
    res.status(500).send("Error al obtener datos de clases");
  } finally {
    if (connection) await connection.end();
  }
});

app.get("/classes/:course_code", async (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId || !isAuthProfe(sessionId)) {
    return res.status(401).send("No Autenticat");
  }

  const courseCode = req.params.course_code;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(`Fetching classes for course_code: ${courseCode}`);
    const [rows] = await connection.query(
      `SELECT c.id_classe, c.classe, c.codi_random
       FROM classes c
       JOIN cursos co ON c.id_curs = co.id_curs
       WHERE co.nom_curs = ?`,
      [courseCode]
    );
    console.log("Query result:", rows);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener clases por curso:", err);
    res.status(500).send("Error al obtener datos de clases");
  } finally {
    if (connection) await connection.end();
  }
});

app.post("/classes", async (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId || !isAuthProfe(sessionId)) {
    return res.status(401).send("No Autenticat");
  }

  const { classe, codi_random, id_curs } = req.body;
  if (!classe || !codi_random || !id_curs) {
    return res.status(400).send("Faltan parámetros: classe, codi_random o id_curs");
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const query = "INSERT INTO classes (classe, codi_random, id_curs) VALUES (?, ?, ?)";
    await connection.query(query, [classe, codi_random, id_curs]);
    res.status(201).send({ message: "Clase agregada correctamente" });
  } catch (err) {
    console.error("Error al agregar clase:", err);
    res.status(500).send("Error al agregar clase");
  } finally {
    if (connection) await connection.end();
  }
});

async function testDatabaseConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Conectado a la base de datos MySQL");
    await connection.end();
  } catch (err) {
    console.error("Error al conectar a MySQL:", err);
    process.exit(1);
  }
}
testDatabaseConnection();

process.on("message", (message) => {
  if (message.action === "start") {
    app.listen(port, () => {
      console.log(`Microservei Classes corrent al port ${port}`);
    });
    sessionsProfeAutenticades.push("root");
    sessionsAlumneAutenticades.push("root");

  }
  if (message.action === "stop") {
    process.send("exit");
    process.exit();
  }
});
