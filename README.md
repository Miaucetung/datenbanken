# Datenbanken lernen (SQL mit MariaDB)

Praxisorientierte Lernplattform in reinem HTML/CSS/JS, ohne Build und ohne Server.
Du übst im lokalen MariaDB, die Seite liefert Lektionen, Aufgaben, Lösungen und einen Spickzettel.

## Benutzen
- `index.html` im Browser öffnen (Doppelklick genügt), oder über GitHub Pages.
- Übungsdatenbank laden (ab Kapitel 6/7): `mariadb -u root -p < sql/lernshop.sql` (setzt alles zurück).
- Fortschritt (Häkchen bei Aufgaben) wird im Browser gespeichert.

## Stand
Fertig: Kapitel 4 bis 16 (SQL-Grundlagen, Abfragen, Joins, Sichten, Cursor, Rechte, Transaktionen, Stored Procedures, Trigger) und Spickzettel.
Alle Lösungen sind gegen MariaDB 10.11 getestet. Geplant: die Theoriekapitel 1 bis 3 (Grundlagen, Datenbankentwurf, relationales Modell).

## Struktur
- `data/chapters.js` Kapitelliste, `data/lessons-XX.js` eine Lektion je Kapitel, `data/cheatsheet.js`
- `sql/` Setup-Skripte, `js/app.js` und `css/style.css` die Oberfläche

Die Inhalte sind eigene Erklärungen und Beispiele, kein Buchtext.
