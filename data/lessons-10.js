window.LESSONS[10] = {
  intro: "Daten liegen verteilt auf mehrere Tabellen. Mit Verknüpfungen (JOINs), Mengenoperationen und Unterabfragen holst du sie wieder zusammen.",
  setup: "Lade die Übungsdatenbank neu: <code>source sql/lernshop.sql;</code> und <code>USE lernshop;</code>. Beziehungen: <code>bestellungen.kunden_id → kunden</code>, <code>bestellpositionen.bestell_id → bestellungen</code>, <code>bestellpositionen.produkt_id → produkte</code>.",
  sections: [
    {title: "Warum verknüpfen?",
     text: "<p>Eine Bestellung kennt nur die Nummer des Kunden, nicht seinen Namen. Um beides zusammen zu sehen, verbindest du die Tabellen über die Schlüsselspalten. Ohne Verknüpfungsbedingung entsteht das kartesische Produkt: jede Zeile der einen Tabelle mit jeder der anderen. Das ist fast nie gewollt.</p>"},
    {title: "Einfaches Verknüpfen (Komma-Schreibweise)",
     code: ["SELECT k.vorname, b.bestell_id, b.datum\nFROM kunden k, bestellungen b\nWHERE k.kunden_id = b.kunden_id;"],
     text: "<p>Das ist die alte Schreibweise. Sie funktioniert, aber vergisst du die <code>WHERE</code>-Bedingung, bekommst du das kartesische Produkt. Moderner und klarer ist <code>JOIN</code>.</p>"},
    {title: "JOIN",
     code: ["-- INNER JOIN: nur Zeilen mit Partner auf beiden Seiten\nSELECT k.vorname, b.bestell_id, b.datum\nFROM kunden k\nINNER JOIN bestellungen b ON b.kunden_id = k.kunden_id;\n\n-- LEFT JOIN: alle Kunden, auch ohne Bestellung (dann NULL)\nSELECT k.vorname, b.bestell_id\nFROM kunden k\nLEFT JOIN bestellungen b ON b.kunden_id = k.kunden_id;\n\n-- RIGHT JOIN: alle Zeilen der rechten Tabelle\nSELECT k.vorname, b.bestell_id\nFROM kunden k\nRIGHT JOIN bestellungen b ON b.kunden_id = k.kunden_id;\n\n-- mehrere Tabellen:\nSELECT k.nachname, p.name, bp.menge\nFROM kunden k\nJOIN bestellungen b        ON b.kunden_id = k.kunden_id\nJOIN bestellpositionen bp  ON bp.bestell_id = b.bestell_id\nJOIN produkte p            ON p.produkt_id = bp.produkt_id;"],
     text: "<table class='t'><tr><th>JOIN</th><th>Ergebnis</th></tr>" +
       "<tr><td><code>INNER JOIN</code></td><td>nur Treffer auf beiden Seiten</td></tr>" +
       "<tr><td><code>LEFT JOIN</code></td><td>alle links, rechts NULL wenn kein Partner</td></tr>" +
       "<tr><td><code>RIGHT JOIN</code></td><td>alle rechts, links NULL wenn kein Partner</td></tr>" +
       "<tr><td><code>CROSS JOIN</code></td><td>alle Kombinationen</td></tr>" +
       "<tr><td>Self-Join</td><td>Tabelle mit sich selbst verknüpfen (mit zwei Aliasen)</td></tr></table>" +
       "<p>MariaDB kennt <code>FULL OUTER JOIN</code> nicht. Du simulierst ihn mit <code>LEFT JOIN … UNION … RIGHT JOIN</code>.</p>",
     tip: "Vergib kurze Aliase (<code>kunden k</code>) und schreibe sie vor jede Spalte. Das macht die Abfrage lesbar und vermeidet Mehrdeutigkeitsfehler."},
    {title: "Zwei Tabellen vereinigen (UNION)",
     code: ["SELECT stadt FROM kunden WHERE stadt IS NOT NULL\nUNION\nSELECT 'Wien';            -- entfernt Duplikate\n\nSELECT vorname FROM kunden\nUNION ALL\nSELECT name FROM produkte;   -- behält Duplikate, schneller"],
     text: "<p>Beide Abfragen müssen gleich viele Spalten mit kompatiblen Typen haben. Die Spaltennamen kommen aus der ersten Abfrage.</p>"},
    {title: "Schnitt- und Differenzmengen",
     code: ["-- Kunden, die in Berlin ODER Hamburg wohnen UND (Schnitt) bestellt haben:\nSELECT kunden_id FROM kunden WHERE stadt IN ('Berlin', 'Hamburg')\nINTERSECT\nSELECT kunden_id FROM bestellungen;\n\n-- Kunden OHNE Bestellung (Differenz):\nSELECT kunden_id FROM kunden\nEXCEPT\nSELECT kunden_id FROM bestellungen;"],
     text: "<p><code>INTERSECT</code> und <code>EXCEPT</code> gibt es in MariaDB ab Version 10.3. Das Gleiche geht auch mit <code>JOIN</code> oder <code>IN</code> / <code>NOT IN</code>, das läuft auch in älteren Versionen und anderen Systemen.</p>"},
    {title: "Unterabfragen",
     code: ["-- Skalar: ein einzelner Wert\nSELECT name, preis FROM produkte\nWHERE preis > (SELECT AVG(preis) FROM produkte);\n\n-- mit IN: Liste von Werten\nSELECT vorname FROM kunden\nWHERE kunden_id IN (SELECT kunden_id FROM bestellungen WHERE status = 'offen');\n\n-- mit EXISTS: gibt es mindestens eine Zeile?\nSELECT vorname FROM kunden k\nWHERE NOT EXISTS (SELECT 1 FROM bestellungen b WHERE b.kunden_id = k.kunden_id);\n\n-- in FROM: abgeleitete Tabelle (braucht einen Alias)\nSELECT AVG(anzahl) FROM (\n  SELECT kunden_id, COUNT(*) AS anzahl FROM bestellungen GROUP BY kunden_id\n) AS t;"],
     warn: "<code>NOT IN</code> liefert nichts, wenn die Unterabfrage ein <code>NULL</code> enthält. <code>NOT EXISTS</code> ist hier sicherer."}
  ],
  exercises: [
    {id: "k10-1", title: "Bestellungen mit Kundenname",
     task: "<p>Zeige zu jeder Bestellung Bestellnummer, Datum und den Nachnamen des Kunden.</p>",
     solution: "SELECT b.bestell_id, b.datum, k.nachname\nFROM bestellungen b\nJOIN kunden k ON k.kunden_id = b.kunden_id;"},
    {id: "k10-2", title: "Auch Kunden ohne Bestellung",
     task: "<p>Zeige alle Kunden (Vorname) mit der Anzahl ihrer Bestellungen. Kunden ohne Bestellung sollen mit 0 erscheinen.</p>",
     hints: ["<code>LEFT JOIN</code> und <code>COUNT(b.bestell_id)</code> (nicht <code>COUNT(*)</code>, das würde die NULL-Zeile mitzählen)."],
     solution: "SELECT k.vorname, COUNT(b.bestell_id) AS anzahl\nFROM kunden k\nLEFT JOIN bestellungen b ON b.kunden_id = k.kunden_id\nGROUP BY k.kunden_id, k.vorname;"},
    {id: "k10-3", title: "Drei Tabellen",
     task: "<p>Liste jede bestellte Position mit Kunden-Nachname, Produktname und Menge.</p>",
     solution: "SELECT k.nachname, p.name, bp.menge\nFROM kunden k\nJOIN bestellungen b       ON b.kunden_id = k.kunden_id\nJOIN bestellpositionen bp ON bp.bestell_id = b.bestell_id\nJOIN produkte p           ON p.produkt_id = bp.produkt_id\nORDER BY k.nachname;"},
    {id: "k10-4", title: "Umsatz je Kunde",
     task: "<p>Berechne den Gesamtumsatz (Menge × Preis) pro Kunde. Zeige Nachname und Umsatz, höchster Umsatz zuerst.</p>",
     solution: "SELECT k.nachname, SUM(bp.menge * p.preis) AS umsatz\nFROM kunden k\nJOIN bestellungen b       ON b.kunden_id = k.kunden_id\nJOIN bestellpositionen bp ON bp.bestell_id = b.bestell_id\nJOIN produkte p           ON p.produkt_id = bp.produkt_id\nGROUP BY k.kunden_id, k.nachname\nORDER BY umsatz DESC;"},
    {id: "k10-5", title: "Nie bestellte Produkte",
     task: "<p>In der Übungsdatenbank wurde bisher jedes Produkt bestellt. Füge deshalb zuerst ein neues Produkt ‚Locher‘ (Papier, 6.90 €, Lager 40) ein. Finde dann alle Produkte, die noch nie bestellt wurden, mit <code>LEFT JOIN … IS NULL</code>.</p>",
     solution: "INSERT INTO produkte (name, kategorie, preis, lagerbestand) VALUES ('Locher', 'Papier', 6.90, 40);\n\nSELECT p.name\nFROM produkte p\nLEFT JOIN bestellpositionen bp ON bp.produkt_id = p.produkt_id\nWHERE bp.produkt_id IS NULL;",
     note: "Ergebnis: Locher."},
    {id: "k10-6", title: "Kunden ohne Bestellung (3 Wege)",
     task: "<p>Finde die Kunden ohne Bestellung auf drei Arten: mit <code>NOT EXISTS</code>, mit <code>NOT IN</code> und mit <code>EXCEPT</code> (Vornamen ausgeben, bei <code>EXCEPT</code> die IDs).</p>",
     solution: "SELECT vorname FROM kunden k\nWHERE NOT EXISTS (SELECT 1 FROM bestellungen b WHERE b.kunden_id = k.kunden_id);\n\nSELECT vorname FROM kunden\nWHERE kunden_id NOT IN (SELECT kunden_id FROM bestellungen);\n\nSELECT kunden_id FROM kunden\nEXCEPT\nSELECT kunden_id FROM bestellungen;"},
    {id: "k10-7", title: "Überdurchschnittlich teuer",
     task: "<p>Zeige alle Produkte, die teurer sind als der Durchschnittspreis ihrer eigenen Kategorie.</p>",
     hints: ["Korrelierte Unterabfrage: Die innere Abfrage verweist auf die Kategorie der äußeren Zeile."],
     solution: "SELECT p.name, p.kategorie, p.preis\nFROM produkte p\nWHERE p.preis > (SELECT AVG(p2.preis) FROM produkte p2 WHERE p2.kategorie = p.kategorie);"},
    {id: "k10-8", title: "Städte und Kategorien in einer Liste",
     task: "<p>Erstelle mit <code>UNION</code> eine einzige Spalte <code>begriff</code> mit allen verschiedenen Städten der Kunden und allen Produktkategorien (ohne NULL).</p>",
     solution: "SELECT stadt AS begriff FROM kunden WHERE stadt IS NOT NULL\nUNION\nSELECT kategorie FROM produkte;"}
  ]
};
