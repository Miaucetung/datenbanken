window.LESSONS[1] = {
  intro: "Bevor du SQL schreibst, solltest du wissen, was eine Datenbank ist, welche Arten es gibt und wie ein Datenbanksystem intern aufgebaut ist. Viele Fragen kannst du direkt in deinem MariaDB nachschauen.",
  setup: "Öffne den Client: <code>mariadb -u root -p</code>. Die Abfragen in den Übungen brauchen keine Übungsdatenbank.",
  sections: [
    {title: "Entwicklung der Datenbanken",
     text: "<table class='t'><tr><th>Zeit</th><th>Entwicklung</th><th>Kernidee</th></tr>" +
       "<tr><td>bis ca. 1960</td><td>Dateisysteme</td><td>Jede Anwendung verwaltet ihre eigenen Dateien. Daten sind doppelt vorhanden und widersprechen sich leicht.</td></tr>" +
       "<tr><td>1960er</td><td>Hierarchische und Netzwerk-Datenbanken</td><td>Daten in Bäumen oder Graphen, Zugriff über feste Pfade.</td></tr>" +
       "<tr><td>1970</td><td>Relationales Modell (E. F. Codd)</td><td>Daten in Tabellen, Zugriff über Inhalte statt über Pfade.</td></tr>" +
       "<tr><td>1980er</td><td>SQL wird Standard</td><td>Eine gemeinsame Abfragesprache für verschiedene Systeme.</td></tr>" +
       "<tr><td>1990er</td><td>Objektorientierte und objekt-relationale Systeme</td><td>Komplexe Objekte direkt speichern.</td></tr>" +
       "<tr><td>seit ca. 2005</td><td>NoSQL und NewSQL</td><td>Sehr große, verteilte Datenmengen, flexible Strukturen.</td></tr></table>" +
       "<p>Die Probleme der Dateiverwaltung sind der Grund für Datenbanken: <b>Redundanz</b> (doppelte Daten), <b>Inkonsistenz</b> (widersprüchliche Daten), fehlender <b>Mehrbenutzerschutz</b> und fehlende <b>Datenunabhängigkeit</b> (ändert sich das Dateiformat, müssen alle Programme angepasst werden).</p>"},
    {title: "Datenbankmodelle",
     text: "<table class='t'><tr><th>Modell</th><th>Struktur</th><th>Beispiele</th></tr>" +
       "<tr><td>Hierarchisch</td><td>Baum, jeder Datensatz hat genau einen Vorgänger</td><td>IMS, Verzeichnisdienste</td></tr>" +
       "<tr><td>Netzwerk</td><td>Graph, mehrere Vorgänger möglich</td><td>CODASYL-Systeme</td></tr>" +
       "<tr><td><b>Relational</b></td><td>Tabellen mit Zeilen und Spalten, verknüpft über Schlüssel</td><td>MariaDB, MySQL, PostgreSQL, Oracle</td></tr>" +
       "<tr><td>Objektorientiert</td><td>Objekte mit Eigenschaften und Methoden</td><td>ObjectDB</td></tr>" +
       "<tr><td>Dokument</td><td>JSON-ähnliche Dokumente</td><td>MongoDB</td></tr>" +
       "<tr><td>Key-Value</td><td>Schlüssel → Wert</td><td>Redis</td></tr>" +
       "<tr><td>Graph</td><td>Knoten und Kanten</td><td>Neo4j</td></tr></table>" +
       "<p>Dieser Kurs behandelt das <b>relationale Modell</b>. Es ist am weitesten verbreitet und das Fundament von SQL.</p>"},
    {title: "Aufbau und Organisation einer Datenbank",
     text: "<p>Die Begriffe sauber trennen:</p><ul>" +
       "<li><b>Datenbank (DB):</b> die gespeicherten, zusammengehörigen Daten.</li>" +
       "<li><b>Datenbankmanagementsystem (DBMS):</b> die Software, die sie verwaltet (z. B. MariaDB).</li>" +
       "<li><b>Datenbanksystem (DBS):</b> DB und DBMS zusammen.</li></ul>" +
       "<p>Innerhalb einer Datenbank: Tabellen bestehen aus <b>Spalten</b> (Attribute, Felder) und <b>Zeilen</b> (Datensätze, Tupel). Die Beschreibung der Struktur heißt <b>Schema</b>. Daten über Daten (Tabellennamen, Spaltentypen) heißen <b>Metadaten</b> und liegen im Data Dictionary. In MariaDB ist das die Datenbank <code>information_schema</code>.</p>" +
       "<h3>Drei-Ebenen-Architektur</h3>" +
       "<table class='t'><tr><th>Ebene</th><th>Sicht</th><th>Beispiel in MariaDB</th></tr>" +
       "<tr><td>Extern</td><td>Was ein Benutzer oder eine Anwendung sieht</td><td>Sichten (Views), Rechte</td></tr>" +
       "<tr><td>Konzeptionell</td><td>Logische Gesamtstruktur</td><td>Tabellen, Schlüssel, Constraints</td></tr>" +
       "<tr><td>Intern</td><td>Wie die Daten gespeichert werden</td><td>Storage Engine, Dateien, Indizes</td></tr></table>" +
       "<p>Daraus folgt die <b>Datenunabhängigkeit</b>: Ein Index oder ein anderes Speicherformat (intern) ändert nichts an deinen Abfragen. Eine neue Spalte (konzeptionell) lässt sich oft vor Anwendungen verstecken, indem du eine Sicht verwendest.</p>" +
       "<h3>Aufgaben eines DBMS</h3><ul><li>Daten speichern und abfragen</li><li>Integrität sichern (Regeln, Schlüssel)</li><li>Mehrbenutzerbetrieb und Transaktionen</li><li>Zugriffsschutz und Datensicherung</li></ul>",
     code: ["SHOW DATABASES;\nSELECT table_schema, COUNT(*) AS tabellen\nFROM information_schema.tables\nGROUP BY table_schema;"]},
    {title: "Physische Datenbankarchitektur",
     text: "<p>Die Daten liegen in Dateien auf der Festplatte. Das DBMS lädt Teile davon in den Arbeitsspeicher.</p>" +
       "<ul><li><b>Seiten (Pages):</b> Die kleinste Einheit, die das DBMS liest und schreibt. Bei InnoDB standardmäßig 16 KB. Viele Zeilen passen auf eine Seite.</li>" +
       "<li><b>Pufferspeicher (Buffer Pool):</b> Zwischenspeicher im RAM für häufig gebrauchte Seiten. Er macht den größten Unterschied bei der Geschwindigkeit.</li>" +
       "<li><b>Indexstrukturen:</b> Meist B-Bäume. Sie finden Werte in wenigen Schritten, ohne die ganze Tabelle zu lesen.</li>" +
       "<li><b>Transaktionslog (Redo-Log):</b> Änderungen werden zuerst ins Log geschrieben. Nach einem Absturz stellt das DBMS daraus den letzten konsistenten Stand wieder her (das ist das D in ACID).</li>" +
       "<li><b>Storage Engine:</b> Der Teil von MariaDB, der das Speichern übernimmt. Verschiedene Engines haben verschiedene Eigenschaften.</li></ul>" +
       "<table class='t'><tr><th>Engine</th><th>Eigenschaften</th></tr><tr><td>InnoDB</td><td>Standard. Transaktionen, Fremdschlüssel, Zeilensperren.</td></tr>" +
       "<tr><td>Aria</td><td>Nachfolger von MyISAM, absturzsicher, keine echten Transaktionen. Wird für interne Tabellen verwendet.</td></tr>" +
       "<tr><td>MEMORY</td><td>Daten nur im RAM, sehr schnell, nach Neustart leer.</td></tr></table>",
     code: ["SHOW ENGINES;\nSELECT @@datadir;                       -- wo liegen die Dateien?\nSELECT @@innodb_page_size;              -- Seitengröße in Byte\nSELECT @@innodb_buffer_pool_size / 1024 / 1024 AS buffer_pool_mb;"]}
  ],
  exercises: [
    {id: "k1-1", title: "Systemdatenbanken erkunden",
     task: "<p>Zähle für jede Datenbank deines Servers die Tabellen (<code>information_schema.tables</code>). Welche Datenbank enthält die Metadaten über alle anderen?</p>",
     solution: "SELECT table_schema, COUNT(*) AS tabellen\nFROM information_schema.tables\nGROUP BY table_schema\nORDER BY tabellen DESC;",
     answer: "<p>Die Metadaten stehen in <code>information_schema</code>. Sie ist eine virtuelle Datenbank, das DBMS erzeugt ihren Inhalt aus dem Data Dictionary.</p>"},
    {id: "k1-2", title: "Speicher-Engine einer Tabelle",
     task: "<p>Lege in <code>uebung</code> eine Tabelle <code>engine_test</code> mit einer Spalte an. Finde mit <code>information_schema.tables</code> heraus, welche Storage Engine sie benutzt. Lege dann eine zweite Tabelle explizit mit <code>ENGINE=MEMORY</code> an und vergleiche.</p>",
     solution: "CREATE DATABASE IF NOT EXISTS uebung;\nUSE uebung;\nCREATE TABLE engine_test (id INT);\nCREATE TABLE ram_test (id INT) ENGINE=MEMORY;\nSELECT table_name, engine\nFROM information_schema.tables\nWHERE table_schema = 'uebung' AND table_name IN ('engine_test', 'ram_test');",
     note: "<code>engine_test</code> benutzt InnoDB (Standard), <code>ram_test</code> MEMORY. Nach einem Neustart des Servers wäre <code>ram_test</code> leer."},
    {id: "k1-3", title: "Seitengröße und Zeilen pro Seite",
     task: "<p>Lies die InnoDB-Seitengröße und den Buffer-Pool aus. Schätze, wie viele Zeilen von je 100 Byte etwa auf eine Seite passen (ohne Verwaltungsaufwand).</p>",
     solution: "SELECT @@innodb_page_size AS seitengroesse_byte,\n       @@innodb_page_size DIV 100 AS zeilen_pro_seite,\n       @@innodb_buffer_pool_size DIV 1024 DIV 1024 AS buffer_pool_mb;",
     note: "Bei 16 384 Byte sind es rund 160 Zeilen. In der Praxis weniger, weil jede Seite Verwaltungsdaten enthält."},
    {id: "k1-4", title: "Drei Ebenen zuordnen",
     task: "<p>Ordne diese Dinge einer der drei Ebenen (extern, konzeptionell, intern) zu: a) eine Sicht <code>v_kunden_oeffentlich</code>, b) der Index <code>idx_stadt</code>, c) die Tabelle <code>kunden</code> mit ihren Constraints, d) das <code>GRANT SELECT</code> für einen Benutzer, e) die Storage Engine InnoDB.</p>",
     answer: "<ul><li>a) extern (Sicht für Benutzer)</li><li>b) intern (Speicherstruktur, ändert die Abfrage nicht)</li><li>c) konzeptionell (logische Struktur)</li><li>d) extern (bestimmt, was jemand sehen darf)</li><li>e) intern (Speichertechnik)</li></ul>"}
  ],
  quiz: [
    {id: "q1-1", q: "Welches Problem der Dateiverwaltung löst eine Datenbank hauptsächlich?",
     options: ["Dateien lassen sich nicht drucken", "Doppelte und widersprüchliche Daten (Redundanz, Inkonsistenz)", "Dateien sind immer zu klein", "Dateien können keine Zahlen speichern"],
     correct: 1, explain: "Wenn jede Anwendung eigene Dateien führt, entstehen Duplikate, die auseinanderlaufen. Eine zentrale Datenbank speichert Fakten einmal."},
    {id: "q1-2", q: "Was ist ein DBMS?",
     options: ["Die gespeicherten Daten selbst", "Die Software, die Datenbanken verwaltet", "Eine einzelne Tabelle", "Eine Abfrage"],
     correct: 1, explain: "Das DBMS (z. B. MariaDB) verwaltet die Datenbank. Datenbank und DBMS zusammen heißen Datenbanksystem."},
    {id: "q1-3", q: "Du legst einen Index an und alle Abfragen laufen unverändert weiter. Welches Prinzip zeigt das?",
     options: ["Normalisierung", "Datenunabhängigkeit", "Redundanz", "Kardinalität"],
     correct: 1, explain: "Die interne Ebene (Index) lässt sich ändern, ohne dass die darüberliegenden Ebenen angepasst werden müssen."},
    {id: "q1-4", q: "Welche Storage Engine ist in MariaDB der Standard und unterstützt Transaktionen?",
     options: ["MEMORY", "CSV", "InnoDB", "Aria"],
     correct: 2, explain: "InnoDB unterstützt Transaktionen, Fremdschlüssel und Zeilensperren."}
  ]
};
