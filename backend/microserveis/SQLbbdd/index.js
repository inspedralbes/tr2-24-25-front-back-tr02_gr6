const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const port = process.env.PORT_BBDD;
const app = express();
app.use(cors());
app.use(express.json());
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
            return res.json({ resposta: "profeAutenticat", tutorId: tutor.id_profe })
        }
    };
    for (const alumne of alumnesContrassenya) {
        if (alumne.contrassenya == contrassenyaEnviada && alumne.email == correuEnviat) {
            return res.json({ resposta: "alumneAutenticat", alumneId: alumne.id_alumne })
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

app.get("/alumnesClasseProfe", (req, res) => {
    const profe_id = req.query.userId;

    if (!profe_id) {
        return res.status(400).json({ error: "Falta el paràmetre profe_id" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error obtenint connexió del pool:", err);
            return res.status(500).send("Error al obtenir connexió");
        }

        const query = `
            SELECT a.id_alumne, a.email, a.nom, a.cognoms
            FROM Alumnes a
            INNER JOIN Tutors t ON a.id_classe = t.id_classe
            WHERE t.id_profe = ?
        `;

        connection.query(query, [profe_id], (err, results) => {
            connection.release();
            if (err) {
                console.error("Error executant la consulta:", err);
                return res.status(500).json({ error: "Error en retornar els alumnes" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "No s'han trobat alumnes per aquest professor" });
            }
            res.json(results);
        });
    });
});

app.get("/JSON", (req, res) => {
    const profe_id = req.query.userId;

    if (!profe_id) {
        return res.status(400).json({ error: "Falta el paràmetre profe_id" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error obtenint connexió del pool:", err);
            return res.status(500).send("Error al obtenir connexió");
        }

        const query = `
            SELECT questionari FROM Alumnes WHERE id_alumne = ?
        `;

        connection.query(query, [profe_id], (err, results) => {
            connection.release();
            if (err) {
                console.error("Error executant la consulta:", err);
                return res.status(500).json({ error: "Error en retornar els alumnes" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "No s'han trobat alumnes per aquest professor" });
            }
            res.json(results);
        });
    });
});


app.get("/roles", (req,res) => {

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
        }

        connection.query(
            `SELECT e.emaul, c.classe, c.codi_random
             FROM classes c
             JOIN cursos co ON c.id_curs = co.id_curs
             WHERE co.nom_curs = ?`,
            [codi_curs],
            (err, results) => {
                connection.release();

                if (err) {
                    console.error("Error en la consulta:", err);
                    return res.status(500).send({ error: "Error al obtenir dades" });
                }

                res.json(results);
            }
        );
    });
});


app.get("/alumnesClasseAlumne", (req, res) => {
    const alumne_id = req.query.userId;

    if (!alumne_id) {
        return res.status(400).json({ error: "Falta el paràmetre alumne_id" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error obtenint connexió del pool:", err);
            return res.status(500).send("Error al obtenir connexió");
        }

        const query = `
            SELECT a.id_alumne, a.email, a.nom, a.cognoms
            FROM Alumnes a
            WHERE a.id_classe = (
                SELECT id_classe
                FROM Alumnes
                WHERE id_alumne = ?
            )
        `;

        connection.query(query, [alumne_id], (err, results) => {
            connection.release();
            if (err) {
                console.error("Error executant la consulta:", err);
                return res.status(500).json({ error: "Error en retornar els alumnes" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No s'han trobat alumnes per aquesta classe" });
            }
            res.json(results);
        });
    });
});


app.put("/afegirClasseProfe", (req, res) => {
    const profe_id = req.query.userId;
    const codi_classe = req.query.codi_classe;

    if (!profe_id || !codi_classe) {
        return res.status(400).json({ error: "Falta el paràmetre profe_id o codi_classe" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error obtenint connexió del pool:", err);
            return res.status(500).send("Error al obtenir connexió");
        }

        const queryGetClasseId = `
            SELECT id_classe 
            FROM Classes 
            WHERE codi_random = ?
        `;

        connection.query(queryGetClasseId, [codi_classe], (err, results) => {
            if (err) {
                connection.release();
                console.error("Error executant la consulta per obtenir id_classe:", err);
                return res.status(500).json({ error: "Error en obtenir id_classe" });
            }

            if (results.length === 0) {
                connection.release();
                return res.status(404).json({ error: "No s'ha trobat cap classe amb aquest codi_random" });
            }


            const id_classe = results[0].id_classe;

            const queryUpdateTutor = `
                UPDATE Tutors 
                SET id_classe = ? 
                WHERE id_profe = ?
            `;

            connection.query(queryUpdateTutor, [id_classe, profe_id], (err, updateResults) => {
                connection.release();
                if (err) {
                    console.error("Error actualitzant el tutor:", err);
                    return res.status(500).json({ error: "Error en actualitzar el tutor" });
                }

                if (updateResults.affectedRows === 0) {
                    return res.status(404).json({ error: "No s'ha trobat cap tutor amb aquest id" });
                }


                res.json({
                    message: `Profe amb id ${profe_id} ha estat assignat a la classe amb codi ${codi_classe}`,
                });
            });
        });
    });
});

app.put("/afegirClasseAlumne", (req, res) => {
    const alumne_id = req.query.userId;
    const codi_classe = req.query.codi_classe;

    if (!alumne_id || !codi_classe) {
        return res.status(400).json({ error: "Falta el paràmetre alumne_id o codi_classe" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error obtenint connexió del pool:", err);
            return res.status(500).send("Error al obtenir connexió");
        }

        const queryGetClasseId = `
            SELECT id_classe 
            FROM Classes 
            WHERE codi_random = ?
        `;

        connection.query(queryGetClasseId, [codi_classe], (err, results) => {
            if (err) {
                connection.release();
                console.error("Error executant la consulta per obtenir id_classe:", err);
                return res.status(500).json({ error: "Error en obtenir id_classe" });
            }

            if (results.length === 0) {
                connection.release();
                return res.status(404).json({ error: "No s'ha trobat cap classe amb aquest codi_random" });
            }


            const id_classe = results[0].id_classe;

            const queryUpdateTutor = `
                UPDATE Alumnes 
                SET id_classe = ? 
                WHERE id_alumne = ?
            `;

            connection.query(queryUpdateTutor, [id_classe, alumne_id], (err, updateResults) => {
                connection.release();
                if (err) {
                    console.error("Error actualitzant el tutor:", err);
                    return res.status(500).json({ error: "Error en actualitzar el tutor" });
                }

                if (updateResults.affectedRows === 0) {
                    return res.status(404).json({ error: "No s'ha trobat cap tutor amb aquest id" });
                }


                res.json({
                    message: `Alumne amb id ${alumne_id} ha estat assignat a la classe amb codi ${codi_classe}`,
                });

            });
        });
    });
});



app.get("/classes/:course_code", (req, res) => {
    const codi_curs = req.params.course_code;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
        }

        connection.query(
            `SELECT c.id_classe, c.classe, c.codi_random
             FROM classes c
             JOIN cursos co ON c.id_curs = co.id_curs
             WHERE co.nom_curs = ?`,
            [codi_curs],
            (err, results) => {
                connection.release();

                if (err) {
                    console.error("Error en la consulta:", err);
                    return res.status(500).send({ error: "Error al obtenir dades" });
                }

                res.json(results);
            }
        );
    });
});

