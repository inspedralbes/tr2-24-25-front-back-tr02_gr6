CREATE DATABASE tr6;

USE tr6;

CREATE TABLE Classes (
    id_classe INT NOT NULL AUTO_INCREMENT,
    classe VARCHAR(10) NOT NULL,
    codi_random VARCHAR(10),
    PRIMARY KEY (id_classe)
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
    email VARCHAR(50) PRIMARY KEY NOT NULL,
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
    FOREIGN KEY (id_classe) REFERENCES Classes (id_classe)
);

INSERT INTO Classes (classe, codi_random) VALUES ('1A', 'WeWdewXWnY');
INSERT INTO Classes (classe, codi_random) VALUES ('1B', 'BZviGgYIyL');
INSERT INTO Classes (classe, codi_random) VALUES ('2A', 'TeDIEJPszh');
INSERT INTO Classes (classe, codi_random) VALUES ('2B', 'XfutUvmzKo');

INSERT INTO Tutors (email, contrassenya, nom, cognoms) VALUES
('tutor1A@example.com', 'password123', 'Joan', 'Pérez'),
('tutor1B@example.com', 'password123', 'Anna', 'García'),
('tutor2A@example.com', 'password123', 'Carla', 'López'),
('tutor2B@example.com', 'password123', 'Marc', 'Sánchez');


INSERT INTO Alumnes (email, contrassenya, nom, cognoms) VALUES
('alumne1A1@example.com', 'alumne123', 'Laura', 'Martínez'),
('alumne1A2@example.com', 'alumne123', 'Pau', 'Fernández');

INSERT INTO Alumnes (email, contrassenya, nom, cognoms) VALUES
('alumne1B1@example.com', 'alumne123', 'Marta', 'Ruiz'),
('alumne1B2@example.com', 'alumne123', 'Jordi', 'Hernández');

INSERT INTO Alumnes (email, contrassenya, nom, cognoms) VALUES
('alumne2A1@example.com', 'alumne123', 'Sergi', 'Ortiz'),
('alumne2A2@example.com', 'alumne123', 'Clara', 'Ramírez');

INSERT INTO Alumnes (email, contrassenya, nom, cognoms) VALUES
('alumne2B1@example.com', 'alumne123', 'Eva', 'Pascual'),
('alumne2B2@example.com', 'alumne123', 'David', 'González');
