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
var respostes = [];

const dbNom = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

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

app.get("/classeFormaProfe", (req, res) => {
    const email = req.query.email;
    console.log("EMAIL DE SQL", email)
    console.log("EMAIL DE SQL", email)
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        const query = `SELECT id_classe FROM Tutors WHERE email=?`;
        connection.query(query, [email], (err, results) => {
        const query = `SELECT id_classe FROM Tutors WHERE email=?`;
        connection.query(query, [email], (err, results) => {
            if (err) {
                classes = err;
                console.error('Error:', err);
            } else {
                classes = results;
                console.log("RESULTADO DE SQL", classes)
                console.log("RESULTADO DE SQL", classes)
            }

            res.json(classes);
        });
    });

            res.json(classes);
        });
    });
});
app.get("/classeFormaAlumne", (req, res) => {
    const email = req.query.email;
    console.log("EMAIL DE SQL", email)
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        const query = `SELECT id_classe FROM Alumnes WHERE email=?`;
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error:', err);
            } else {
                classes = results;
                console.log("RESULTADO DE SQL", classes)
            }

            res.json(classes);
        });
    });
});

app.get("/tutor", (req, res) => {
    const id_classe = req.query.id_classe;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        const query = `SELECT email FROM Tutors WHERE id_classe=?`;
        connection.query(query, [id_classe], (err, results) => {
            if (err) {
                classes = err;
                console.error('Error:', err);
            } else {
                classes = results;
                console.log("RESULTADO DE SQL", classes)
                console.log("RESULTADO DE SQL", classes)
            }

            res.json(classes);
        });
    });

            res.json(classes);
        });
    });
});

app.get("/classeAlum", (req, res) => {
    const email = req.query.email;
    console.log("EMAIL DE SQL", email)
    console.log("EMAIL DE SQL", email)
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        const query = `SELECT c.classe,c.codi_random FROM Classes c JOIN Alumnes a ON c.id_classe = a.id_classe WHERE a.id_classe = (
    SELECT id_classe
    FROM Alumnes
    WHERE email = ?
)`;
        connection.query(query, [email], (err, results) => {
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error:', err);
            } else {
                classes = results;
            }

            res.json(classes);
        });
    });

            res.json(classes);
        });
    });
});
app.get("/classeProf", (req, res) => {
    const email = req.query.email;
    console.log("EMAIL DE SQL", email)
    console.log("EMAIL DE SQL", email)
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        const query = `SELECT c.classe,c.id_classe,c.codi_random FROM Classes c JOIN Tutors a ON c.id_classe = a.id_classe WHERE a.id_classe = (
    SELECT id_classe
    FROM Tutors
    WHERE email = ?
)`;
        connection.query(query, [email], (err, results) => {
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error:', err);
            } else {
                classes = results;
            }

            res.json(classes);
        });
    });

            res.json(classes);
        });
    });
});

app.get("/formulariRespost", (req, res) => {
    const email = req.query.email;
    console.log("EMAIL DE SQL", email);
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }
        const query = `SELECT formulari_fet FROM Alumnes WHERE email = ?`;
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error:', err);
                res.status(500).send("Error al realitzar la consulta");
            } else {
                if (results.length > 0 && results[0].formulari_fet) {
                    res.json({ resposta: true });
                } else {
                    res.json({ resposta: false });
                }
            }
            connection.release();
        });
    });
});

