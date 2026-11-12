window.LESSONS[16] = {
  intro: "Ein Trigger ist ein Programm, das die Datenbank automatisch ausführt, wenn Daten in einer Tabelle eingefügt, geändert oder gelöscht werden. Du rufst ihn nie selbst auf.",
  setup: "Lade die Übungsdatenbank neu: <code>source sql/lernshop.sql;</code> und <code>USE lernshop;</code>. Wie bei Prozeduren brauchst du <code>DELIMITER</code>.",
  sections: [
    {title: "Wann Trigger?",
     text: "<p>Typische Einsatzfälle: Änderungen protokollieren (Audit-Log), Regeln prüfen, die ein <code>CHECK</code> nicht ausdrücken kann, abgeleitete Werte pflegen. Trigger laufen unsichtbar im Hintergrund. Setze sie sparsam ein, sonst wundert man sich über Nebenwirkungen.</p>"},
    {title: "Trigger erstellen",
     code: ["CREATE TABLE preis_log (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  produkt_id INT NOT NULL,\n  alter_preis DECIMAL(8,2),\n  neuer_preis DECIMAL(8,2),\n  geaendert_am DATETIME NOT NULL\n);\n\nDELIMITER //\nCREATE TRIGGER trg_produkte_preis_log\nAFTER UPDATE ON produkte\nFOR EACH ROW\nBEGIN\n  IF OLD.preis <> NEW.preis THEN\n    INSERT INTO preis_log (produkt_id, alter_preis, neuer_preis, geaendert_am)\n    VALUES (OLD.produkt_id, OLD.preis, NEW.preis, NOW());\n  END IF;\nEND //\nDELIMITER ;\n\nUPDATE produkte SET preis = 5.00 WHERE produkt_id = 1;\nSELECT * FROM preis_log;"],
     text: "<table class='t'><tr><th>Bestandteil</th><th>Bedeutung</th></tr>" +
       "<tr><td><code>BEFORE</code> / <code>AFTER</code></td><td>vor oder nach der eigentlichen Änderung</td></tr>" +
       "<tr><td><code>INSERT</code> / <code>UPDATE</code> / <code>DELETE</code></td><td>auslösendes Ereignis (je Trigger genau eins)</td></tr>" +
       "<tr><td><code>FOR EACH ROW</code></td><td>läuft einmal pro betroffener Zeile</td></tr>" +
       "<tr><td><code>NEW.spalte</code></td><td>neuer Wert (bei INSERT, UPDATE)</td></tr>" +
       "<tr><td><code>OLD.spalte</code></td><td>alter Wert (bei UPDATE, DELETE)</td></tr></table>"},
    {title: "Werte prüfen und korrigieren (BEFORE)",
     code: ["DELIMITER //\nCREATE TRIGGER trg_kunden_vor_insert\nBEFORE INSERT ON kunden\nFOR EACH ROW\nBEGIN\n  SET NEW.nachname = CONCAT(UPPER(LEFT(NEW.nachname, 1)), LOWER(SUBSTRING(NEW.nachname, 2)));\n  IF NEW.registriert > CURDATE() THEN\n    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registrierungsdatum liegt in der Zukunft';\n  END IF;\nEND //\nDELIMITER ;"],
     text: "<p>Nur in <code>BEFORE</code>-Triggern kannst du <code>NEW</code>-Werte verändern. Mit <code>SIGNAL</code> brichst du die Aktion mit einer Fehlermeldung ab.</p>"},
    {title: "Anzeigen, ändern, löschen",
     code: ["SHOW TRIGGERS;\nSHOW CREATE TRIGGER trg_produkte_preis_log;\nDROP TRIGGER IF EXISTS trg_produkte_preis_log;"],
     text: "<p>Ändern geht nur durch Löschen und Neuanlegen. Nutze Namen wie <code>trg_tabelle_zeitpunkt_ereignis</code>, damit du sie wiederfindest.</p>",
     warn: "Ein Trigger kann sich nicht auf dieselbe Tabelle auswirken, die ihn auslöst, ohne Vorsicht (Endlosschleife). MariaDB verbietet das Ändern der eigenen Tabelle in einem Trigger weitgehend. Trigger auf einer Tabelle werden auch durch <code>TRUNCATE</code> nicht ausgelöst."}
  ],
  exercises: [
    {id: "k16-1", title: "Preisänderungen protokollieren",
     task: "<p>Lege die Tabelle <code>preis_log</code> und den Trigger <code>trg_produkte_preis_log</code> aus dem Beispiel an. Ändere zwei Preise und zeige das Protokoll.</p>",
     solution: "CREATE TABLE preis_log (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  produkt_id INT NOT NULL,\n  alter_preis DECIMAL(8,2),\n  neuer_preis DECIMAL(8,2),\n  geaendert_am DATETIME NOT NULL\n);\n\nDELIMITER //\nCREATE TRIGGER trg_produkte_preis_log\nAFTER UPDATE ON produkte\nFOR EACH ROW\nBEGIN\n  IF OLD.preis <> NEW.preis THEN\n    INSERT INTO preis_log (produkt_id, alter_preis, neuer_preis, geaendert_am)\n    VALUES (OLD.produkt_id, OLD.preis, NEW.preis, NOW());\n  END IF;\nEND //\nDELIMITER ;\n\nUPDATE produkte SET preis = 5.00 WHERE produkt_id = 1;\nUPDATE produkte SET preis = preis * 2 WHERE produkt_id = 2;\nSELECT * FROM preis_log;"},
    {id: "k16-2", title: "Negative Mengen verhindern",
     task: "<p>Schreibe einen <code>BEFORE INSERT</code>-Trigger auf <code>produkte</code>, der den Lagerbestand auf 0 setzt, wenn jemand einen negativen Wert einfügt. Teste mit einem Produkt mit Lager <code>-5</code>.</p>",
     solution: "DELIMITER //\nCREATE TRIGGER trg_produkte_vor_insert\nBEFORE INSERT ON produkte\nFOR EACH ROW\nBEGIN\n  IF NEW.lagerbestand < 0 THEN\n    SET NEW.lagerbestand = 0;\n  END IF;\nEND //\nDELIMITER ;\n\nINSERT INTO produkte (name, kategorie, preis, lagerbestand) VALUES ('Testartikel', 'Papier', 1.00, -5);\nSELECT name, lagerbestand FROM produkte WHERE name = 'Testartikel';"},
    {id: "k16-3", title: "Löschen archivieren",
     task: "<p>Lege eine Tabelle <code>kunden_archiv</code> (<code>kunden_id</code>, <code>vorname</code>, <code>nachname</code>, <code>geloescht_am</code> als DATETIME) an. Schreibe einen <code>AFTER DELETE</code>-Trigger auf <code>kunden</code>, der den gelöschten Kunden dort ablegt. Lösche dann Kundin 7 (Greta Huber, ohne Bestellungen) und prüfe das Archiv.</p>",
     solution: "CREATE TABLE kunden_archiv (\n  kunden_id INT,\n  vorname VARCHAR(50),\n  nachname VARCHAR(50),\n  geloescht_am DATETIME\n);\n\nDELIMITER //\nCREATE TRIGGER trg_kunden_nach_delete\nAFTER DELETE ON kunden\nFOR EACH ROW\nBEGIN\n  INSERT INTO kunden_archiv (kunden_id, vorname, nachname, geloescht_am)\n  VALUES (OLD.kunden_id, OLD.vorname, OLD.nachname, NOW());\nEND //\nDELIMITER ;\n\nDELETE FROM kunden WHERE kunden_id = 7;\nSELECT * FROM kunden_archiv;"},
    {id: "k16-4", title: "Regel mit SIGNAL",
     task: "<p>Schreibe einen <code>BEFORE UPDATE</code>-Trigger auf <code>bestellungen</code>, der verhindert, dass der Status einer bereits ‚geliefert‘en Bestellung geändert wird (Fehlermeldung mit <code>SIGNAL</code>). Prüfe mit <code>SHOW TRIGGERS</code> und räume anschließend den Trigger auf.</p>",
     solution: "DELIMITER //\nCREATE TRIGGER trg_bestellungen_vor_update\nBEFORE UPDATE ON bestellungen\nFOR EACH ROW\nBEGIN\n  IF OLD.status = 'geliefert' AND NEW.status <> OLD.status THEN\n    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Gelieferte Bestellungen sind nicht änderbar';\n  END IF;\nEND //\nDELIMITER ;\n\nSHOW TRIGGERS;\n-- Fehlerfall (ERROR 1644): UPDATE bestellungen SET status = 'offen' WHERE bestell_id = 1;\nUPDATE bestellungen SET status = 'versendet' WHERE bestell_id = 4;\nDROP TRIGGER IF EXISTS trg_bestellungen_vor_update;",
     note: "Der fehlschlagende <code>UPDATE</code> ist als Kommentar eingefügt. Führe ihn im Client einzeln aus, dann siehst du die Fehlermeldung."}
  ]
};
