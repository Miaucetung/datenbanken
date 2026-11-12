window.LESSONS[7] = {
  intro: "Mit SELECT holst du Daten aus Tabellen. Du lernst, Spalten auszuwählen, Zeilen zu filtern, zu gruppieren und zu sortieren.",
  setup: "Lade die Übungsdatenbank neu: <code>source sql/lernshop.sql;</code> und <code>USE lernshop;</code>. Tabellen: <code>kunden</code>, <code>produkte</code>, <code>bestellungen</code>, <code>bestellpositionen</code>.",
  sections: [
    {title: "SELECT-Grundlagen",
     code: ["SELECT * FROM kunden;                       -- alle Spalten\nSELECT vorname, nachname FROM kunden;       -- bestimmte Spalten\nSELECT DISTINCT stadt FROM kunden;          -- ohne Duplikate\nSELECT name, preis * 1.19 AS brutto FROM produkte;   -- Berechnung mit Alias\nSELECT * FROM produkte LIMIT 3;             -- nur die ersten 3 Zeilen"],
     text: "<p>Die Reihenfolge im Befehl ist fest: <code>SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT</code>.</p>"},
    {title: "Bedingungen (WHERE)",
     code: ["SELECT * FROM produkte WHERE preis > 5;\nSELECT * FROM produkte WHERE kategorie = 'Möbel' AND lagerbestand > 0;\nSELECT * FROM produkte WHERE preis BETWEEN 1 AND 5;\nSELECT * FROM kunden WHERE stadt IN ('Berlin', 'Hamburg');\nSELECT * FROM kunden WHERE nachname LIKE 'B%';     -- beginnt mit B\nSELECT * FROM kunden WHERE email IS NULL;          -- fehlender Wert\nSELECT * FROM kunden WHERE NOT stadt = 'Berlin';"],
     text: "<table class='t'><tr><th>Operator</th><th>Bedeutung</th></tr>" +
       "<tr><td><code>= &lt;&gt; != &lt; &gt; &lt;= &gt;=</code></td><td>Vergleiche</td></tr>" +
       "<tr><td><code>AND OR NOT</code></td><td>Verknüpfung (AND bindet stärker als OR)</td></tr>" +
       "<tr><td><code>BETWEEN a AND b</code></td><td>im Bereich, Grenzen eingeschlossen</td></tr>" +
       "<tr><td><code>IN (…)</code></td><td>einer der Werte</td></tr>" +
       "<tr><td><code>LIKE</code></td><td><code>%</code> = beliebig viele Zeichen, <code>_</code> = genau eins</td></tr>" +
       "<tr><td><code>IS NULL</code></td><td>kein Wert vorhanden</td></tr></table>",
     warn: "<code>NULL</code> vergleichst du nie mit <code>=</code>. <code>WHERE email = NULL</code> liefert nie etwas, richtig ist <code>IS NULL</code>. Bei <code>NOT IN</code> mit NULL-Werten in der Liste entstehen ebenfalls leere Ergebnisse."},
    {title: "Gruppieren (GROUP BY)",
     code: ["SELECT kategorie, COUNT(*) AS anzahl, AVG(preis) AS durchschnitt\nFROM produkte\nGROUP BY kategorie;\n\n-- Gruppen filtern mit HAVING:\nSELECT kategorie, SUM(lagerbestand) AS lager\nFROM produkte\nGROUP BY kategorie\nHAVING SUM(lagerbestand) > 100;"],
     text: "<p>Aggregatfunktionen: <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>. <code>WHERE</code> filtert Zeilen <i>vor</i> dem Gruppieren, <code>HAVING</code> filtert Gruppen <i>danach</i>. Alle Spalten im <code>SELECT</code>, die keine Aggregatfunktion sind, müssen in <code>GROUP BY</code> stehen.</p>"},
    {title: "Sortieren (ORDER BY)",
     code: ["SELECT name, preis FROM produkte ORDER BY preis;           -- aufsteigend (ASC)\nSELECT name, preis FROM produkte ORDER BY preis DESC;      -- absteigend\nSELECT * FROM kunden ORDER BY stadt, nachname;            -- erst Stadt, dann Name\nSELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 3;  -- die 3 teuersten"]}
  ],
  exercises: [
    {id: "k7-1", title: "Spalten und Alias",
     task: "<p>Gib Vor- und Nachname aller Kunden aus. Die Spalten sollen ‚Vorname‘ und ‚Familienname‘ heißen.</p>",
     solution: "SELECT vorname AS Vorname, nachname AS Familienname FROM kunden;"},
    {id: "k7-2", title: "Filtern",
     task: "<p>Zeige Name und Preis aller Produkte, die mehr als 3 € kosten und lieferbar sind (Lagerbestand über 0).</p>",
     solution: "SELECT name, preis FROM produkte WHERE preis > 3 AND lagerbestand > 0;",
     note: "Ergebnis: Notizbuch A5, Füller Classic, Ordner breit, Schreibtischlampe, Bürostuhl. Tintenpatronen fallen wegen Lagerbestand 0 heraus."},
    {id: "k7-3", title: "Muster und NULL",
     task: "<p>a) Zeige alle Kunden, deren Nachname mit ‚G‘ oder ‚H‘ beginnt.<br>b) Zeige alle Kunden ohne Stadtangabe.</p>",
     hints: ["Für a) zweimal <code>LIKE</code> mit <code>OR</code>, oder <code>REGEXP '^[GH]'</code>."],
     solution: "-- a)\nSELECT * FROM kunden WHERE nachname LIKE 'G%' OR nachname LIKE 'H%';\n-- b)\nSELECT * FROM kunden WHERE stadt IS NULL;"},
    {id: "k7-4", title: "Gruppieren",
     task: "<p>Wie viele Kunden gibt es pro Stadt? Zeige nur Städte, in denen mindestens 2 Kunden wohnen. Kunden ohne Stadt sollen nicht mitgezählt werden.</p>",
     hints: ["Erst <code>WHERE stadt IS NOT NULL</code>, dann <code>GROUP BY</code> und <code>HAVING COUNT(*) &gt;= 2</code>."],
     solution: "SELECT stadt, COUNT(*) AS anzahl\nFROM kunden\nWHERE stadt IS NOT NULL\nGROUP BY stadt\nHAVING COUNT(*) >= 2;",
     note: "Ergebnis: Berlin (2), Hamburg (2)."},
    {id: "k7-5", title: "Sortieren und Begrenzen",
     task: "<p>Zeige die drei teuersten Produkte mit Name und Preis, das teuerste zuerst.</p>",
     solution: "SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 3;"},
    {id: "k7-6", title: "Kennzahlen",
     task: "<p>Berechne pro Kategorie den Gesamtwert des Lagers (<code>preis * lagerbestand</code>), sortiert vom höchsten zum niedrigsten Wert.</p>",
     solution: "SELECT kategorie, SUM(preis * lagerbestand) AS lagerwert\nFROM produkte\nGROUP BY kategorie\nORDER BY lagerwert DESC;"}
  ]
};
