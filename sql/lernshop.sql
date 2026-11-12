-- Übungsdatenbank "lernshop" für die Kapitel ab 7.
-- Import:  mariadb -u root -p < sql/lernshop.sql
-- Das Skript löscht die Datenbank und baut sie neu auf (= Reset).

DROP DATABASE IF EXISTS lernshop;
CREATE DATABASE lernshop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE lernshop;

CREATE TABLE kunden (
  kunden_id INT PRIMARY KEY AUTO_INCREMENT,
  vorname   VARCHAR(50)  NOT NULL,
  nachname  VARCHAR(50)  NOT NULL,
  stadt     VARCHAR(50),
  email     VARCHAR(100) UNIQUE,
  registriert DATE NOT NULL
);

CREATE TABLE produkte (
  produkt_id INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(80) NOT NULL,
  kategorie  VARCHAR(40) NOT NULL,
  preis      DECIMAL(8,2) NOT NULL CHECK (preis >= 0),
  lagerbestand INT NOT NULL DEFAULT 0
);

CREATE TABLE bestellungen (
  bestell_id INT PRIMARY KEY AUTO_INCREMENT,
  kunden_id  INT NOT NULL,
  datum      DATE NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'offen',
  FOREIGN KEY (kunden_id) REFERENCES kunden(kunden_id)
);

CREATE TABLE bestellpositionen (
  bestell_id INT NOT NULL,
  produkt_id INT NOT NULL,
  menge      INT NOT NULL CHECK (menge > 0),
  PRIMARY KEY (bestell_id, produkt_id),
  FOREIGN KEY (bestell_id) REFERENCES bestellungen(bestell_id),
  FOREIGN KEY (produkt_id) REFERENCES produkte(produkt_id)
);

INSERT INTO kunden (vorname, nachname, stadt, email, registriert) VALUES
('Anna',  'Berger',  'Berlin',  'anna.berger@example.org',  '2023-01-15'),
('Ben',   'Cramer',  'Hamburg', 'ben.cramer@example.org',   '2023-03-02'),
('Clara', 'Dietz',   'Berlin',  'clara.dietz@example.org',  '2023-05-20'),
('David', 'Engel',   'München', 'david.engel@example.org',  '2023-07-11'),
('Eva',   'Fuchs',   'Köln',    'eva.fuchs@example.org',    '2024-02-01'),
('Finn',  'Gruber',  NULL,      'finn.gruber@example.org',  '2024-04-18'),
('Greta', 'Huber',   'Hamburg', NULL,                       '2024-06-30');

INSERT INTO produkte (name, kategorie, preis, lagerbestand) VALUES
('Notizbuch A5',       'Papier',   4.50, 120),
('Kugelschreiber',     'Schreiben', 1.20, 500),
('Füller Classic',     'Schreiben', 24.90, 35),
('Ordner breit',       'Papier',   3.80, 80),
('Tintenpatronen 10er','Schreiben', 5.90, 0),
('Schreibtischlampe',  'Möbel',    39.00, 12),
('Bürostuhl',          'Möbel',   149.00, 5);

INSERT INTO bestellungen (kunden_id, datum, status) VALUES
(1, '2024-01-10', 'geliefert'),
(1, '2024-03-05', 'geliefert'),
(2, '2024-03-12', 'versendet'),
(3, '2024-04-01', 'offen'),
(4, '2024-04-15', 'geliefert'),
(2, '2024-05-02', 'offen');

INSERT INTO bestellpositionen (bestell_id, produkt_id, menge) VALUES
(1, 1, 2), (1, 2, 10),
(2, 3, 1),
(3, 6, 1), (3, 2, 5),
(4, 4, 3), (4, 1, 1),
(5, 7, 1),
(6, 2, 20), (6, 5, 2);
