# Datenbanken lernen (SQL mit MariaDB)

Praxisorientierte Lernplattform in reinem HTML/CSS/JS, ohne Build und ohne Server.
Du übst im lokalen MariaDB, die Seite liefert Lektionen, Aufgaben, Lösungen und einen Spickzettel.

## Online (GitHub Pages)
Nach dem Aktivieren erreichbar unter: https://miaucetung.github.io/datenbanken/

## Benutzen
- `index.html` im Browser öffnen (Doppelklick genügt), oder über GitHub Pages.
- Übungsdatenbank laden (ab Kapitel 6/7): `mariadb -u root -p < sql/lernshop.sql` (setzt alles zurück).
- Abschlussprojekt (Kapitel 17): Testdaten mit `source sql/fahrradverleih_daten.sql;` laden, nachdem du die Tabellen angelegt hast.
- Fortschritt (Häkchen bei Aufgaben) wird im Browser gespeichert.

## Stand
Fertig: alle 16 Kapitel plus Kapitel 17 (Abschlussprojekt „Fahrradverleih“ mit 12 aufeinander aufbauenden Aufgaben) (Theorie: Grundlagen, Datenbankentwurf, relationales Modell; Praxis: SQL von Datenbank bis Trigger) mit Übungen, Kurzquiz in den Theoriekapiteln und Spickzettel.
Alle SQL-Lösungen sind gegen MariaDB 10.11 getestet.

## Struktur
- `data/chapters.js` Kapitelliste, `data/lessons-XX.js` eine Lektion je Kapitel, `data/cheatsheet.js`
- `sql/` Setup-Skripte, `js/app.js` und `css/style.css` die Oberfläche

Die Inhalte sind eigene Erklärungen und Beispiele, kein Buchtext.
