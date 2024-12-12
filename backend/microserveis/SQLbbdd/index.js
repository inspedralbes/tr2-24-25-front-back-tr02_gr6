const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const port = process.env.PORT_BBDD;

const app = express();
app.use(cors());

var classes = [];
var tutors = [];
var alumnes = [];
var tutorsContrassenya = [];
var alumnesContrassenya = [];

const dbNom = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

var pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbNom,
    port: 3306,
    connectionLimit: 10
});

app.get("/auth", (req, res) => {
    correuEnviat = req.query.email
    contrassenyaEnviada = req.query.contrassenya
    for (const tutor of tutorsContrassenya) {
        if (tutor.contrassenya == contrassenyaEnviada && tutor.email == correuEnviat) {
            return res.json({ resposta: "profeAutenticat"})
        }
    };
    for (const alumne of alumnesContrassenya) {
        if (alumne.contrassenya == contrassenyaEnviada && alumne.email == correuEnviat) {
            return res.json({ resposta: "alumneAutenticat"})
        }
    };
    return res.json({ resposta: "noAutenticat" })
});


app.get("/classes", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        getClasses(connection);
        res.json(classes);
    });
});

app.get("/tutors", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        getTutors(connection);
        res.json(tutors);
    });
});

app.get("/alumnes", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        getAlumnes(connection);
        res.json(alumnes);
    });
});

app.post("/classe", (req, res) => {
    if (!req.query.nomClasse) {
        return res.status(400).send("Falta el paràmetre nomClasse");
    }

    const novaClasse = {
        nomClasse: req.query.nomClasse,
        codiAleatori: generarCodiAleatori()
    };

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }

        const query = `INSERT INTO Classes (classe, codi_random) VALUES (?, ?)`;


        connection.query(query, [novaClasse.nomClasse, novaClasse.codiAleatori], (err, results) => {
            if (err) {
                console.error('Error:', err);
                res.status(500).json({ error: "Error en crear la classe" });
            } else {
                getClasses(connection);
                res.json({ missatge: "classe creada" });
                console.log(`Classe: ${novaClasse.nomClasse} afegida correctament!`)
            }
            connection.release();
        });
    });
});

app.post("/registre", (req, res) => {
    const nouUser = {
        email: req.query.email,
        nom: req.query.nom,
        cognoms: req.query.cognoms,
        contrassenya: req.query.contrassenya
    };

    if (!jaExisteix(nouUser)){
        if (esProfe(nouUser.email)){
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection from pool:', err);
                    res.status(500).send("Error al obtenir connexió");
                    return;
                }
        
                const query = `INSERT INTO Tutors (email, contrassenya, nom, cognoms) VALUES (?, ?, ?, ?)`;
        
        
                connection.query(query, [nouUser.email, nouUser.contrassenya, nouUser.nom, nouUser.cognoms], (err, results) => {
                    if (err) {
                        console.error('Error:', err);
                        res.status(500).json({ error: "Error en crear el professor" });
                    } else {
                        getTutors(connection);
                        getTutorsContrassenya(connection);
                        res.json({ missatge: "Tutor afegit" });
                        console.log(`Tutor: ${nouUser.nom} afegit correctament!`)
                    }
                    connection.release();
                });
            });
        } else {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection from pool:', err);
                    res.status(500).send("Error al obtenir connexió");
                    return;
                }
        
                const query = `INSERT INTO Alumnes (email, contrassenya, nom, cognoms) VALUES (?, ?, ?, ?)`;
        
        
                connection.query(query, [nouUser.email, nouUser.contrassenya, nouUser.nom, nouUser.cognoms], (err, results) => {
                    if (err) {
                        console.error('Error:', err);
                        res.status(500).json({ error: "Error en crear l'alumne" });
                    } else {
                        getAlumnes(connection);
                        getAlumnesContrassenya(connection);
                        res.json({ missatge: "Alumne afegit" });
                        console.log(`Alumne: ${nouUser.nom} afegit correctament!`)
                    }
                    connection.release();
                });
            });
        }
    } else {
        res.status(500).json({error: "Usat."});
        console.log("Aquest correu ja està en us.")
    }
});

app.delete("/classe", (req, res) => {
    if (!req.query.idClasse) {
        return res.status(400).send("Falta el paràmetre idClasse");
    }

    const idClasse = req.query.idClasse

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }

        const query = `DELETE FROM Classes WHERE id_classe = (?)`;


        connection.query(query, [idClasse], (err, results) => {
            if (err) {
                console.error('Error:', err);
                res.status(500).json({ error: "Error en eliminar la classe" });
            } else {
                getClasses(connection);
                res.json({ missatge: "classe eliminada" });
                console.log(`Classe: ${idClasse} eliminada correctament!`)
            }
            connection.release();
        });
    });
});

app.put("/classe", (req, res) => {
    if (!req.query.nomClasse || !req.query.idClasse) {
        return res.status(400).send("Falta el paràmetre nomClasse o idClasse");
    }

    const classeEditar = {
        idClasse: req.query.idClasse,
        nomClasse: req.query.nomClasse,
    };

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }

        const query = `UPDATE Classes SET classe = (?) WHERE id_classe = (?)`;


        connection.query(query, [classeEditar.nomClasse, classeEditar.idClasse], (err, results) => {
            if (err) {
                console.error('Error:', err);
                res.status(500).json({ error: "Error en editar la classe" });
            } else {
                getClasses(connection);
                res.json({ missatge: "classe editada" });
                console.log(`Classe: ${classeEditar.nomClasse} editada correctament!`)
            }
            connection.release();
        });
    });
});

function getClasses(connection) {
    connection.query('SELECT * FROM classes', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            classes = results;
        }
    });
}

function getTutors(connection) {
    connection.query('SELECT id_profe, email, nom, cognoms, id_classe FROM tutors', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            tutors = results;
        }
    });
}

function getAlumnes(connection) {
    connection.query('SELECT id_alumne, email, nom, cognoms, id_classe FROM alumnes', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            alumnes = results;
        }
    });
}

function getTutorsContrassenya(connection) {
    connection.query('SELECT email, contrassenya FROM tutors', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            tutorsContrassenya = results;
        }
    });
}

function getAlumnesContrassenya(connection) {
    connection.query('SELECT email, contrassenya FROM alumnes', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            alumnesContrassenya = results;
        }
    });
}

function generarCodiAleatori() {
    const lletres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let codi = '';
    for (let i = 0; i < 10; i++) {
        const indexAleatori = Math.floor(Math.random() * lletres.length);
        codi += lletres[indexAleatori];
    }
    return codi;
}

function esProfe(email) {
    const teNumeros = /\d/;
    return !teNumeros.test(email);
}

function jaExisteix(nouUser){
    for (const tutor of tutorsContrassenya) {
        if (tutor.email == nouUser.email) {
            return true;
        }
    };
    for (const alumne of alumnesContrassenya) {
        if (alumne.email == nouUser.email) {
            return true;
        }
    };
    return false;
}


process.on('message', (message) => {
    if (message.action === 'start') {
        app.listen(port, () => {
            console.log(`Servei de Bases de Dades corrent al port ${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`El port ${port} ja està en ús.`);
            } else {
                console.error(err);
            }
        });
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection from pool:', err);
                return;
            }

            getClasses(connection);
            getTutors(connection);
            getAlumnes(connection);
            getTutorsContrassenya(connection);
            getAlumnesContrassenya(connection);

            connection.release();
        });
    }
    if (message.action === 'stop') {
        process.send('exit')
        process.exit();
    }
});
