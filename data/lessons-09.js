window.LESSONS[9] = {
  intro: "Funktionen rechnen, formatieren und prüfen Werte direkt in der Abfrage. Manche sind im SQL-Standard, andere sind MariaDB-spezifisch und laufen in anderen Systemen anders oder gar nicht.",
  setup: "Lade die Übungsdatenbank neu: <code>source sql/lernshop.sql;</code> und <code>USE lernshop;</code>. Funktionen kannst du auch ohne Tabelle testen: <code>SELECT UPPER('abc');</code>",
  sections: [
    {title: "Textfunktionen",
     code: ["SELECT CONCAT(vorname, ' ', nachname) AS name FROM kunden;\nSELECT UPPER(nachname), LOWER(stadt) FROM kunden;\nSELECT CHAR_LENGTH(nachname) FROM kunden;\nSELECT SUBSTRING(nachname, 1, 3) FROM kunden;     -- ab Position 1, 3 Zeichen\nSELECT TRIM('  hallo  '), REPLACE('a-b-c', '-', '+');\nSELECT LEFT(email, LOCATE('@', email) - 1) AS benutzer FROM kunden;"],
     tip: "Der SQL-Standard-Operator für Verkettung ist <code>||</code>. In MariaDB heißt er nur dann so, wenn <code>SQL_MODE</code> <code>PIPES_AS_CONCAT</code> gesetzt ist, sonst bedeutet <code>||</code> ein ODER. Nimm <code>CONCAT()</code>."},
    {title: "Zahlenfunktionen",
     code: ["SELECT ROUND(19.987, 2), CEIL(4.1), FLOOR(4.9), ABS(-7), MOD(17, 5);\nSELECT name, ROUND(preis * 1.19, 2) AS brutto FROM produkte;\nSELECT RAND();   -- Zufallszahl 0 bis 1"]},
    {title: "Datum und Zeit",
     code: ["SELECT NOW(), CURDATE(), CURTIME();\nSELECT YEAR(registriert), MONTH(registriert), DAY(registriert) FROM kunden;\nSELECT DATEDIFF(CURDATE(), registriert) AS tage_kunde FROM kunden;\nSELECT DATE_ADD('2024-01-31', INTERVAL 1 MONTH);\nSELECT DATE_FORMAT(registriert, '%d.%m.%Y') AS datum_de FROM kunden;\nSELECT DAYNAME('2024-05-17');"],
     text: "<p>Formatzeichen für <code>DATE_FORMAT</code>: <code>%d</code> Tag, <code>%m</code> Monat, <code>%Y</code> Jahr vierstellig, <code>%H</code> Stunde, <code>%i</code> Minute, <code>%s</code> Sekunde.</p>"},
    {title: "NULL und Bedingungen",
     code: ["SELECT vorname, IFNULL(stadt, 'unbekannt') FROM kunden;\nSELECT vorname, COALESCE(stadt, email, 'keine Angabe') FROM kunden;   -- erster Wert, der nicht NULL ist\n\nSELECT name, preis,\n  CASE\n    WHEN preis < 2   THEN 'günstig'\n    WHEN preis < 30  THEN 'mittel'\n    ELSE 'teuer'\n  END AS preisklasse\nFROM produkte;\n\nSELECT CAST('42' AS UNSIGNED) + 1;"],
     text: "<p><code>COALESCE</code> und <code>CASE</code> gehören zum SQL-Standard und laufen überall. <code>IFNULL</code>, <code>IF()</code> und <code>DATE_FORMAT</code> sind MySQL/MariaDB-spezifisch.</p>"},
    {title: "Standard oder spezifisch?",
     text: "<table class='t'><tr><th>Standard-SQL</th><th>MariaDB-spezifisch</th></tr>" +
       "<tr><td><code>COALESCE</code>, <code>CASE</code>, <code>CAST</code></td><td><code>IFNULL</code>, <code>IF</code></td></tr>" +
       "<tr><td><code>CURRENT_DATE</code>, <code>CURRENT_TIMESTAMP</code></td><td><code>CURDATE()</code>, <code>NOW()</code></td></tr>" +
       "<tr><td><code>SUBSTRING(x FROM 2 FOR 3)</code></td><td><code>SUBSTRING(x, 2, 3)</code>, <code>LEFT</code>, <code>RIGHT</code></td></tr>" +
       "<tr><td>Aggregat: <code>COUNT SUM AVG MIN MAX</code></td><td><code>GROUP_CONCAT</code></td></tr></table>"}
  ],
  exercises: [
    {id: "k9-1", title: "Vollständiger Name",
     task: "<p>Gib für jeden Kunden eine Spalte <code>name</code> im Format ‚Nachname, Vorname‘ aus, alphabetisch sortiert.</p>",
     solution: "SELECT CONCAT(nachname, ', ', vorname) AS name FROM kunden ORDER BY nachname;"},
    {id: "k9-2", title: "Bruttopreis",
     task: "<p>Zeige Name und Bruttopreis (19 % MwSt.) aller Produkte, auf 2 Nachkommastellen gerundet, absteigend nach Bruttopreis.</p>",
     solution: "SELECT name, ROUND(preis * 1.19, 2) AS brutto FROM produkte ORDER BY brutto DESC;"},
    {id: "k9-3", title: "Datum formatieren",
     task: "<p>Zeige für jede Bestellung die ID und das Datum im deutschen Format (<code>17.05.2024</code>) sowie das Jahr in einer eigenen Spalte.</p>",
     solution: "SELECT bestell_id, DATE_FORMAT(datum, '%d.%m.%Y') AS datum_de, YEAR(datum) AS jahr FROM bestellungen;"},
    {id: "k9-4", title: "Mit NULL umgehen",
     task: "<p>Gib Vorname und Stadt aller Kunden aus. Fehlt die Stadt, soll ‚unbekannt‘ erscheinen. Löse es einmal mit <code>IFNULL</code> und einmal mit dem Standard-Weg.</p>",
     solution: "SELECT vorname, IFNULL(stadt, 'unbekannt') AS stadt FROM kunden;\nSELECT vorname, COALESCE(stadt, 'unbekannt') AS stadt FROM kunden;"},
    {id: "k9-5", title: "Preisklassen",
     task: "<p>Teile die Produkte in Klassen ein: unter 5 € ‚Kleinteil‘, ab 5 bis unter 50 € ‚Standard‘, ab 50 € ‚Premium‘. Zeige Name, Preis und Klasse.</p>",
     solution: "SELECT name, preis,\n  CASE\n    WHEN preis < 5  THEN 'Kleinteil'\n    WHEN preis < 50 THEN 'Standard'\n    ELSE 'Premium'\n  END AS klasse\nFROM produkte;"},
    {id: "k9-6", title: "Kundendauer",
     task: "<p>Berechne für jeden Kunden, wie viele volle Jahre er schon registriert ist (<code>CURDATE()</code> als Bezug). Zeige Vorname und Jahre.</p>",
     hints: ["<code>TIMESTAMPDIFF(YEAR, von, bis)</code> liefert volle Jahre."],
     solution: "SELECT vorname, TIMESTAMPDIFF(YEAR, registriert, CURDATE()) AS jahre FROM kunden;"},
    {id: "k9-7", title: "Produkte pro Kategorie als Liste",
     task: "<p>Gib pro Kategorie die Produktnamen in einer einzigen Zeile aus, durch Komma getrennt.</p>",
     hints: ["Die MariaDB-Aggregatfunktion heißt <code>GROUP_CONCAT</code>."],
     solution: "SELECT kategorie, GROUP_CONCAT(name SEPARATOR ', ') AS produkte\nFROM produkte\nGROUP BY kategorie;"}
  ]
};
