CREATE DATABASE tr6;

USE tr6;

CREATE TABLE Cursos (
    id_curs INT NOT NULL,
    nom_curs VARCHAR(10) NOT NULL,
    PRIMARY KEY (id_curs)
);

CREATE TABLE Classes (
    id_classe INT NOT NULL AUTO_INCREMENT,
    id_curs INT NOT NULL,
    classe VARCHAR(10) NOT NULL,
    codi_random VARCHAR(10),
    PRIMARY KEY (id_classe), 
    FOREIGN KEY (id_curs) REFERENCES Cursos (id_curs)
);

CREATE TABLE Tutors (
    id_profe INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    contrassenya VARCHAR(50) NOT NULL,
    nom VARCHAR(50),
    cognoms VARCHAR(50),
    id_classe INT,
    PRIMARY KEY (id_profe),
    FOREIGN KEY (id_classe) REFERENCES Classes (id_classe)
);

-- Els camps seran null fins que s'emplenin els qüestionaris
CREATE TABLE Alumnes (
    id_alumne INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    contrassenya VARCHAR(20) NOT NULL,
    nom VARCHAR(50),
    cognoms VARCHAR(50),
    id_classe INT,
    cauBe INT,
    noCauBe INT,
    correRumors INT,
    ajuda INT,
    donaEmpentes INT,
    noDeixaParticipar INT,
    anima INT,
    insulta INT,
    esEmpentat INT,
    esInsultat INT,
    esAillat INT,
    esAmic INT,
    questionari JSON,
    PRIMARY KEY (id_alumne),
    FOREIGN KEY (id_classe) REFERENCES Classes (id_classe)
);

INSERT INTO Cursos VALUES 
(1, '1ESO'),
(2, '2ESO'),
(3, '3ESO'),
(4, '4ESO');

INSERT INTO Classes (classe, codi_random, id_curs) VALUES ('1A', 'WeWdewXWnY' ,1);
INSERT INTO Classes (classe, codi_random, id_curs) VALUES ('1B', 'BZviGgYIyL' ,1);
INSERT INTO Classes (classe, codi_random, id_curs) VALUES ('2A', 'TeDIEJPszh', 2);
INSERT INTO Classes (classe, codi_random, id_curs) VALUES ('2B', 'XfutUvmzKo', 2);

INSERT INTO Tutors (email, contrassenya, nom, cognoms, id_classe) VALUES
('tutor1A@example.com', 'password123', 'Joan', 'Pérez', 1),
('tutor1B@example.com', 'password123', 'Anna', 'García', 2),
('tutor2A@example.com', 'password123', 'Carla', 'López', 3),
('tutor2B@example.com', 'password123', 'Marc', 'Sánchez', 4);


INSERT INTO Alumnes (email, contrassenya, nom, cognoms, id_classe) VALUES
('alumne1A1@example.com', 'alumne123', 'Laura', 'Martínez', 1),
('alumne1A2@example.com', 'alumne123', 'Pau', 'Fernández', 1);

INSERT INTO Alumnes (email, contrassenya, nom, cognoms, id_classe) VALUES
('alumne1B1@example.com', 'alumne123', 'Marta', 'Ruiz', 3),
('alumne1B2@example.com', 'alumne123', 'Jordi', 'Hernández', 3);

INSERT INTO Alumnes (email, contrassenya, nom, cognoms, id_classe) VALUES
('alumne2A1@example.com', 'alumne123', 'Sergi', 'Ortiz', 2),
('alumne2A2@example.com', 'alumne123', 'Clara', 'Ramírez', 2);

INSERT INTO Alumnes (email, contrassenya, nom, cognoms, id_classe) VALUES
('alumne2B1@example.com', 'alumne123', 'Eva', 'Pascual', 4),
('alumne2B2@example.com', 'alumne123', 'David', 'González', 4);


