# Datenbanken lernen (SQL mit MariaDB)

Praxisorientierte Lernplattform in reinem HTML/CSS/JS, ohne Build und ohne Server.
Du übst im lokalen MariaDB, die Seite liefert Lektionen, Aufgaben, Lösungen und einen Spickzettel.

## Benutzen
- `index.html` im Browser öffnen (Doppelklick genügt), oder über GitHub Pages.
- Übungsdatenbank laden (ab Kapitel 6/7): `mariadb -u root -p < sql/lernshop.sql` (setzt alles zurück).
- Fortschritt (Häkchen bei Aufgaben) wird im Browser gespeichert.

## Stand
Fertig: alle 16 Kapitel (Theorie: Grundlagen, Datenbankentwurf, relationales Modell; Praxis: SQL von Datenbank bis Trigger) mit Übungen, Kurzquiz in den Theoriekapiteln und Spickzettel.
Alle SQL-Lösungen sind gegen MariaDB 10.11 getestet. 
## Struktur
- `data/chapters.js` Kapitelliste, `data/lessons-XX.js` eine Lektion je Kapitel, `data/cheatsheet.js`
- `sql/` Setup-Skripte, `js/app.js` und `css/style.css` die Oberfläche

Die Inhalte sind eigene Erklärungen und Beispiele, kein Buchtext.
