CREATE DATABASE tr6;

USE tr6;

-- El camp tancat serveix per dir si ja s'han creat totes les classes
-- del centre i per tant si ja està tancat

CREATE TABLE Centres (
    codi_institut INT PRIMARY KEY NOT NULL,
    nom VARCHAR(100),
    contrassenya VARCHAR(20),
    tancat BOOLEAN
);

-- El camp classe serà tancat, és a dir, a Vue només donarà opcions
-- per dir 1rESOA, 2nESOA, etc.

CREATE TABLE Classes (
    codi_institut INT NOT NULL,
    classe VARCHAR(10) NOT NULL,
    PRIMARY KEY (codi_institut, classe),
    FOREIGN KEY (codi_institut) REFERENCES Centres (codi_institut)
);

CREATE TABLE Tutors (
    email VARCHAR(50) PRIMARY KEY NOT NULL,
    contrassenya VARCHAR(50) NOT NULL,
    nom VARCHAR(50),
    cognoms VARCHAR(50),
    codi_institut INT NOT NULL,
    classe VARCHAR(10) NOT NULL,
    FOREIGN KEY (codi_institut, classe) REFERENCES Classes (codi_institut, classe)
);

-- Els camps seran null fins que s'emplenin els qüestionaris
CREATE TABLE Alumnes (
	email VARCHAR(50) PRIMARY KEY NOT NULL,
    contrassenya VARCHAR(20) NOT NULL,
    nom VARCHAR(50),
    cognoms VARCHAR(50),
    codi_institut INT NOT NULL,
    classe VARCHAR(10) NOT NULL,
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
    FOREIGN KEY (codi_institut, classe) REFERENCES Classes (codi_institut, classe)
);

INSERT INTO Centres (codi_institut, nom, contrassenya, tancat)
VALUES 
(1, 'Institut Central', 'abc123', FALSE),
(2, 'Institut Nord', 'def456', TRUE);

INSERT INTO Classes (codi_institut, classe)
VALUES 
(1, '1rESOA'),
(1, '2nESOA'),
(1, '1rESOB'),
(1, '2nESOB'),
(2, '1rESOA'),
(2, '2nESOA'),
(2, '1rESOB'),
(2, '2nESOB');

INSERT INTO Tutors (email, contrassenya, nom, cognoms, codi_institut, classe)
VALUES 
('maria.tutor@central.com', 'pass123', 'Maria', 'Tutor', 1, '1rESOA'),
('joan.tutor@central.com', 'pass456', 'Joan', 'Tutor', 1, '2nESOA'),
('anna.tutor@nord.com', 'pass789', 'Anna', 'Tutor', 2, '1rESOA'),
('pere.tutor@nord.com', 'pass012', 'Pere', 'Tutor', 2, '2nESOA'),
('clara.tutor@central.com', 'pass234', 'Clara', 'Tutor', 1, '1rESOB'),
('jordi.tutor@central.com', 'pass567', 'Jordi', 'Tutor', 1, '2nESOB'),
('marta.tutor@nord.com', 'pass890', 'Marta', 'Tutor', 2, '1rESOB'),
('xavi.tutor@nord.com', 'pass345', 'Xavi', 'Tutor', 2, '2nESOB');

INSERT INTO Alumnes (email, contrassenya, nom, cognoms, codi_institut, classe)
VALUES 
('laura1@central.com', 'alum111', 'Laura', 'Perez', 1, '1rESOA'),
('albert1@central.com', 'alum112', 'Albert', 'Sanchez', 1, '1rESOA'),
('maria1@central.com', 'alum113', 'Maria', 'Gonzalez', 1, '1rESOB'),
('joan1@central.com', 'alum114', 'Joan', 'Ramirez', 1, '1rESOB'),
('clara1@central.com', 'alum115', 'Clara', 'Fernandez', 1, '2nESOA'),
('jose1@central.com', 'alum116', 'Jose', 'Garcia', 1, '2nESOA'),
('paula1@central.com', 'alum117', 'Paula', 'Martinez', 1, '2nESOB'),
('carlos1@central.com', 'alum118', 'Carlos', 'Lopez', 1, '2nESOB'),
('anna2@nord.com', 'alum211', 'Anna', 'Lopez', 2, '1rESOA'),
('marc2@nord.com', 'alum212', 'Marc', 'Perez', 2, '1rESOA'),
('mireia2@nord.com', 'alum213', 'Mireia', 'Garcia', 2, '1rESOB'),
('alex2@nord.com', 'alum214', 'Alex', 'Martinez', 2, '1rESOB'),
('pablo2@nord.com', 'alum215', 'Pablo', 'Gonzalez', 2, '2nESOA'),
('julia2@nord.com', 'alum216', 'Julia', 'Fernandez', 2, '2nESOA'),
('roger2@nord.com', 'alum217', 'Roger', 'Ramirez', 2, '2nESOB'),
('irene2@nord.com', 'alum218', 'Irene', 'Sanchez', 2, '2nESOB');
