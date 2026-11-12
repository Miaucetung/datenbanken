window.LESSONS[6] = {
  intro: "Jetzt kommt Leben in die Tabellen: Du fügst Datensätze ein, änderst sie und löschst sie wieder.",
  setup: "Lade die Übungsdatenbank neu: <code>source sql/lernshop.sql;</code> Danach <code>USE lernshop;</code>. Das Skript setzt alles zurück, du kannst also nichts kaputt machen.",
  sections: [
    {title: "Daten einfügen (INSERT)",
     code: ["-- Spalten angeben (empfohlen):\nINSERT INTO kunden (vorname, nachname, stadt, registriert)\nVALUES ('Hanna', 'Immel', 'Bonn', '2024-09-01');\n\n-- mehrere Zeilen auf einmal:\nINSERT INTO produkte (name, kategorie, preis, lagerbestand) VALUES\n  ('Radiergummi', 'Schreiben', 0.60, 200),\n  ('Textmarker',  'Schreiben', 1.10, 150);\n\n-- aus einer Abfrage:\nINSERT INTO kunden_archiv SELECT * FROM kunden WHERE registriert < '2023-06-01';"],
     text: "<p>Spalten, die du weglässt, bekommen ihren <code>DEFAULT</code>-Wert, bei <code>AUTO_INCREMENT</code> die nächste Nummer, sonst <code>NULL</code> (falls erlaubt). Texte und Datumswerte stehen in einfachen Anführungszeichen, Datum im Format <code>JJJJ-MM-TT</code>.</p>",
     tip: "Gib die Spaltennamen immer an. Dann bleibt der Befehl richtig, auch wenn die Tabelle später eine neue Spalte bekommt."},
    {title: "Daten aktualisieren (UPDATE)",
     code: ["UPDATE produkte SET preis = 4.90 WHERE produkt_id = 1;\n\n-- mehrere Spalten und Berechnung:\nUPDATE produkte\nSET preis = preis * 1.05, lagerbestand = lagerbestand + 10\nWHERE kategorie = 'Schreiben';"],
     warn: "<b>Ohne <code>WHERE</code> werden alle Zeilen geändert.</b> Schreibe die <code>WHERE</code>-Bedingung zuerst, oder prüfe sie vorher mit einem <code>SELECT</code>."},
    {title: "Bedingtes Einfügen und Aktualisieren",
     text: "<p>Oft soll eine Zeile eingefügt werden, falls es sie noch nicht gibt, sonst aktualisiert werden. MariaDB bietet dafür mehrere Wege:</p>",
     code: ["-- Bei doppeltem Schlüssel stattdessen aktualisieren:\nINSERT INTO produkte (produkt_id, name, kategorie, preis, lagerbestand)\nVALUES (1, 'Notizbuch A5', 'Papier', 4.70, 100)\nON DUPLICATE KEY UPDATE preis = VALUES(preis), lagerbestand = VALUES(lagerbestand);\n\n-- Zeile ersetzen (löscht die alte und fügt neu ein):\nREPLACE INTO produkte (produkt_id, name, kategorie, preis, lagerbestand)\nVALUES (1, 'Notizbuch A5', 'Papier', 4.70, 100);\n\n-- Fehler ignorieren, Zeile überspringen:\nINSERT IGNORE INTO kunden (kunden_id, vorname, nachname, registriert)\nVALUES (1, 'Doppelt', 'Egal', '2024-01-01');"],
     tip: "<code>ON DUPLICATE KEY UPDATE</code> ist meist die beste Wahl. <code>REPLACE</code> löscht die Zeile wirklich, das kann an Fremdschlüsseln scheitern."},
    {title: "Daten löschen",
     code: ["DELETE FROM bestellpositionen WHERE bestell_id = 6;\n\n-- ganze Tabelle leeren (schneller, setzt AUTO_INCREMENT zurück):\nTRUNCATE TABLE bestellpositionen;"],
     warn: "<code>DELETE</code> ohne <code>WHERE</code> löscht alle Zeilen. <code>TRUNCATE</code> lässt sich außerdem nicht zurückrollen. Bei Fremdschlüsseln muss zuerst in den Kindtabellen gelöscht werden."}
  ],
  exercises: [
    {id: "k6-1", title: "Zwei neue Produkte",
     task: "<p>Füge mit <b>einem</b> Befehl zwei Produkte in <code>produkte</code> ein: ‚Locher‘ (Kategorie Papier, 6.90 €, Lager 40) und ‚Bleistift‘ (Schreiben, 0.80 €, Lager 300).</p>",
     solution: "INSERT INTO produkte (name, kategorie, preis, lagerbestand) VALUES\n  ('Locher', 'Papier', 6.90, 40),\n  ('Bleistift', 'Schreiben', 0.80, 300);"},
    {id: "k6-2", title: "Preiserhöhung",
     task: "<p>Erhöhe den Preis aller Produkte der Kategorie ‚Möbel‘ um 10 %. Prüfe vorher und nachher mit einem <code>SELECT</code>.</p>",
     hints: ["Vorher: <code>SELECT name, preis FROM produkte WHERE kategorie = 'Möbel';</code>"],
     solution: "UPDATE produkte SET preis = preis * 1.10 WHERE kategorie = 'Möbel';\nSELECT name, preis FROM produkte WHERE kategorie = 'Möbel';"},
    {id: "k6-3", title: "Einfügen oder aktualisieren",
     task: "<p>Setze für Produkt 5 (Tintenpatronen) den Lagerbestand auf 60. Schreibe den Befehl so, dass er auch eine neue Zeile anlegt, falls <code>produkt_id</code> 5 nicht existiert.</p>",
     solution: "INSERT INTO produkte (produkt_id, name, kategorie, preis, lagerbestand)\nVALUES (5, 'Tintenpatronen 10er', 'Schreiben', 5.90, 60)\nON DUPLICATE KEY UPDATE lagerbestand = VALUES(lagerbestand);"},
    {id: "k6-4", title: "Gezielt löschen",
     task: "<p>Lösche die Kundin ‚Greta Huber‘. Beachte, dass sie keine Bestellungen hat. Was würde bei ‚Anna Berger‘ passieren und warum?</p>",
     solution: "DELETE FROM kunden WHERE nachname = 'Huber' AND vorname = 'Greta';",
     note: "Bei Anna Berger schlägt das Löschen fehl, weil <code>bestellungen</code> per Fremdschlüssel auf sie verweist. Erst müssten ihre Bestellpositionen und Bestellungen gelöscht werden."}
  ]
};
