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

CREATE TABLE `resultats` (
  `id_enquesta` int(11) NOT NULL,
  `id_alumne` int(11) NOT NULL,
  `totalAgressivitat` int(11) DEFAULT NULL,
  `agressivitatFisica` int(11) DEFAULT NULL,
  `agressivitatVerbal` int(11) DEFAULT NULL,
  `agressivitatRelacional` int(11) DEFAULT NULL,
  `totalAgressivitat_SN` varchar(1) DEFAULT NULL,
  `agressivitatFisica_SN` varchar(1) DEFAULT NULL,
  `agressivitatVerbal_SN` varchar(1) DEFAULT NULL,
  `agressivitatRelacional_SN` varchar(1) DEFAULT NULL,
  `prosocialitat` int(11) DEFAULT NULL,
  `prosocialitat_SN` varchar(1) DEFAULT NULL,
  `totalVictimitzacio` int(11) DEFAULT NULL,
  `victimitzacioFisica` int(11) DEFAULT NULL,
  `victimitzacioVerbal` int(11) DEFAULT NULL,
  `victimitzacioRelacional` int(11) DEFAULT NULL,
  `totalVictimitzacio_SN` varchar(1) DEFAULT NULL,
  `victimitzacioFisica_SN` varchar(1) DEFAULT NULL,
  `victimitzacioVerbal_SN` varchar(1) DEFAULT NULL,
  `victimitzacioRelacional_SN` varchar(1) DEFAULT NULL,
  `popular_SN` varchar(1) DEFAULT NULL,
  `rebutjat_SN` varchar(1) DEFAULT NULL,
  `ignorat_SN` varchar(1) DEFAULT NULL,
  `controvertit_SN` varchar(1) DEFAULT NULL,
  `normal_SN` varchar(1) DEFAULT NULL,
  `triesPositives` int(11) DEFAULT NULL,
  `triesNegatives` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resultats`
--

INSERT INTO `resultats` (`id_enquesta`, `id_alumne`, `totalAgressivitat`, `agressivitatFisica`, `agressivitatVerbal`, `agressivitatRelacional`, `totalAgressivitat_SN`, `agressivitatFisica_SN`, `agressivitatVerbal_SN`, `agressivitatRelacional_SN`, `prosocialitat`, `prosocialitat_SN`, `totalVictimitzacio`, `victimitzacioFisica`, `victimitzacioVerbal`, `victimitzacioRelacional`, `totalVictimitzacio_SN`, `victimitzacioFisica_SN`, `victimitzacioVerbal_SN`, `victimitzacioRelacional_SN`, `popular_SN`, `rebutjat_SN`, `ignorat_SN`, `controvertit_SN`, `normal_SN`, `triesPositives`, `triesNegatives`) VALUES
(1, 1, 12, 8, 0, 4, 'X', 'X', ' ', ' ', 4, 'X', 18, 2, 5, 11, 'X', ' ', ' ', 'X', ' ', ' ', ' ', ' ', ' ', 1, 4),
(1, 2, 6, 1, 4, 1, ' ', ' ', ' ', ' ', 3, ' ', 0, 0, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 3, 2),
(1, 3, 10, 2, 3, 5, ' ', ' ', ' ', ' ', 2, ' ', 2, 0, 2, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 4, 1),
(1, 4, 10, 2, 5, 3, ' ', ' ', 'X', ' ', 1, ' ', 21, 10, 10, 1, 'X', 'X', 'X', ' ', ' ', ' ', ' ', ' ', ' ', 2, 4),
(1, 5, 6, 0, 5, 1, ' ', ' ', 'X', ' ', 6, 'X', 0, 0, 0, 0, ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', ' ', 7, 1),
(1, 6, 23, 13, 1, 9, 'X', 'X', ' ', 'X', 5, 'X', 50, 16, 15, 19, 'X', 'X', 'X', 'X', ' ', 'X', ' ', ' ', ' ', 0, 9),
(1, 7, 5, 2, 0, 3, ' ', ' ', ' ', ' ', 1, ' ', 34, 9, 11, 14, 'X', 'X', 'X', 'X', ' ', 'X', ' ', ' ', ' ', 1, 8),
(1, 8, 7, 1, 4, 2, ' ', ' ', ' ', ' ', 4, ' ', 1, 1, 0, 0, ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', ' ', 5, 1),
(1, 9, 17, 8, 4, 5, 'X', 'X', ' ', 'X', 7, 'X', 1, 0, 1, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', ' ', 5, 4),
(1, 10, 8, 2, 2, 4, ' ', ' ', ' ', ' ', 3, ' ', 18, 10, 7, 1, 'X', 'X', 'X', ' ', ' ', ' ', ' ', ' ', ' ', 4, 2),
(1, 11, 12, 1, 9, 2, 'X', ' ', 'X', ' ', 4, 'X', 4, 3, 1, 0, ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', ' ', 6, 0),
(1, 12, 3, 0, 2, 1, ' ', ' ', ' ', ' ', 1, ' ', 0, 0, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 3, 2),
(1, 13, 5, 0, 4, 1, ' ', ' ', ' ', ' ', 1, ' ', 1, 0, 0, 1, ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', ' ', 4, 0),
(1, 14, 8, 1, 7, 0, ' ', ' ', 'X', ' ', 3, ' ', 12, 1, 2, 9, ' ', ' ', ' ', 'X', ' ', 'X', ' ', ' ', ' ', 1, 6),
(1, 15, 4, 1, 0, 3, ' ', ' ', ' ', ' ', 4, ' ', 7, 0, 6, 1, ' ', ' ', 'X', ' ', ' ', ' ', ' ', ' ', ' ', 1, 4),
(1, 16, 26, 13, 0, 13, 'X', 'X', ' ', 'X', 7, 'X', 2, 1, 0, 1, ' ', ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', 1, 1),
(1, 17, 4, 0, 1, 3, ' ', ' ', ' ', ' ', 1, ' ', 3, 1, 1, 1, ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', ' ', 4, 0),
(1, 18, 11, 5, 4, 2, ' ', ' ', ' ', ' ', 5, 'X', 1, 1, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 2, 0),
(1, 19, 6, 2, 2, 2, ' ', ' ', ' ', ' ', 2, ' ', 5, 4, 1, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 5, 2),
(1, 20, 5, 0, 5, 0, ' ', ' ', 'X', ' ', 5, 'X', 1, 0, 0, 1, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 2, 0),
(1, 21, 5, 1, 1, 3, ' ', ' ', ' ', ' ', 1, ' ', 8, 4, 1, 3, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 2),
(6, 1, 0, 2, 0, 1, ' ', ' ', ' ', ' ', 1, ' ', 4, 0, 2, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 0),
(6, 2, 2, 0, 0, 0, ' ', ' ', ' ', ' ', 2, 'X', 0, 0, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 3, 2, 0, 0, 0, ' ', ' ', ' ', ' ', 2, 'X', 8, 2, 4, 2, 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 4, 0, 0, 2, 0, ' ', ' ', ' ', ' ', 1, ' ', 2, 0, 2, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 5, 0, 0, 0, 1, ' ', ' ', ' ', ' ', 0, ' ', 6, 4, 2, 0, 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 0),
(6, 6, 1, 2, 2, 2, ' ', ' ', ' ', 'X', 2, 'X', 0, 0, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 2),
(6, 7, 1, 0, 2, 1, ' ', ' ', ' ', ' ', 2, 'X', 4, 0, 2, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 2),
(6, 8, 2, 0, 0, 2, 'X', ' ', ' ', 'X', 2, 'X', 2, 0, 2, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 4),
(6, 9, 1, 2, 2, 0, ' ', ' ', ' ', ' ', 2, 'X', 4, 2, 0, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 4),
(6, 10, 0, 2, 0, 0, ' ', ' ', ' ', ' ', 0, ' ', 4, 0, 2, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 11, 0, 2, 2, 1, ' ', ' ', ' ', ' ', 1, ' ', 2, 2, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 4, 0),
(6, 12, 0, 0, 0, 1, ' ', ' ', ' ', ' ', 0, ' ', 2, 0, 0, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 2),
(6, 13, 1, 0, 0, 2, 'X', ' ', ' ', 'X', 1, ' ', 2, 2, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 4, 2),
(6, 14, 2, 0, 0, 0, ' ', ' ', ' ', ' ', 2, 'X', 6, 2, 0, 4, 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 15, 0, 4, 0, 0, ' ', ' ', ' ', ' ', 0, ' ', 4, 2, 0, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 0),
(6, 16, 0, 0, 2, 1, ' ', ' ', ' ', ' ', 1, ' ', 8, 2, 2, 4, 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 17, 0, 2, 2, 0, ' ', ' ', ' ', ' ', 0, ' ', 2, 0, 2, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 2),
(6, 18, 0, 0, 2, 2, ' ', ' ', ' ', 'X', 0, ' ', 4, 2, 2, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 19, 0, 2, 2, 0, ' ', ' ', ' ', ' ', 0, ' ', 4, 2, 0, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 20, 0, 0, 2, 0, ' ', ' ', ' ', ' ', 1, ' ', 2, 2, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 2),
(6, 21, 0, 0, 0, 2, 'X', ' ', ' ', 'X', 0, ' ', 4, 0, 2, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 22, 0, 0, 2, 2, ' ', ' ', ' ', 'X', 1, ' ', 4, 2, 0, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 0),
(6, 23, 1, 0, 4, 2, ' ', ' ', ' ', 'X', 2, 'X', 0, 0, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 24, 0, 0, 2, 1, ' ', ' ', ' ', ' ', 0, ' ', 6, 2, 4, 0, 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 2),
(6, 25, 2, 0, 0, 2, 'X', ' ', ' ', 'X', 2, 'X', 0, 0, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 2),
(6, 26, 0, 4, 0, 1, ' ', ' ', ' ', ' ', 1, ' ', 0, 0, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 0),
(6, 27, 1, 2, 0, 1, ' ', ' ', ' ', ' ', 2, 'X', 2, 0, 0, 2, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 28, 0, 4, 0, 1, ' ', ' ', ' ', ' ', 1, ' ', 2, 2, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 0, 0),
(6, 29, 0, 2, 2, 2, ' ', ' ', ' ', 'X', 0, ' ', 0, 0, 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 4),
(6, 30, 1, 0, 0, 2, 'X', ' ', ' ', 'X', 1, ' ', 2, 0, 2, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 2, 2);


INSERT INTO Cursos VALUES
(1, '1ESO'),
(2, '2ESO'),
(3, '3ESO'),
(4, '4ESO'),
(5, 'PFI');

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
