window.LESSONS[13] = {
  intro: "Nicht jeder soll alles dürfen. Du legst Benutzer an, vergibst ihnen genau die nötigen Rechte und nimmst sie bei Bedarf wieder weg.",
  setup: "Du brauchst einen Account mit Verwaltungsrechten (meist <code>root</code>). Das Buch behandelt auch PostgreSQL. Hier geht es um MariaDB, die Konzepte sind aber ähnlich. Lade <code>source sql/lernshop.sql;</code>.",
  sections: [
    {title: "Sicherheitskonzept",
     text: "<ul><li><b>Authentifizierung:</b> Wer bist du? (Benutzername, Passwort, Host)</li><li><b>Autorisierung:</b> Was darfst du? (Rechte auf Datenbank, Tabelle, Spalte)</li>" +
       "<li><b>Prinzip der minimalen Rechte:</b> Jeder bekommt nur, was er braucht.</li></ul>" +
       "<p>Ein MariaDB-Benutzer besteht aus Name <i>und</i> Host: <code>'anna'@'localhost'</code> und <code>'anna'@'%'</code> sind zwei verschiedene Benutzer. <code>localhost</code> heißt nur vom selben Rechner, <code>%</code> von überall.</p>"},
    {title: "Benutzer verwalten",
     code: ["CREATE USER 'anna'@'localhost' IDENTIFIED BY 'geheim123';\nCREATE USER IF NOT EXISTS 'ben'@'localhost' IDENTIFIED BY 'geheim456';\n\nALTER USER 'anna'@'localhost' IDENTIFIED BY 'neuesPasswort';\nRENAME USER 'ben'@'localhost' TO 'benjamin'@'localhost';\n\nSELECT user, host FROM mysql.user;    -- alle Benutzer\nSELECT CURRENT_USER();                 -- wer bin ich?\n\nDROP USER 'benjamin'@'localhost';\nDROP USER IF EXISTS 'anna'@'localhost';"],
     warn: "Verwende für Übungen wertlose Passwörter, nie dein echtes. Das Passwort steht im Klartext in deiner Eingabe (und eventuell in der Client-History)."},
    {title: "Rechte vergeben (GRANT)",
     code: ["-- Nur lesen auf einer Tabelle:\nGRANT SELECT ON lernshop.produkte TO 'anna'@'localhost';\n\n-- Lesen und schreiben auf der ganzen Datenbank:\nGRANT SELECT, INSERT, UPDATE, DELETE ON lernshop.* TO 'anna'@'localhost';\n\n-- nur bestimmte Spalten:\nGRANT SELECT (vorname, nachname), UPDATE (stadt) ON lernshop.kunden TO 'anna'@'localhost';\n\n-- alles (Vorsicht!), und Rechte weitergeben dürfen:\nGRANT ALL PRIVILEGES ON lernshop.* TO 'chef'@'localhost' WITH GRANT OPTION;\n\nSHOW GRANTS FOR 'anna'@'localhost';"],
     text: "<table class='t'><tr><th>Ebene</th><th>Schreibweise</th></tr><tr><td>global</td><td><code>*.*</code></td></tr><tr><td>Datenbank</td><td><code>lernshop.*</code></td></tr><tr><td>Tabelle</td><td><code>lernshop.produkte</code></td></tr><tr><td>Spalte</td><td><code>SELECT (spalte) ON lernshop.tabelle</code></td></tr></table>"},
    {title: "Rechte entziehen (REVOKE)",
     code: ["REVOKE DELETE ON lernshop.* FROM 'anna'@'localhost';\nREVOKE ALL PRIVILEGES, GRANT OPTION FROM 'anna'@'localhost';\nFLUSH PRIVILEGES;    -- nur nötig, wenn du die mysql-Tabellen direkt änderst"],
     text: "<p>Mit <code>REVOKE</code> nimmst du genau die Rechte weg, die du nennst. Der Benutzer selbst bleibt bestehen. Neue Rechte gelten meist ab der nächsten Verbindung des Benutzers.</p>"},
    {title: "Rollen",
     code: ["CREATE ROLE leser;\nGRANT SELECT ON lernshop.* TO leser;\nGRANT leser TO 'anna'@'localhost';\nSET DEFAULT ROLE leser FOR 'anna'@'localhost';"],
     tip: "Rollen sparen Arbeit, wenn viele Benutzer dieselben Rechte brauchen: Rechte einmal an die Rolle, Rolle an alle."}
  ],
  exercises: [
    {id: "k13-1", title: "Leser anlegen",
     task: "<p>Lege den Benutzer <code>leser1</code> (nur von <code>localhost</code>, Passwort <code>uebung1</code>) an. Er soll in <code>lernshop</code> alle Tabellen lesen, aber nichts ändern dürfen. Zeige seine Rechte.</p>",
     solution: "CREATE USER 'leser1'@'localhost' IDENTIFIED BY 'uebung1';\nGRANT SELECT ON lernshop.* TO 'leser1'@'localhost';\nSHOW GRANTS FOR 'leser1'@'localhost';"},
    {id: "k13-2", title: "Rechte erweitern und einschränken",
     task: "<p><i>(Baut auf Aufgabe 1 auf: <code>leser1</code> muss existieren.)</i> Gib <code>leser1</code> zusätzlich das Recht, in <code>produkte</code> den <code>lagerbestand</code> zu ändern (nur diese Spalte). Entziehe ihm danach das Leserecht auf die Tabelle <code>kunden</code>, indem du das Recht auf der Datenbankebene wegnimmst und auf <code>produkte</code>, <code>bestellungen</code> und <code>bestellpositionen</code> einzeln neu vergibst.</p>",
     hints: ["Wenn ein Recht auf <code>lernshop.*</code> vergeben wurde, kannst du es nicht für eine einzelne Tabelle wegnehmen. Erst auf Datenbankebene zurücknehmen, dann einzeln vergeben."],
     solution: "GRANT UPDATE (lagerbestand) ON lernshop.produkte TO 'leser1'@'localhost';\n\nREVOKE SELECT ON lernshop.* FROM 'leser1'@'localhost';\nGRANT SELECT ON lernshop.produkte TO 'leser1'@'localhost';\nGRANT SELECT ON lernshop.bestellungen TO 'leser1'@'localhost';\nGRANT SELECT ON lernshop.bestellpositionen TO 'leser1'@'localhost';\n\nSHOW GRANTS FOR 'leser1'@'localhost';"},
    {id: "k13-3", title: "Rolle verwenden",
     task: "<p><i>(Benutzer <code>leser1</code> aus Aufgabe 1 wird vorausgesetzt.)</i> Lege eine Rolle <code>mitarbeiter_rolle</code> mit <code>SELECT, INSERT, UPDATE</code> auf <code>lernshop.*</code> an und weise sie dem Benutzer <code>leser1</code> zu.</p>",
     solution: "CREATE ROLE mitarbeiter_rolle;\nGRANT SELECT, INSERT, UPDATE ON lernshop.* TO mitarbeiter_rolle;\nGRANT mitarbeiter_rolle TO 'leser1'@'localhost';\nSHOW GRANTS FOR 'leser1'@'localhost';"},
    {id: "k13-4", title: "Aufräumen",
     task: "<p>Entferne den Benutzer <code>leser1</code> und die Rolle <code>mitarbeiter_rolle</code> wieder. Prüfe mit einer Abfrage auf <code>mysql.user</code>, dass <code>leser1</code> weg ist.</p>",
     solution: "DROP USER IF EXISTS 'leser1'@'localhost';\nDROP ROLE IF EXISTS mitarbeiter_rolle;\nSELECT user, host FROM mysql.user WHERE user = 'leser1';"}
  ]
};
