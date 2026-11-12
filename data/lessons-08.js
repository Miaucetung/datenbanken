window.LESSONS[8] = {
  intro: "Schlüssel identifizieren Datensätze eindeutig und verbinden Tabellen. Indizes beschleunigen Abfragen. Beides legst du in MariaDB mit wenigen Befehlen an.",
  setup: "Lade die Übungsdatenbank neu: <code>source sql/lernshop.sql;</code> und <code>USE lernshop;</code>.",
  sections: [
    {title: "Schlüsselarten",
     text: "<table class='t'><tr><th>Begriff</th><th>Bedeutung</th><th>Beispiel</th></tr>" +
       "<tr><td>Kandidatenschlüssel</td><td>Spalte(n), die eine Zeile eindeutig bestimmen</td><td>kunden_id, email</td></tr>" +
       "<tr><td>Primärschlüssel</td><td>der gewählte Kandidat, genau einer je Tabelle, nie NULL</td><td>kunden_id</td></tr>" +
       "<tr><td>Zusammengesetzter Schlüssel</td><td>mehrere Spalten zusammen</td><td>(bestell_id, produkt_id)</td></tr>" +
       "<tr><td>Fremdschlüssel</td><td>verweist auf den Primärschlüssel einer anderen Tabelle</td><td>bestellungen.kunden_id</td></tr>" +
       "<tr><td>Surrogatschlüssel</td><td>künstliche Nummer ohne fachliche Bedeutung</td><td>AUTO_INCREMENT-ID</td></tr></table>"},
    {title: "Schlüssel festlegen und ändern",
     code: ["-- Primärschlüssel nachträglich:\nALTER TABLE t ADD PRIMARY KEY (id);\nALTER TABLE t DROP PRIMARY KEY;\n\n-- zusammengesetzt:\nCREATE TABLE zuordnung (\n  a INT NOT NULL,\n  b INT NOT NULL,\n  PRIMARY KEY (a, b)\n);\n\n-- Eindeutigkeit:\nALTER TABLE kunden ADD CONSTRAINT uq_email UNIQUE (email);\n\n-- Fremdschlüssel mit Verhalten beim Löschen/Ändern:\nCREATE TABLE rechnung (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  bestell_id INT NOT NULL,\n  FOREIGN KEY (bestell_id) REFERENCES bestellungen(bestell_id)\n    ON DELETE CASCADE ON UPDATE CASCADE\n);\n\nALTER TABLE rechnung DROP FOREIGN KEY rechnung_ibfk_1;"],
     text: "<p>Was bei <code>DELETE</code> oder <code>UPDATE</code> der referenzierten Zeile passiert, steuerst du mit:</p>" +
       "<ul><li><code>RESTRICT</code> (Standard): verbietet die Änderung</li><li><code>CASCADE</code>: zieht die Änderung in der Kindtabelle nach</li>" +
       "<li><code>SET NULL</code>: setzt den Fremdschlüssel auf NULL</li></ul>",
     tip: "<code>SHOW CREATE TABLE tabelle;</code> zeigt dir Namen von Constraints, die du zum Löschen brauchst."},
    {title: "Indizes",
     text: "<p>Ein Index ist wie das Stichwortverzeichnis eines Buchs: Die Datenbank findet Zeilen, ohne die ganze Tabelle zu lesen. Primärschlüssel und <code>UNIQUE</code>-Spalten bekommen automatisch einen Index. Fremdschlüssel ebenfalls.</p>",
     code: ["CREATE INDEX idx_stadt ON kunden (stadt);\nCREATE UNIQUE INDEX idx_name ON produkte (name);\nCREATE INDEX idx_kat_preis ON produkte (kategorie, preis);   -- mehrspaltig\n\nSHOW INDEX FROM kunden;\nDROP INDEX idx_stadt ON kunden;\n\n-- Prüfen, ob eine Abfrage den Index nutzt:\nEXPLAIN SELECT * FROM kunden WHERE stadt = 'Berlin';"],
     warn: "Indizes beschleunigen das Lesen, bremsen aber <code>INSERT</code>, <code>UPDATE</code> und <code>DELETE</code> und brauchen Speicherplatz. Lege sie für Spalten an, nach denen oft gesucht, verknüpft oder sortiert wird. In einem mehrspaltigen Index zählt die Reihenfolge: er hilft bei Bedingungen auf der ersten Spalte oder auf den ersten beiden zusammen, nicht auf der zweiten allein."}
  ],
  exercises: [
    {id: "k8-1", title: "Schlüssel erkennen",
     task: "<p>Zeige die Struktur der Tabelle <code>bestellpositionen</code> an. Aus welchen Spalten besteht ihr Primärschlüssel, und welche Spalten sind Fremdschlüssel?</p>",
     hints: ["<code>DESCRIBE</code> markiert Schlüssel in der Spalte „Key“, <code>SHOW CREATE TABLE</code> zeigt auch die Fremdschlüssel."],
     solution: "DESCRIBE bestellpositionen;\nSHOW CREATE TABLE bestellpositionen;",
     note: "Primärschlüssel ist <code>(bestell_id, produkt_id)</code>, beide Spalten sind zugleich Fremdschlüssel."},
    {id: "k8-2", title: "Index anlegen und prüfen",
     task: "<p>Lege einen Index auf <code>bestellungen.datum</code> an. Zeige danach alle Indizes der Tabelle <code>bestellungen</code> an.</p>",
     solution: "CREATE INDEX idx_datum ON bestellungen (datum);\nSHOW INDEX FROM bestellungen;"},
    {id: "k8-3", title: "Eindeutigkeit erzwingen",
     task: "<p>Stelle sicher, dass kein Kunde zweimal mit demselben Vor- und Nachnamen in <code>kunden</code> stehen kann (kombiniert eindeutig).</p>",
     solution: "ALTER TABLE kunden ADD CONSTRAINT uq_kunde_name UNIQUE (vorname, nachname);"},
    {id: "k8-4", title: "Kaskadierendes Löschen",
     task: "<p>Lege eine Tabelle <code>bewertung</code> an (<code>id</code> Primärschlüssel mit AUTO_INCREMENT, <code>produkt_id</code> Pflicht, <code>sterne</code> von 1 bis 5). <code>produkt_id</code> verweist auf <code>produkte</code>. Wird ein Produkt gelöscht, sollen seine Bewertungen mitgelöscht werden.</p>",
     solution: "CREATE TABLE bewertung (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  produkt_id INT NOT NULL,\n  sterne INT NOT NULL CHECK (sterne BETWEEN 1 AND 5),\n  FOREIGN KEY (produkt_id) REFERENCES produkte(produkt_id) ON DELETE CASCADE\n);"},
    {id: "k8-5", title: "EXPLAIN lesen",
     task: "<p>Führe <code>EXPLAIN SELECT * FROM kunden WHERE stadt = 'Berlin';</code> vor und nach dem Anlegen eines Index auf <code>stadt</code> aus. Was ändert sich in den Spalten <code>type</code> und <code>key</code>?</p>",
     solution: "EXPLAIN SELECT * FROM kunden WHERE stadt = 'Berlin';\nCREATE INDEX idx_stadt ON kunden (stadt);\nEXPLAIN SELECT * FROM kunden WHERE stadt = 'Berlin';",
     note: "Vorher <code>type = ALL</code> (ganze Tabelle gelesen), nachher <code>type = ref</code> mit <code>key = idx_stadt</code>. Bei so kleinen Tabellen kann der Optimierer den Index ignorieren. Der Effekt zeigt sich vor allem bei vielen Zeilen."}
  ]
};
