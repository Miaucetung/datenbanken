window.LESSONS[3] = {
  intro: "Das relationale Modell ist die Grundlage von SQL. Du lernst die Begriffe, wie ein ER-Modell zu Tabellen wird, wie du Tabellen durch Normalisierung sauber gestaltest und wie die relationale Algebra mit SQL zusammenhängt.",
  setup: "Für die Übungen mit SQL: <code>source sql/lernshop.sql;</code> und <code>USE lernshop;</code>. Die Normalisierungsaufgaben legst du in <code>uebung</code> an.",
  sections: [
    {title: "Begriffe",
     text: "<table class='t'><tr><th>Formal</th><th>Im Alltag / SQL</th><th>Bedeutung</th></tr>" +
       "<tr><td>Relation</td><td>Tabelle</td><td>Menge gleichartiger Datensätze</td></tr>" +
       "<tr><td>Tupel</td><td>Zeile</td><td>ein Datensatz</td></tr>" +
       "<tr><td>Attribut</td><td>Spalte</td><td>Eigenschaft</td></tr>" +
       "<tr><td>Domäne</td><td>Datentyp samt erlaubten Werten</td><td>Wertebereich eines Attributs</td></tr>" +
       "<tr><td>Grad</td><td>Spaltenzahl</td><td>Anzahl der Attribute</td></tr>" +
       "<tr><td>Kardinalität</td><td>Zeilenzahl</td><td>Anzahl der Tupel</td></tr>" +
       "<tr><td>Primärschlüssel</td><td><code>PRIMARY KEY</code></td><td>identifiziert jedes Tupel eindeutig</td></tr>" +
       "<tr><td>Fremdschlüssel</td><td><code>FOREIGN KEY</code></td><td>Verweis auf einen Primärschlüssel</td></tr></table>" +
       "<p>Eigenschaften einer Relation: keine zwei gleichen Zeilen, die Reihenfolge der Zeilen und Spalten ist ohne Bedeutung, jeder Wert ist atomar (nicht weiter teilbar). <b>Entitätsintegrität:</b> Primärschlüssel nie NULL. <b>Referenzielle Integrität:</b> Jeder Fremdschlüsselwert muss es als Primärschlüssel geben (oder NULL sein).</p>"},
    {title: "ER-Modell in Tabellen umwandeln",
     text: "<table class='t'><tr><th>ER-Element</th><th>Tabellenstruktur</th></tr>" +
       "<tr><td>Entitätstyp</td><td>eine Tabelle, Attribute werden Spalten, Schlüsselattribut wird Primärschlüssel</td></tr>" +
       "<tr><td>1:n-Beziehung</td><td>Fremdschlüssel auf der <b>n-Seite</b> (die Tabelle mit den „vielen“)</td></tr>" +
       "<tr><td>n:m-Beziehung</td><td>eigene <b>Zwischentabelle</b> mit den beiden Fremdschlüsseln als zusammengesetztem Primärschlüssel, plus Beziehungsattribute</td></tr>" +
       "<tr><td>1:1-Beziehung</td><td>Fremdschlüssel mit <code>UNIQUE</code> auf einer Seite (oder beide Entitäten in eine Tabelle)</td></tr>" +
       "<tr><td>mehrwertiges Attribut</td><td>eigene Tabelle mit Fremdschlüssel auf die Entität</td></tr>" +
       "<tr><td>abgeleitetes Attribut</td><td>keine Spalte, per Abfrage berechnen</td></tr>" +
       "<tr><td>schwache Entität</td><td>Tabelle, deren Primärschlüssel den Schlüssel der Eigentümer-Entität enthält</td></tr></table>",
     code: ["-- ER aus Kapitel 2 (Kunde 1:n Bestellung n:m Produkt) als Tabellen:\nCREATE TABLE kunde (\n  kunden_id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(80) NOT NULL\n);\nCREATE TABLE produkt (\n  produkt_id INT PRIMARY KEY AUTO_INCREMENT,\n  preis DECIMAL(8,2) NOT NULL\n);\nCREATE TABLE bestellung (\n  bestell_id INT PRIMARY KEY AUTO_INCREMENT,\n  datum DATE NOT NULL,\n  kunden_id INT NOT NULL,                      -- 1:n: FK auf der n-Seite\n  FOREIGN KEY (kunden_id) REFERENCES kunde(kunden_id)\n);\nCREATE TABLE bestellposition (                 -- n:m: Zwischentabelle\n  bestell_id INT NOT NULL,\n  produkt_id INT NOT NULL,\n  menge INT NOT NULL,                          -- Beziehungsattribut\n  PRIMARY KEY (bestell_id, produkt_id),\n  FOREIGN KEY (bestell_id) REFERENCES bestellung(bestell_id),\n  FOREIGN KEY (produkt_id) REFERENCES produkt(produkt_id)\n);"],
     text: "<p>Genau diese Struktur hat die Übungsdatenbank <code>lernshop</code>.</p>"},
    {title: "Normalisierung: Wozu?",
     text: "<p>Eine schlecht gebaute Tabelle führt zu <b>Anomalien</b>. Beispiel: Alles in einer Tabelle <code>bestellung_alles</code> mit Kundenname, Kundenstadt, Produktname, Preis:</p>" +
       "<table class='t'><tr><th>bestell_id</th><th>kunde</th><th>stadt</th><th>produkt</th><th>preis</th></tr>" +
       "<tr><td>1</td><td>Berger</td><td>Berlin</td><td>Notizbuch</td><td>4.50</td></tr>" +
       "<tr><td>1</td><td>Berger</td><td>Berlin</td><td>Kugelschreiber</td><td>1.20</td></tr>" +
       "<tr><td>2</td><td>Berger</td><td>Berlin</td><td>Füller</td><td>24.90</td></tr></table>" +
       "<ul><li><b>Änderungsanomalie:</b> Zieht Berger um, musst du jede Zeile ändern. Vergisst du eine, stimmt die Datenbank nicht mehr.</li>" +
       "<li><b>Einfügeanomalie:</b> Einen neuen Kunden ohne Bestellung kannst du nicht speichern.</li>" +
       "<li><b>Löschanomalie:</b> Wird die letzte Bestellung gelöscht, ist auch der Kunde weg.</li></ul>" +
       "<p>Die Ursache ist <b>Redundanz</b>. Normalisierung zerlegt Tabellen so, dass jede Tatsache nur einmal gespeichert wird. Grundlage ist die <b>funktionale Abhängigkeit</b>: A → B heißt, aus dem Wert von A folgt eindeutig der Wert von B (z. B. <code>kunden_id → stadt</code>).</p>"},
    {title: "Die Normalformen",
     text: "<table class='t'><tr><th>Normalform</th><th>Regel</th><th>Verstoß</th></tr>" +
       "<tr><td><b>1. NF</b></td><td>Alle Werte sind atomar, keine Wiederholungsgruppen.</td><td>Spalte <code>telefon</code> mit „123, 456“; Spalten <code>produkt1</code>, <code>produkt2</code>, …</td></tr>" +
       "<tr><td><b>2. NF</b></td><td>1. NF und jedes Nicht-Schlüsselattribut hängt vom <b>ganzen</b> Schlüssel ab (nur relevant bei zusammengesetztem Schlüssel).</td><td>Schlüssel (bestell_id, produkt_id), aber <code>preis</code> hängt nur von produkt_id ab.</td></tr>" +
       "<tr><td><b>3. NF</b></td><td>2. NF und kein Nicht-Schlüsselattribut hängt von einem anderen Nicht-Schlüsselattribut ab (keine transitive Abhängigkeit).</td><td><code>bestell_id → kunden_id → stadt</code>: Stadt hängt über den Kunden an der Bestellung.</td></tr></table>" +
       "<p>Merksatz: Jedes Nicht-Schlüsselattribut hängt vom Schlüssel ab (1. NF), vom ganzen Schlüssel (2. NF) und von nichts als dem Schlüssel (3. NF). Für die meisten Praxisfälle ist die 3. NF das Ziel. Die <b>Boyce-Codd-Normalform (BCNF)</b> verschärft sie leicht: Jede Determinante muss ein Kandidatenschlüssel sein.</p>",
     tip: "Normalisierung ist kein Dogma. Bei reinen Auswertungsdatenbanken wird manchmal bewusst denormalisiert, um Joins zu sparen. Dann weißt du aber, was du dir einhandelst."},
    {title: "Theorie relationaler Sprachen: Relationale Algebra",
     text: "<p>Die relationale Algebra beschreibt Operationen auf Relationen. Das Ergebnis ist wieder eine Relation. SQL setzt sie in eine praktische Sprache um.</p>" +
       "<table class='t'><tr><th>Operation</th><th>Symbol</th><th>SQL</th></tr>" +
       "<tr><td>Selektion (Zeilen filtern)</td><td>σ<sub>preis&gt;5</sub>(Produkte)</td><td><code>SELECT * FROM produkte WHERE preis &gt; 5</code></td></tr>" +
       "<tr><td>Projektion (Spalten wählen)</td><td>π<sub>name, preis</sub>(Produkte)</td><td><code>SELECT DISTINCT name, preis FROM produkte</code></td></tr>" +
       "<tr><td>Kartesisches Produkt</td><td>A × B</td><td><code>SELECT * FROM a CROSS JOIN b</code></td></tr>" +
       "<tr><td>Verbund (Join)</td><td>A ⋈ B</td><td><code>SELECT * FROM a JOIN b ON …</code></td></tr>" +
       "<tr><td>Vereinigung</td><td>A ∪ B</td><td><code>UNION</code></td></tr>" +
       "<tr><td>Differenz</td><td>A − B</td><td><code>EXCEPT</code> (oder <code>NOT EXISTS</code>)</td></tr>" +
       "<tr><td>Schnitt</td><td>A ∩ B</td><td><code>INTERSECT</code></td></tr>" +
       "<tr><td>Umbenennung</td><td>ρ</td><td><code>AS</code> (Alias)</td></tr></table>" +
       "<p>Der Verbund ist ein kartesisches Produkt mit anschließender Selektion: A ⋈ B = σ<sub>Bedingung</sub>(A × B). Genau das passiert bei der alten Komma-Schreibweise mit <code>WHERE</code>. Ein Unterschied: Die Algebra arbeitet mit <i>Mengen</i> (keine Duplikate), SQL mit <i>Multimengen</i>. Deshalb braucht SQL <code>DISTINCT</code>.</p>" +
       "<p>Daneben gibt es den <b>Relationenkalkül</b>, der beschreibt, <i>was</i> gesucht ist, nicht <i>wie</i>. SQL ist von beiden beeinflusst und deklarativ: Du sagst, was du willst, das DBMS wählt den Weg.</p>"}
  ],
  exercises: [
    {id: "k3-1", title: "ER in Tabellen",
     task: "<p>Setze das Bibliotheks-Modell aus Kapitel 2 um (Verlag 1:n Buch, Mitglied n:m Buch mit Ausleihdatum). Lege die Tabellen <code>verlag</code>, <code>buch</code>, <code>mitglied</code> und <code>ausleihe</code> in der Datenbank <code>uebung</code> an.</p>",
     hints: ["1:n → Fremdschlüssel auf der n-Seite (<code>buch.verlag_id</code>).", "n:m → Zwischentabelle <code>ausleihe</code> mit zusammengesetztem Primärschlüssel. Aber: Kann ein Mitglied dasselbe Buch zweimal ausleihen? Dann gehört das Datum in den Schlüssel."],
     solution: "CREATE DATABASE IF NOT EXISTS uebung;\nUSE uebung;\n\nCREATE TABLE verlag (\n  verlag_id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(80) NOT NULL\n);\nCREATE TABLE buch (\n  isbn CHAR(13) PRIMARY KEY,\n  titel VARCHAR(120) NOT NULL,\n  verlag_id INT NOT NULL,\n  FOREIGN KEY (verlag_id) REFERENCES verlag(verlag_id)\n);\nCREATE TABLE mitglied (\n  mitgliedsnr INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(80) NOT NULL\n);\nCREATE TABLE ausleihe (\n  mitgliedsnr INT NOT NULL,\n  isbn CHAR(13) NOT NULL,\n  ausleihdatum DATE NOT NULL,\n  PRIMARY KEY (mitgliedsnr, isbn, ausleihdatum),\n  FOREIGN KEY (mitgliedsnr) REFERENCES mitglied(mitgliedsnr),\n  FOREIGN KEY (isbn) REFERENCES buch(isbn)\n);\n\nSHOW TABLES;",
     note: "Das Datum im Schlüssel erlaubt, dass ein Mitglied dasselbe Buch später erneut ausleiht."},
    {id: "k3-2", title: "Normalformen erkennen",
     task: "<p>Tabelle <code>rechnung(rechnung_nr, kunde_name, kunde_ort, positionen)</code>, die Spalte <code>positionen</code> enthält z. B. „Stift (2), Heft (5)“. Gegen welche Normalformen wird verstoßen? Erkläre kurz.</p>",
     answer: "<ul><li><b>1. NF verletzt:</b> <code>positionen</code> enthält mehrere Werte in einer Zelle, nicht atomar.</li>" +
       "<li><b>3. NF verletzt:</b> <code>kunde_ort</code> hängt von <code>kunde_name</code> ab (nicht vom Schlüssel <code>rechnung_nr</code>). Transitive Abhängigkeit: rechnung_nr → kunde_name → kunde_ort.</li>" +
       "<li>Die 2. NF ist trivial erfüllt, weil der Schlüssel nur aus einer Spalte besteht.</li></ul>"},
    {id: "k3-3", title: "Normalisieren",
     task: "<p>Gegeben ist diese Tabelle als Tabelle <code>kurs_alt</code>:</p>" +
       "<table class='t'><tr><th>student_id</th><th>student_name</th><th>kurs_id</th><th>kurs_titel</th><th>note</th></tr>" +
       "<tr><td>1</td><td>Lena</td><td>K1</td><td>Datenbanken</td><td>1.7</td></tr>" +
       "<tr><td>1</td><td>Lena</td><td>K2</td><td>Mathematik</td><td>2.3</td></tr>" +
       "<tr><td>2</td><td>Tim</td><td>K1</td><td>Datenbanken</td><td>2.0</td></tr></table>" +
       "<p>Schlüssel ist (student_id, kurs_id). Zerlege sie in die 3. NF, lege die Tabellen in <code>uebung</code> an und fülle sie mit den Beispieldaten. Welche Abhängigkeiten verletzen die 2. NF?</p>",
     hints: ["<code>student_name</code> hängt nur von <code>student_id</code> ab, <code>kurs_titel</code> nur von <code>kurs_id</code>. Nur <code>note</code> hängt vom ganzen Schlüssel ab."],
     solution: "USE uebung;\nCREATE TABLE student (\n  student_id INT PRIMARY KEY,\n  student_name VARCHAR(50) NOT NULL\n);\nCREATE TABLE kurs (\n  kurs_id CHAR(2) PRIMARY KEY,\n  kurs_titel VARCHAR(80) NOT NULL\n);\nCREATE TABLE belegung (\n  student_id INT NOT NULL,\n  kurs_id CHAR(2) NOT NULL,\n  note DECIMAL(2,1),\n  PRIMARY KEY (student_id, kurs_id),\n  FOREIGN KEY (student_id) REFERENCES student(student_id),\n  FOREIGN KEY (kurs_id) REFERENCES kurs(kurs_id)\n);\n\nINSERT INTO student VALUES (1, 'Lena'), (2, 'Tim');\nINSERT INTO kurs VALUES ('K1', 'Datenbanken'), ('K2', 'Mathematik');\nINSERT INTO belegung VALUES (1, 'K1', 1.7), (1, 'K2', 2.3), (2, 'K1', 2.0);\n\n-- Zusammenführen wie die alte Tabelle:\nSELECT s.student_id, s.student_name, k.kurs_id, k.kurs_titel, b.note\nFROM belegung b\nJOIN student s ON s.student_id = b.student_id\nJOIN kurs k    ON k.kurs_id = b.kurs_id;",
     note: "Verstöße gegen die 2. NF: <code>student_id → student_name</code> und <code>kurs_id → kurs_titel</code> (Teilabhängigkeiten vom Schlüssel). Der <code>JOIN</code> am Ende zeigt: Es geht keine Information verloren."},
    {id: "k3-4", title: "Relationale Algebra in SQL",
     task: "<p>Übersetze in SQL (Datenbank <code>lernshop</code>): a) σ<sub>stadt='Berlin'</sub>(kunden) b) π<sub>kategorie</sub>(produkte) c) Kunden ⋈ Bestellungen (nur Nachname und Bestelldatum) d) Menge der Kunden-IDs, die <b>nicht</b> in Bestellungen vorkommen (Differenz).</p>",
     solution: "-- a) Selektion\nSELECT * FROM kunden WHERE stadt = 'Berlin';\n\n-- b) Projektion (Mengensemantik: DISTINCT)\nSELECT DISTINCT kategorie FROM produkte;\n\n-- c) Verbund\nSELECT k.nachname, b.datum\nFROM kunden k\nJOIN bestellungen b ON b.kunden_id = k.kunden_id;\n\n-- d) Differenz\nSELECT kunden_id FROM kunden\nEXCEPT\nSELECT kunden_id FROM bestellungen;"},
    {id: "k3-5", title: "Referenzielle Integrität prüfen",
     task: "<p>Versuche in <code>uebung</code> (nach Aufgabe 3), eine Belegung für <code>student_id</code> 99 einzufügen, den es nicht gibt. Was passiert und welche Regel greift?</p>",
     solution: "USE uebung;\n-- schlägt fehl (ERROR 1452):\nINSERT INTO belegung VALUES (99, 'K1', 1.0);",
     answer: "<p>MariaDB lehnt den Datensatz ab (Fehler 1452, Fremdschlüssel verletzt). Das ist die <b>referenzielle Integrität</b>: Ein Fremdschlüsselwert muss als Primärschlüssel in der Zieltabelle existieren.</p>"}
  ],
  quiz: [
    {id: "q3-1", q: "Wohin kommt der Fremdschlüssel bei einer 1:n-Beziehung (Kunde 1:n Bestellung)?",
     options: ["In die Tabelle Kunde", "In die Tabelle Bestellung (n-Seite)", "In beide Tabellen", "In eine Zwischentabelle"],
     correct: 1, explain: "Der Fremdschlüssel steht auf der n-Seite, also in der Tabelle mit den „vielen“ Zeilen."},
    {id: "q3-2", q: "Wie setzt du eine n:m-Beziehung um?",
     options: ["Eine Spalte mit Kommaliste", "Eine Zwischentabelle mit beiden Fremdschlüsseln", "Gar nicht, das ist in SQL nicht möglich", "Zwei Primärschlüssel in einer Tabelle"],
     correct: 1, explain: "Die Zwischentabelle enthält die Schlüssel beider Seiten, zusammen als Primärschlüssel."},
    {id: "q3-3", q: "Eine Spalte enthält „Lesen, Reiten, Schwimmen“. Welche Normalform wird verletzt?",
     options: ["1. NF", "2. NF", "3. NF", "Keine"],
     correct: 0, explain: "Werte müssen atomar sein. Mehrere Werte in einer Zelle verletzen die 1. NF."},
    {id: "q3-4", q: "In der Tabelle (bestell_id, kunden_id, kunden_ort) hängt kunden_ort von kunden_id ab. Welche Normalform ist verletzt?",
     options: ["1. NF", "2. NF", "3. NF (transitive Abhängigkeit)", "BCNF kann nicht verletzt werden"],
     correct: 2, explain: "Nicht-Schlüsselattribut (kunden_ort) hängt von einem anderen Nicht-Schlüsselattribut (kunden_id) ab: transitive Abhängigkeit, Verstoß gegen die 3. NF."},
    {id: "q3-5", q: "Welche SQL-Anweisung entspricht der Projektion der relationalen Algebra?",
     options: ["WHERE", "Die Spaltenliste hinter SELECT (mit DISTINCT)", "JOIN", "ORDER BY"],
     correct: 1, explain: "Die Projektion wählt Spalten aus. Weil die Algebra Mengen verwendet, entspricht sie <code>SELECT DISTINCT</code>."}
  ]
};
