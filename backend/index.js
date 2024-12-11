const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json({ limit: "200mb" }));
app.use(cors());

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

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

//-------------------------CLASSES----------------------------
app.get("/getClasses", async (req,res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SELECT * FROM classes");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener alumnos:", err);
    res.status(500).send("Error al obtener datos de alumnos");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.get("/classes/:course_code", async (req,res) => {
  let connection;
  const courseCode = req.params.course_code;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(`SELECT c.id_classe, c.classe 
             FROM classes c
             JOIN courses co ON c.id_course = co.id_course
             WHERE co.course_code = ?`,
            [courseCode])

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener alumnos:", err);
    res.status(500).send("Error al obtener datos de alumnos");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
})

// ------------------------ USUARIOS -------------------------
app.get("/getAlum", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SELECT * FROM alumnes");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener alumnos:", err);
    res.status(500).send("Error al obtener datos de alumnos");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.get("/getTutor", async (req,res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SELECT * FROM tutors");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener alumnos:", err);
    res.status(500).send("Error al obtener datos de alumnos");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.get("/getProf", async (req, res) => {
  const { email, password } = req.query;  

  if (!email || !password) {
    return res.status(400).send("Faltan parámetros");
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(
      "SELECT email, contrassenya FROM tutors WHERE email = ? AND contrassenya = ?",
      [email, password]
    );

    if (rows.length > 0) {
      res.json(rows[0]);  
    } else {
      res.status(404).json({ error: "Tutor o contraseña incorrectos" });
    }
  } catch (err) {
    console.error("Error al obtener el tutor:", err);
    res.status(500).send("Error al obtener datos del tutor");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});



// ------------------------ REGISTRO -------------------------
app.post("/registreAlum", async (req, res) => {
  const user = req.body;

  if (user.email && user.contrassenya) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.execute(
        "INSERT INTO alumnes (email, contrassenya) VALUES (?, ?)",
        [user.email, user.contrassenya]
      );
      const [rows] = await connection.query("SELECT * FROM alumnes");
      res.json(rows);
    } catch (err) {
      console.error("Error al registrar alumno:", err);
      res.status(500).send("Error al registrar alumno");
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else {
    res.status(400).send("Datos incompletos");
  }
});

app.post("/registreProf", async (req, res) => {
  const user = req.body;

  if (user.email && user.contrassenya) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.execute(
        "INSERT INTO tutors (email, contrassenya) VALUES (?, ?)",
        [user.email, user.contrassenya]
      );
      const [rows] = await connection.query("SELECT * FROM tutors");
      res.json(rows);
    } catch (err) {
      console.error("Error al registrar tutor:", err);
      res.status(500).send("Error al registrar tutor");
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else {
    res.status(400).send("Datos incompletos");
  }
});

// ------------------------ LOGIN -------------------------
app.post("/loginAlum", async (req, res) => {
  const user = req.body;

  if (!user.email || !user.contrassenya) {
    return res.status(400).send("Datos incompletos");
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.query(
      "SELECT * FROM alumnes WHERE email = ? AND contrassenya = ?",
      [user.email, user.contrassenya]
    );

    if (results.length === 0) {
      console.error("No se encontró el usuario");
      return res.status(404).json({ message: "No se ha encontrado la cuenta" });
    }

    console.log("Login exitoso");
    res.status(200).json({ message: "Login exitoso", user: results[0] });
  } catch (err) {
    console.error("Error al buscar la cuenta:", err);
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

server.listen(port, () => {
  console.log(`Server corrents a ${port}`);
});

