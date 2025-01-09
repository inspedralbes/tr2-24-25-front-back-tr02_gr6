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

CREATE TABLE Alumnes (
    id_alumne INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    contrassenya VARCHAR(20) NOT NULL,
    nom VARCHAR(50),
    cognoms VARCHAR(50),
    id_classe INT,
    formulari_fet BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_alumne),
    FOREIGN KEY (id_classe) REFERENCES Classes (id_classe)
);

CREATE TABLE `Respostes` (
  `id_alumne` int(11) NOT NULL,
  `soc_POS_1` int(11) DEFAULT NULL,
  `soc_POS_2` int(11) DEFAULT NULL,
  `soc_POS_3` int(11) DEFAULT NULL,
  `soc_NEG_1` int(11) DEFAULT NULL,
  `soc_NEG_2` int(11) DEFAULT NULL,
  `soc_NEG_3` int(11) DEFAULT NULL,
  `ar_i_1` int(11) DEFAULT NULL,
  `ar_i_2` int(11) DEFAULT NULL,
  `ar_i_3` int(11) DEFAULT NULL,
  `pros_1` int(11) DEFAULT NULL,
  `pros_2` int(11) DEFAULT NULL,
  `pros_3` int(11) DEFAULT NULL,
  `af_1` int(11) DEFAULT NULL,
  `af_2` int(11) DEFAULT NULL,
  `af_3` int(11) DEFAULT NULL,
  `ar_d_1` int(11) DEFAULT NULL,
  `ar_d_2` int(11) DEFAULT NULL,
  `ar_d_3` int(11) DEFAULT NULL,
  `pros_2_1` int(11) DEFAULT NULL,
  `pros_2_2` int(11) DEFAULT NULL,
  `pros_2_3` int(11) DEFAULT NULL,
  `av_1` int(11) DEFAULT NULL,
  `av_2` int(11) DEFAULT NULL,
  `av_3` int(11) DEFAULT NULL,
  `vf_1` int(11) DEFAULT NULL,
  `vf_2` int(11) DEFAULT NULL,
  `vf_3` int(11) DEFAULT NULL,
  `vv_1` int(11) DEFAULT NULL,
  `vv_2` int(11) DEFAULT NULL,
  `vv_3` int(11) DEFAULT NULL,
  `vr_1` int(11) DEFAULT NULL,
  `vr_2` int(11) DEFAULT NULL,
  `vr_3` int(11) DEFAULT NULL,
  `amics_1` int(11) DEFAULT NULL,
  `amics_2` int(11) DEFAULT NULL,
  `amics_3` int(11) DEFAULT NULL,
  FOREIGN KEY (id_alumne) REFERENCES Alumnes (id_alumne)
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
('alumne1A2@example.com', 'alumne123', 'Pau', 'Fernández', 1),
('a23alechasan@inspedralbes.cat', 'a', 'Alex', 'Charles', 1),
('alumne1A3@example.com', 'alumne123', 'Marta', 'García', 1),
('alumne1A4@example.com', 'alumne123', 'Jordi', 'Roca', 1),
('alumne1A5@example.com', 'alumne123', 'Sofia', 'Pujol', 1),
('alumne1A6@example.com', 'alumne123', 'David', 'Salvat', 1),
('alumne1A7@example.com', 'alumne123', 'Clara', 'Vila', 1),
('alumne1A8@example.com', 'alumne123', 'Pol', 'Martí', 1),
('alumne1A9@example.com', 'alumne123', 'Laia', 'Fernández', 1),
('alumne1A10@example.com', 'alumne123', 'Marcel', 'Ramon', 1),
('alumne1A11@example.com', 'alumne123', 'Núria', 'Torrens', 1),
('alumne1A12@example.com', 'alumne123', 'Xavi', 'Soler', 1),
('alumne1A13@example.com', 'alumne123', 'Àlex', 'Moreno', 1),
('alumne1A14@example.com', 'alumne123', 'Gemma', 'Nadal', 1),
('alumne1A15@example.com', 'alumne123', 'Oriol', 'Costa', 1),
('alumne1A16@example.com', 'alumne123', 'Marina', 'Bonet', 1),
('alumne1A17@example.com', 'alumne123', 'Ramon', 'Castell', 1),
('alumne1A18@example.com', 'alumne123', 'Laia', 'Sánchez', 1),
('alumne1A19@example.com', 'alumne123', 'Isaac', 'Colomer', 1),
('alumne1A20@example.com', 'alumne123', 'Eva', 'Palau', 1),
('alumne1A21@example.com', 'alumne123', 'Júlia', 'Vidal', 1),
('alumne1A22@example.com', 'alumne123', 'Bruno', 'Duran', 1);

INSERT INTO Alumnes (email, contrassenya, nom, cognoms, id_classe) VALUES
('alumne1B1@example.com', 'alumne123', 'Marta', 'Ruiz', 3),
('alumne1B2@example.com', 'alumne123', 'Jordi', 'Hernández', 3);

INSERT INTO Alumnes (email, contrassenya, nom, cognoms, id_classe) VALUES
('alumne2A1@example.com', 'alumne123', 'Sergi', 'Ortiz', 2),
('alumne2A2@example.com', 'alumne123', 'Clara', 'Ramírez', 2);

INSERT INTO Alumnes (email, contrassenya, nom, cognoms, id_classe) VALUES
('alumne2B1@example.com', 'alumne123', 'Eva', 'Pascual', 4),
('alumne2B2@example.com', 'alumne123', 'David', 'González', 4);
