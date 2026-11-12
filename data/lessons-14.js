window.LESSONS[14] = {
  intro: "Eine Transaktion fasst mehrere Befehle zu einer Einheit zusammen: Entweder gelingen alle, oder keiner wirkt. So bleiben Daten auch bei Fehlern konsistent.",
  setup: "Lade die Übungsdatenbank neu: <code>source sql/lernshop.sql;</code> und <code>USE lernshop;</code>. Transaktionen funktionieren nur mit Tabellen der Engine <b>InnoDB</b> (in MariaDB der Standard).",
  sections: [
    {title: "Warum Transaktionen?",
     text: "<p>Beispiel Überweisung: Abbuchen von Konto A und Gutschreiben auf Konto B müssen zusammen passieren. Stürzt das System dazwischen ab, wäre Geld verschwunden. Transaktionen garantieren die <b>ACID</b>-Eigenschaften:</p>" +
       "<table class='t'><tr><th>Buchstabe</th><th>Bedeutung</th></tr><tr><td>Atomicity</td><td>alles oder nichts</td></tr><tr><td>Consistency</td><td>danach gelten alle Regeln (Constraints)</td></tr>" +
       "<tr><td>Isolation</td><td>parallele Transaktionen stören sich nicht</td></tr><tr><td>Durability</td><td>Bestätigtes bleibt, auch nach Absturz</td></tr></table>"},
    {title: "Transaktion starten und abschließen",
     code: ["START TRANSACTION;     -- oder: BEGIN;\n\nUPDATE produkte SET lagerbestand = lagerbestand - 1 WHERE produkt_id = 7;\nINSERT INTO bestellungen (kunden_id, datum, status) VALUES (5, CURDATE(), 'offen');\n\nCOMMIT;                -- alles dauerhaft speichern"],
     text: "<p>Standardmäßig ist <code>AUTOCOMMIT</code> an: Jeder einzelne Befehl wird sofort fest gespeichert. <code>START TRANSACTION</code> schaltet das bis zum <code>COMMIT</code> oder <code>ROLLBACK</code> ab. Mit <code>SET autocommit = 0;</code> schaltest du es für die Sitzung aus. Prüfen: <code>SELECT @@autocommit;</code>"},
    {title: "Transaktion zurücksetzen",
     code: ["START TRANSACTION;\nDELETE FROM bestellpositionen;\nSELECT COUNT(*) FROM bestellpositionen;   -- 0, aber nur in dieser Sitzung sichtbar\nROLLBACK;                                  -- alles rückgängig\nSELECT COUNT(*) FROM bestellpositionen;   -- wieder 10"],
     tip: "Teste riskante <code>UPDATE</code>/<code>DELETE</code>-Befehle in einer Transaktion: Ergebnis prüfen, dann <code>COMMIT</code> oder <code>ROLLBACK</code>."},
    {title: "Savepoints",
     code: ["START TRANSACTION;\nUPDATE produkte SET preis = preis + 1 WHERE kategorie = 'Papier';\nSAVEPOINT nach_papier;\nUPDATE produkte SET preis = preis + 1 WHERE kategorie = 'Möbel';\nROLLBACK TO nach_papier;    -- nur die Möbel-Änderung zurück\nCOMMIT;                     -- Papier-Änderung bleibt"]},
    {title: "Was du wissen musst",
     warn: "<b>DDL-Befehle</b> wie <code>CREATE TABLE</code>, <code>ALTER TABLE</code> und <code>DROP</code> lösen einen <b>impliziten COMMIT</b> aus und können nicht zurückgerollt werden. Auch <code>TRUNCATE</code> nicht.",
     text: "<p>Isolationsstufen steuern, wie stark sich parallele Transaktionen sehen: <code>READ UNCOMMITTED</code>, <code>READ COMMITTED</code>, <code>REPEATABLE READ</code> (Standard in InnoDB), <code>SERIALIZABLE</code>. Setzen mit <code>SET TRANSACTION ISOLATION LEVEL READ COMMITTED;</code> vor dem Start. Wenn zwei Transaktionen auf dieselbe Zeile warten, kann ein <i>Deadlock</i> entstehen, MariaDB bricht dann eine der beiden ab. Wiederhole sie in dem Fall.</p>"}
  ],
  exercises: [
    {id: "k14-1", title: "Rollback testen",
     task: "<p>Starte eine Transaktion, erhöhe alle Preise um 50 %, zeige die Preise an und setze alles zurück. Zeige die Preise danach nochmal an.</p>",
     solution: "START TRANSACTION;\nUPDATE produkte SET preis = preis * 1.5;\nSELECT name, preis FROM produkte;\nROLLBACK;\nSELECT name, preis FROM produkte;"},
    {id: "k14-2", title: "Bestellung als Einheit",
     task: "<p>Kunde 5 (Eva) bestellt 2 Stück Bürostuhl (<code>produkt_id</code> 7). Lege in <b>einer Transaktion</b> die Bestellung an, füge die Position hinzu (benutze <code>LAST_INSERT_ID()</code> für die neue <code>bestell_id</code>) und verringere den Lagerbestand um 2. Schließe mit <code>COMMIT</code> ab.</p>",
     solution: "START TRANSACTION;\nINSERT INTO bestellungen (kunden_id, datum, status) VALUES (5, CURDATE(), 'offen');\nINSERT INTO bestellpositionen (bestell_id, produkt_id, menge) VALUES (LAST_INSERT_ID(), 7, 2);\nUPDATE produkte SET lagerbestand = lagerbestand - 2 WHERE produkt_id = 7;\nCOMMIT;\n\nSELECT * FROM bestellpositionen WHERE produkt_id = 7;\nSELECT lagerbestand FROM produkte WHERE produkt_id = 7;"},
    {id: "k14-3", title: "Savepoint",
     task: "<p>Starte eine Transaktion. Setze den Preis von Produkt 1 auf 5.00, lege einen Savepoint an, setze den Preis von Produkt 2 auf 9.99, gehe zum Savepoint zurück und bestätige. Welche der beiden Änderungen bleibt?</p>",
     solution: "START TRANSACTION;\nUPDATE produkte SET preis = 5.00 WHERE produkt_id = 1;\nSAVEPOINT sp1;\nUPDATE produkte SET preis = 9.99 WHERE produkt_id = 2;\nROLLBACK TO sp1;\nCOMMIT;\nSELECT produkt_id, preis FROM produkte WHERE produkt_id IN (1, 2);",
     note: "Nur die erste Änderung (Produkt 1 = 5.00) bleibt. Produkt 2 behält den alten Preis."},
    {id: "k14-4", title: "Autocommit beobachten",
     task: "<p>Zeige den Wert von <code>@@autocommit</code> an. Schalte Autocommit aus, ändere einen Preis, mache <code>ROLLBACK</code>, und schalte es wieder an.</p>",
     solution: "SELECT @@autocommit;\nSET autocommit = 0;\nUPDATE produkte SET preis = 0.01 WHERE produkt_id = 1;\nROLLBACK;\nSET autocommit = 1;\nSELECT preis FROM produkte WHERE produkt_id = 1;"}
  ]
};
