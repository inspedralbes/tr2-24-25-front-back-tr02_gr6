const express = require('express');
const cors = require('cors');
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

dotenv.config();
const app = express();
const port = process.env.PORT;


app.use(express.json({ limit: '200mb' }));

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  con.connect((err) => {
    if (err) {
      console.error('Error al conectar a MySQL:', err);
      return;
    }
    console.log('Conectado a la base de datos MySQL');
  });

  //------------------------USUARIOS-------------------------
  app.get('/getUsers', async (req, res) => {
    console.log('getUsers');
    try {
      const [rows] = await con.promise().query('SELECT * FROM usuario');
      res.json(rows);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      res.status(500).send('Error al obtener datos de usuarios');
    }
  });

  //...............................REGISTRO.....................
  app.post('/registreAlum', async (req, res) => {
    const user = req.body;
  
    if (user.email && user.contrassenya) {
        await con.promise().execute('INSERT INTO alumnes (email, contrassenya) VALUES (?, ?)',
           [user.email, user.contrassenya]);
  
        const [rows] = await con.promise().query('SELECT * FROM alumnes');
        res.json(rows);
  }
});
app.post('/registreProf', async (req, res) => {
    const user = req.body;
  
    if (user.email && user.contrassenya) {
        await con.promise().execute('INSERT INTO tutors (email, contrassenya) VALUES (?, ?)',
           [user.email, user.contrassenya]);
  
        const [rows] = await con.promise().query('SELECT * FROM tutors');
        res.json(rows);
  }
});



  //...........................LOGIN.............................
  app.post('/loginAlum', async (req, res) => {
      const user = req.body;
    
      try{
          const [results] = await con.promise().query('SELECT * FROM alumnes WHERE email = ? AND contrassenya = ?',
              [user.email,user.contrassenya]);
  
              if(results.length==0){
                  console.error('No se encontro el usuario')
              return res.status(404).json({ message: 'No se ha encontrado la cuenta' });
          }
  
          console.log('Login exitoso');
          res.status(200).json({ message: 'Login exitoso', user: results[0] }); // Envía el primer resultado encontrado
      } catch (error) {
          console.error('Error al buscar la cuenta:', error);
          res.status(500).json({ message: 'Error en el servidor' });
      }
  });

  app.listen(port, () => {
    console.log(`Server corrents a ${port}`);
});