app.post("/classes", (req, res) => {
    const { classe, codi_random, id_curs } = req.body;

    if (!classe || !codi_random || !id_curs) {
        return res.json("Faltan paràmetres: classe, codi_random o id_curs");
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }

        const query = `INSERT INTO Classes (classe, codi_random, id_curs) VALUES (?, ?, ?)`;

        connection.query(query, [classe, codi_random, id_curs], (err, results) => {

            if (err) {
                console.error('Error:', err);
                res.status(500).json({ error: "Error en crear la classe" });
            }

            res.json({ mensaje: "Classe creada", id_classe: results.insertId });
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

    if (!jaExisteix(nouUser)) {
        if (esProfe(nouUser.email)) {
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
                        const tutorId = results.insertId;
                        getTutors(connection);
                        getTutorsContrassenya(connection);
                        res.json({ missatge: "Tutor afegit", tutorId: tutorId });
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
                        const alumneId = results.insertId;
                        getAlumnes(connection);
                        getAlumnesContrassenya(connection);
                        res.json({ missatge: "Alumne afegit", alumneId: alumneId });
                        console.log(`Alumne: ${nouUser.nom} afegit correctament!`)
                    }
                    connection.release();
                });
            });
        }
    } else {
        res.status(500).json({ error: "Usat." });
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

app.put("/formulari", (req, res) => {
    const id_alumne = req.query.userId
    const formulari = JSON.stringify(req.query.formulari);

    if (!formulari || !id_alumne) {
        return res.json("Falten paràmetres");
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }

        const query = `UPDATE Alumnes SET questionari = ? WHERE id_alumne = ?;`;

        connection.query(query, [formulari, id_alumne], (err, results) => {

            if (err) {
                console.error('Error:', err);
                res.status(500).json({ error: "Error en afegir respostes a l'alumne." });
            }

            res.json({ mensaje: "Respostes afegides" });
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
    connection.query('SELECT id_profe, email, nom, cognoms FROM tutors', (err, results) => {
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
    connection.query('SELECT id_profe, email, contrassenya FROM tutors', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            tutorsContrassenya = results;
        }
    });
}

function getAlumnesContrassenya(connection) {
    connection.query('SELECT id_alumne, email, contrassenya FROM alumnes', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            alumnesContrassenya = results;
        }
    });
}

// function generarCodiAleatori() {
//     const lletres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
//     let codi = '';
//     for (let i = 0; i < 10; i++) {
//         const indexAleatori = Math.floor(Math.random() * lletres.length);
//         codi += lletres[indexAleatori];
//     }
//     return codi;
// }

function esProfe(email) {
    const teNumeros = /\d/;
    return !teNumeros.test(email);
}

function jaExisteix(nouUser) {
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