app.get("/alumnesClasseProfe", (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: "Falta el paràmetre email" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error obtenint connexió del pool:", err);
            return res.status(500).send("Error al obtenir connexió");
        }

        const query = `
            SELECT a.id_alumne, a.email, a.nom, a.cognoms, a.formulari_fet
            FROM Alumnes a
            INNER JOIN Tutors t ON a.id_classe = t.id_classe
            WHERE t.email = ?
        `;

        connection.query(query, [email], (err, results) => {
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

app.get("/alumnesClasseAlumne", (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: "Falta el paràmetre email" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error obtenint connexió del pool:", err);
            return res.status(500).send("Error al obtenir connexió");
        }

        const query = `
            SELECT a.id_alumne, a.email, a.nom, a.cognoms, a.formulari_fet
            FROM Alumnes a
            WHERE a.id_classe = (
                SELECT id_classe
                FROM Alumnes
                WHERE email = ?
            )
        `;

        connection.query(query, [email], (err, results) => {
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

app.get("/haFetFormulari", (req, res) => {
    const alumne_id = req.query.userId;

    if (!alumne_id) {
        return res.status(400).json({ error: "Falta el paràmetre alumne_id" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error obtenint connexió del pool:", err);
            return res.status(500).send("Error al obtenir connexió");
        }

        const query = `SELECT formulari_fet FROM Alumnes WHERE id_alumne = (?)`;

        connection.query(query, [alumne_id], (err, results) => {
            connection.release();
            if (err) {
                console.error("Error executant la consulta:", err);
                return res.status(500).json({ error: "Error en retornar l'estat del formulari de l'alumne" });
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
    const alumne_email = req.query.email;
    const codi_classe = req.query.codi_classe;

    if (!alumne_email || !codi_classe) {
        return res.status(400).json({ error: "Falta el paràmetre alumne_email o codi_classe" });
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
                WHERE email = ?
            `;

            connection.query(queryUpdateTutor, [id_classe, alumne_email], (err, updateResults) => {
                connection.release();
                if (err) {
                    console.error("Error actualitzant el tutor:", err);
                    return res.status(500).json({ error: "Error en actualitzar el tutor" });
                }

                if (updateResults.affectedRows === 0) {
                    return res.status(404).json({ error: "No s'ha trobat cap tutor amb aquest id" });
                }


                res.json({
                    message: `OK`,
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
            `SELECT 
            c.id_classe, 
            c.classe, 
            c.codi_random, 
            t.email AS tutor_email
                FROM Classes c
                JOIN Cursos co ON c.id_curs = co.id_curs
                LEFT JOIN Tutors t ON c.id_classe = t.id_classe
                WHERE co.nom_curs = ?
`,
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
    const email = req.query.email
    console.log(email, "SQL EMAIL")
    console.log(email, "SQL EMAIL")
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
        const query2 = `UPDATE Tutors
SET id_classe = (SELECT id_classe FROM Classes WHERE codi_random = ?)
WHERE email=? ;
`
        connection.query(query, [classe, codi_random, id_curs], (err, results) => {

            if (err) {
                console.error('Error:', err);
                res.status(500).json({ error: "Error en crear la classe" });
            }
            else {
            else {
                connection.query(query2, [codi_random, email], (err, results) => {
                    if (err) {
                        console.error('Error:', err);
                        res.status(500).json({ error: "Error en crear la classe" });
                    }
                });
            }

            res.json({ mensaje: "Classe creada", id_classe: results.insertId });
            connection.release();

        });

    });
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
    const alumneAmbFormulari = false;
    for (const resposta in respostes) {
        if (resposta.id_alumne == id_alumne) {
            alumneAmbFormulari = true;
            break;
        }
    }
    if (!alumneAmbFormulari) {
        const formulariSenseIds = JSON.parse(req.query.formulariAfegir);
        const formulari = convertirNomsAId(id_alumne, formulariSenseIds);

        if (!Array.isArray(formulari.cauBe)) {
            console.error('cauBe no és un array:', formulari.cauBe);
            res.status(400).send('Dades invàlides: cauBe no és un array');
            return;
        }

        if (!formulari || !id_alumne) {
            return res.json("Falten paràmetres");
        }

        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection from pool:', err);
                res.status(500).send("Error al obtenir connexió");
                return;
            }

            const query = `INSERT INTO Respostes (id_alumne, soc_POS_1, soc_POS_2, soc_POS_3, soc_NEG_1, soc_NEG_2, soc_NEG_3, ar_i_1, ar_i_2, ar_i_3, pros_1, pros_2, pros_3, af_1, af_2, af_3, ar_d_1, ar_d_2, ar_d_3, pros_2_1, pros_2_2, pros_2_3, av_1, av_2, av_3, vf_1, vf_2, vf_3, vv_1, vv_2, vv_3, vr_1, vr_2, vr_3, amics_1, amics_2, amics_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

            connection.query(query, [id_alumne, formulari.cauBe[0], formulari.cauBe[1], formulari.cauBe[2], formulari.noCauBe[0], formulari.noCauBe[1], formulari.noCauBe[2], formulari.correRumors[0], formulari.correRumors[1], formulari.correRumors[2], formulari.ajuda[0], formulari.ajuda[1], formulari.ajuda[2], formulari.donaEmpentes[0], formulari.donaEmpentes[1], formulari.donaEmpentes[2], formulari.noDeixaParticipar[0], formulari.noDeixaParticipar[1], formulari.noDeixaParticipar[2], formulari.anima[0], formulari.anima[1], formulari.anima[2], formulari.insulta[0], formulari.insulta[1], formulari.insulta[2], formulari.esEmpentat[0], formulari.esEmpentat[1], formulari.esEmpentat[2], formulari.esInsultat[0], formulari.esInsultat[1], formulari.esInsultat[2], formulari.esAillat[0], formulari.esAillat[1], formulari.esAillat[2], formulari.esAmic[0], formulari.esAmic[1], formulari.esAmic[2]], (err, results) => {

                if (err) {
                    console.error('Error:', err);
                    res.status(500).json({ error: "Error en afegir respostes a l'alumne." });
                }

                res.json({ mensaje: "Respostes afegides" });
                getRespostes(connection);
                connection.release();

            });
        });
    } else {
        res.json({ mensaje: "L'alumne ja ha enviat respostes anteriorment." });
    }
});

app.put("/formulariAlumne", (req, res) => {
    const id_alumne = req.query.userId

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).send("Error al obtenir connexió");
            return;
        }

        const query = `UPDATE Alumnes SET formulari_fet = 1 WHERE id_alumne = (?);`;

        connection.query(query, [id_alumne], (err, results) => {

            if (err) {
                console.error('Error:', err);
            }
            getAlumnes(connection);
            connection.release();
            res.json({ mensaje: "Formulari Fet Afegit" });

        });
    });
});

function convertirNomsAId(id_alumne, formulari) {
    var alumneResposta = null;
    for (let i = 0; i < alumnes.length; i++) {
        if (alumnes[i].id_alumne == id_alumne) {
            alumneResposta = alumnes[i];
        }
    }
    var alumnesDeLaSevaClasse = [];
    for (let i = 0; i < alumnes.length; i++) {
        if (alumnes[i].id_classe == alumneResposta.id_classe) {
            alumnesDeLaSevaClasse.push(alumnes[i]);
        }
    }
    for (let categoria in formulari) {
        let arrayRespostes = formulari[categoria];
        for (let i = 0; i < arrayRespostes.length; i++) {
            let nomCompletFormulari = arrayRespostes[i];
            let nomCompletArray = nomCompletFormulari.split(" ", 2);
            let nomFormulari = nomCompletArray[0];
            let cognomFormulari = nomCompletArray[1];
            for (let j = 0; j < alumnes.length; j++) {
                let nomBBDD = alumnes[j].nom;
                let cognomBBDD = alumnes[j].cognoms;
                if (nomFormulari.trim().toLowerCase() === nomBBDD.trim().toLowerCase() &&
                    cognomFormulari.trim().toLowerCase() === cognomBBDD.trim().toLowerCase()) {
                    arrayRespostes[i] = alumnes[j].id_alumne;
                }
            }
        }
    }
    return formulari;
}


function getClasses(connection) {
    connection.query('SELECT * FROM Classes', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            classes = results;
        }
    });
}

function getTutors(connection) {
    connection.query('SELECT id_profe, email, nom, cognoms FROM Tutors', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            tutors = results;
        }
    });
}

function getAlumnes(connection) {
    connection.query('SELECT id_alumne, email, nom, cognoms, id_classe, formulari_fet FROM Alumnes', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            alumnes = results;
        }
    });
}

function getTutorsContrassenya(connection) {
    connection.query('SELECT id_profe, email, contrassenya FROM Tutors', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            tutorsContrassenya = results;
        }
    });
}

function getAlumnesContrassenya(connection) {
    connection.query('SELECT id_alumne, email, contrassenya FROM Alumnes', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            alumnesContrassenya = results;
        }
    });
}

function getRespostes(connection) {
    connection.query('SELECT * FROM Respostes', (err, results) => {
        if (err) {
            console.error('Error:', err);
        } else {
            respostes = results;
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
            console.log(`Servei de BBDD corrent a ${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`El port ${port} ja està en ús, però el servidor està funcionant.`);
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
            getRespostes(connection);
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

