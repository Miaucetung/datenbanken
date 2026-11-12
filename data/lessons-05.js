window.LESSONS[5] = {
  intro: "Tabellen sind das Herz jeder Datenbank. Du lernst, sie mit passenden Datentypen und Regeln (Constraints) anzulegen, anzuzeigen, zu ändern und zu löschen.",
  setup: "Lege zum Üben eine eigene Datenbank an: <code>CREATE DATABASE IF NOT EXISTS uebung; USE uebung;</code>",
  sections: [
    {title: "Tabellen erstellen",
     code: ["CREATE TABLE mitarbeiter (\n  id        INT PRIMARY KEY AUTO_INCREMENT,\n  vorname   VARCHAR(50) NOT NULL,\n  nachname  VARCHAR(50) NOT NULL,\n  gehalt    DECIMAL(8,2),\n  eintritt  DATE\n);"],
     text: "<p>In Klammern stehen die Spalten, jeweils mit Name, Datentyp und optionalen Regeln. <code>AUTO_INCREMENT</code> zählt die Nummer bei jedem neuen Datensatz automatisch hoch.</p>"},
    {title: "Wichtige Datentypen",
     text: "<table class='t'><tr><th>Typ</th><th>Verwendung</th><th>Beispiel</th></tr>" +
       "<tr><td><code>INT</code></td><td>Ganzzahlen</td><td>42</td></tr>" +
       "<tr><td><code>DECIMAL(p,s)</code></td><td>exakte Dezimalzahlen (Geld!)</td><td>DECIMAL(8,2) → 123456.78</td></tr>" +
       "<tr><td><code>FLOAT</code>, <code>DOUBLE</code></td><td>Näherungswerte</td><td>3.14159</td></tr>" +
       "<tr><td><code>CHAR(n)</code></td><td>Text fester Länge</td><td>Postleitzahl</td></tr>" +
       "<tr><td><code>VARCHAR(n)</code></td><td>Text variabler Länge bis n</td><td>Nachname</td></tr>" +
       "<tr><td><code>TEXT</code></td><td>langer Text</td><td>Beschreibung</td></tr>" +
       "<tr><td><code>DATE</code></td><td>Datum</td><td>'2024-05-17'</td></tr>" +
       "<tr><td><code>DATETIME</code>, <code>TIMESTAMP</code></td><td>Datum mit Uhrzeit</td><td>'2024-05-17 14:30:00'</td></tr>" +
       "<tr><td><code>BOOLEAN</code></td><td>Wahrheitswert (Alias für TINYINT(1))</td><td>TRUE / FALSE</td></tr></table>",
     tip: "Geldbeträge gehören in <code>DECIMAL</code>, nicht in <code>FLOAT</code>. Gleitkommazahlen runden ungenau."},
    {title: "Constraints (Regeln)",
     code: ["CREATE TABLE abteilung (\n  id    INT PRIMARY KEY AUTO_INCREMENT,\n  name  VARCHAR(50) NOT NULL UNIQUE,\n  budget DECIMAL(10,2) DEFAULT 0 CHECK (budget >= 0)\n);\n\nCREATE TABLE angestellter (\n  id      INT PRIMARY KEY AUTO_INCREMENT,\n  name    VARCHAR(80) NOT NULL,\n  abt_id  INT,\n  CONSTRAINT fk_abt FOREIGN KEY (abt_id) REFERENCES abteilung(id)\n);"],
     text: "<table class='t'><tr><th>Constraint</th><th>Bedeutung</th></tr>" +
       "<tr><td><code>NOT NULL</code></td><td>Wert ist Pflicht</td></tr>" +
       "<tr><td><code>UNIQUE</code></td><td>Wert darf nur einmal vorkommen</td></tr>" +
       "<tr><td><code>PRIMARY KEY</code></td><td>eindeutig und nicht NULL, identifiziert die Zeile</td></tr>" +
       "<tr><td><code>DEFAULT</code></td><td>Vorgabewert, falls nichts angegeben wird</td></tr>" +
       "<tr><td><code>CHECK</code></td><td>Bedingung, die der Wert erfüllen muss</td></tr>" +
       "<tr><td><code>FOREIGN KEY</code></td><td>Verweis auf den Schlüssel einer anderen Tabelle</td></tr></table>"},
    {title: "Domänen",
     text: "<p>Eine Domäne ist ein selbst definierter Datentyp mit eigenen Regeln. Der SQL-Standard und PostgreSQL kennen dafür <code>CREATE DOMAIN</code>. <b>MariaDB kennt das nicht.</b> Du erreichst dasselbe mit einem normalen Datentyp plus <code>CHECK</code>-Regel oder mit <code>ENUM</code>:</p>",
     code: ["CREATE TABLE person (\n  id       INT PRIMARY KEY AUTO_INCREMENT,\n  geschlecht ENUM('w','m','d') NOT NULL,\n  alter_jahre INT CHECK (alter_jahre BETWEEN 0 AND 150)\n);"]},
    {title: "Tabellen anzeigen, ändern, löschen",
     code: ["SHOW TABLES;                 -- alle Tabellen der aktiven Datenbank\nDESCRIBE mitarbeiter;        -- Spalten und Typen (kurz: DESC)\nSHOW CREATE TABLE mitarbeiter; -- der vollständige CREATE-Befehl\n\n-- ändern:\nALTER TABLE mitarbeiter ADD COLUMN telefon VARCHAR(30);\nALTER TABLE mitarbeiter MODIFY COLUMN telefon VARCHAR(40);\nALTER TABLE mitarbeiter CHANGE COLUMN telefon handy VARCHAR(40);\nALTER TABLE mitarbeiter DROP COLUMN handy;\nRENAME TABLE mitarbeiter TO personal;\n\n-- löschen:\nDROP TABLE IF EXISTS personal;"],
     warn: "<code>DROP TABLE</code> entfernt Struktur und Daten unwiderruflich. Bei Tabellen mit Fremdschlüsseln muss zuerst die abhängige (Kind-)Tabelle gelöscht werden."}
  ],
  exercises: [
    {id: "k5-1", title: "Tabelle buch",
     task: "<p>Lege in <code>uebung</code> die Tabelle <code>buch</code> an mit: <code>id</code> (automatisch hochzählender Primärschlüssel), <code>titel</code> (Text bis 120 Zeichen, Pflicht), <code>autor</code> (Text bis 80, Pflicht), <code>preis</code> (Dezimalzahl mit 2 Nachkommastellen, nicht negativ), <code>erschienen</code> (Datum).</p>",
     hints: ["Für den Preis passt <code>DECIMAL(6,2)</code> mit einer <code>CHECK</code>-Regel."],
     solution: "CREATE TABLE buch (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  titel VARCHAR(120) NOT NULL,\n  autor VARCHAR(80) NOT NULL,\n  preis DECIMAL(6,2) CHECK (preis >= 0),\n  erschienen DATE\n);"},
    {id: "k5-2", title: "Struktur prüfen und ändern",
     task: "<p>Zeige die Struktur von <code>buch</code> an. Füge dann eine Spalte <code>isbn</code> (<code>CHAR(13)</code>, eindeutig) hinzu und prüfe das Ergebnis.</p>",
     solution: "DESCRIBE buch;\nALTER TABLE buch ADD COLUMN isbn CHAR(13) UNIQUE;\nDESCRIBE buch;"},
    {id: "k5-3", title: "Zwei Tabellen mit Verweis",
     task: "<p>Lege eine Tabelle <code>verlag</code> an (<code>id</code> als Primärschlüssel, <code>name</code> Pflicht und eindeutig). Ergänze <code>buch</code> um die Spalte <code>verlag_id</code> und verknüpfe sie per Fremdschlüssel mit <code>verlag</code>.</p>",
     hints: ["Erst Spalte mit <code>ALTER TABLE … ADD COLUMN</code>, dann Fremdschlüssel mit <code>ADD FOREIGN KEY</code>."],
     solution: "CREATE TABLE verlag (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(80) NOT NULL UNIQUE\n);\nALTER TABLE buch ADD COLUMN verlag_id INT;\nALTER TABLE buch ADD CONSTRAINT fk_buch_verlag\n  FOREIGN KEY (verlag_id) REFERENCES verlag(id);"},
    {id: "k5-4", title: "Aufräumen in der richtigen Reihenfolge",
     task: "<p>Lösche beide Tabellen wieder. Welche Tabelle muss zuerst gelöscht werden und warum?</p>",
     solution: "DROP TABLE IF EXISTS buch;\nDROP TABLE IF EXISTS verlag;",
     note: "<code>buch</code> verweist per Fremdschlüssel auf <code>verlag</code>. Wird <code>verlag</code> zuerst gelöscht, meldet MariaDB einen Fehler."}
  ]
};
