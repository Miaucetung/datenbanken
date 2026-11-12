window.LESSONS[4] = {
  intro: "SQL ist die Sprache, mit der du Datenbanken anlegst, befüllst und abfragst. Hier lernst du, Datenbanken zu erstellen, anzuzeigen, auszuwählen und zu löschen.",
  setup: "Öffne den Client mit <code>mariadb -u root -p</code>. Jeder Befehl endet mit einem Semikolon.",
  sections: [
    {title: "Was ist SQL?",
     text: "<p>SQL (Structured Query Language) ist standardisiert, aber jedes System hat eigene Erweiterungen. Die Befehle lassen sich in Gruppen einteilen:</p>" +
       "<table class='t'><tr><th>Gruppe</th><th>Zweck</th><th>Befehle</th></tr>" +
       "<tr><td>DDL</td><td>Struktur definieren</td><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code></td></tr>" +
       "<tr><td>DML</td><td>Daten bearbeiten</td><td><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td></tr>" +
       "<tr><td>DQL</td><td>Daten abfragen</td><td><code>SELECT</code></td></tr>" +
       "<tr><td>DCL</td><td>Rechte verwalten</td><td><code>GRANT</code>, <code>REVOKE</code></td></tr>" +
       "<tr><td>TCL</td><td>Transaktionen</td><td><code>COMMIT</code>, <code>ROLLBACK</code></td></tr></table>" +
       "<p>Schlüsselwörter sind nicht case-sensitiv. Üblich ist, sie großzuschreiben. Namen von Datenbanken und Tabellen können je nach Betriebssystem unterscheiden (unter Linux ja, unter Windows nein). Schreibe sie deshalb immer klein."},
    {title: "Datenbank erstellen",
     code: ["CREATE DATABASE schule;\n\n-- nur anlegen, wenn sie noch nicht existiert:\nCREATE DATABASE IF NOT EXISTS schule;\n\n-- mit Zeichensatz (empfohlen, damit Umlaute und Emojis funktionieren):\nCREATE DATABASE schule CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"],
     tip: "Ohne <code>IF NOT EXISTS</code> gibt es einen Fehler, wenn die Datenbank schon da ist. In Skripten, die du mehrfach ausführst, ist die Variante mit <code>IF NOT EXISTS</code> bequemer."},
    {title: "Datenbanken anzeigen und auswählen",
     code: ["SHOW DATABASES;          -- alle Datenbanken auflisten\nUSE schule;               -- diese Datenbank aktiv schalten\nSELECT DATABASE();        -- welche ist gerade aktiv?"],
     text: "<p>Nach <code>USE</code> beziehen sich alle Befehle auf diese Datenbank. Ohne <code>USE</code> musst du Tabellen mit Datenbanknamen ansprechen, z. B. <code>schule.klassen</code>.</p>"},
    {title: "Datenbank löschen",
     code: ["DROP DATABASE schule;\nDROP DATABASE IF EXISTS schule;"],
     warn: "<code>DROP DATABASE</code> löscht die Datenbank mit allen Tabellen und Daten sofort und ohne Rückfrage. Es gibt kein Rückgängig."}
  ],
  exercises: [
    {id: "k4-1", title: "Datenbank anlegen und auswählen",
     task: "<p>Lege eine Datenbank <code>bibliothek</code> mit dem Zeichensatz <code>utf8mb4</code> an, ohne dass ein Fehler auftritt, falls sie schon existiert. Wähle sie danach aus und prüfe mit einem Befehl, dass sie aktiv ist.</p>",
     hints: ["Für die Fehlervermeidung gibt es eine Klausel mit <code>IF NOT EXISTS</code>.", "Die aktive Datenbank liefert die Funktion <code>DATABASE()</code>."],
     solution: "CREATE DATABASE IF NOT EXISTS bibliothek CHARACTER SET utf8mb4;\nUSE bibliothek;\nSELECT DATABASE();"},
    {id: "k4-2", title: "Übersicht verschaffen",
     task: "<p>Zeige alle Datenbanken an. Welche Datenbanken hat MariaDB schon von Haus aus, ohne dass du sie angelegt hast?</p>",
     solution: "SHOW DATABASES;",
     note: "Du siehst unter anderem <code>information_schema</code>, <code>mysql</code> und <code>performance_schema</code>. Das sind Systemdatenbanken, die du nicht verändern solltest."},
    {id: "k4-3", title: "Aufräumen",
     task: "<p>Lösche die Datenbank <code>bibliothek</code> wieder, sodass auch kein Fehler entsteht, wenn sie nicht existiert. Prüfe danach mit <code>SHOW DATABASES;</code>.</p>",
     solution: "DROP DATABASE IF EXISTS bibliothek;\nSHOW DATABASES;"}
  ]
};
