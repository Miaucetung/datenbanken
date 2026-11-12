# Datenbanken lernen (SQL mit MariaDB)

Praxisorientierte Lernplattform in reinem HTML/CSS/JS, ohne Build und ohne Server.
Du übst im lokalen MariaDB, die Seite liefert Lektionen, Aufgaben, Lösungen und einen Spickzettel.

## Online (GitHub Pages)
Nach dem Aktivieren erreichbar unter: https://miaucetung.github.io/datenbanken/

## Betrieb im k3s-Cluster (Cloudflare Tunnel)
```bash
kubectl kustomize deploy/ | head -40     # Vorschau, ändert nichts
kubectl apply -k deploy/
kubectl -n datenbanken get pods          # Pod muss 2/2 Running sein
```
Ein Init-Container klont das (öffentliche) Repo, ein Sidecar holt alle 5 Minuten Änderungen per `git pull`.
Im Cloudflare Tunnel die Route `datenbanken.ajti.online` auf den Service `http://datenbanken.datenbanken.svc.cluster.local:80` setzen,
dazu Cloudflare Access auf die eigene E-Mail-Adresse. Nach einer Änderung an `deploy/nginx.conf` erneut `kubectl apply -k deploy/` ausführen.

## Betrieb mit Docker Compose (lokal oder einfacher Server)
```bash
git clone https://github.com/Miaucetung/datenbanken.git && cd datenbanken
docker compose up -d      # Nginx auf 127.0.0.1:8080, nur lesender Zugriff auf die Dateien
```
Im Cloudflare Tunnel eine *Published application* anlegen: Hostname `datenbanken.ajti.online`, Service `http://localhost:8080`.
Zugriff mit Cloudflare Access auf die eigene E-Mail-Adresse beschränken. Aktualisieren mit `git pull`.
`deploy/nginx.conf` liefert nur die Plattformdateien aus und setzt die Sicherheits-Header (entspricht `_headers`, die nur bei Cloudflare Pages gilt).

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
