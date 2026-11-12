window.LESSONS[11] = {
  intro: "Eine Sicht (View) ist eine gespeicherte Abfrage, die sich wie eine Tabelle benutzen lässt. Sie speichert keine eigenen Daten, sondern führt bei jedem Zugriff die Abfrage aus.",
  setup: "Lade die Übungsdatenbank neu: <code>source sql/lernshop.sql;</code> und <code>USE lernshop;</code>.",
  sections: [
    {title: "Wozu Sichten?",
     text: "<ul><li><b>Vereinfachen:</b> komplizierte Joins einmal schreiben, danach wie eine Tabelle abfragen.</li>" +
       "<li><b>Schützen:</b> Nutzern nur bestimmte Spalten oder Zeilen zeigen (z. B. ohne E-Mail).</li>" +
       "<li><b>Stabil bleiben:</b> Die Sicht kann gleich bleiben, auch wenn sich die Tabellenstruktur dahinter ändert.</li></ul>"},
    {title: "Sichten erstellen",
     code: ["CREATE VIEW v_kunden_bestellungen AS\nSELECT k.kunden_id, k.vorname, k.nachname, b.bestell_id, b.datum, b.status\nFROM kunden k\nJOIN bestellungen b ON b.kunden_id = k.kunden_id;\n\n-- benutzen wie eine Tabelle:\nSELECT * FROM v_kunden_bestellungen WHERE status = 'offen';\n\n-- ersetzen oder ändern:\nCREATE OR REPLACE VIEW v_kunden_bestellungen AS\nSELECT k.kunden_id, k.nachname, b.bestell_id, b.datum\nFROM kunden k JOIN bestellungen b ON b.kunden_id = k.kunden_id;\n\nSHOW FULL TABLES WHERE Table_type = 'VIEW';   -- alle Sichten\nSHOW CREATE VIEW v_kunden_bestellungen;"],
     tip: "Beginne den Namen mit <code>v_</code>, dann erkennst du Sichten sofort in der Tabellenliste."},
    {title: "Sichten löschen",
     code: ["DROP VIEW v_kunden_bestellungen;\nDROP VIEW IF EXISTS v_kunden_bestellungen;"],
     text: "<p>Das löscht nur die gespeicherte Abfrage, nicht die Daten der Tabellen dahinter.</p>"},
    {title: "Daten über Sichten ändern",
     text: "<p>Eine Sicht ist änderbar, wenn jede Zeile eindeutig einer Zeile einer Tabelle entspricht. Das gilt nicht bei <code>DISTINCT</code>, <code>GROUP BY</code>, Aggregatfunktionen, <code>UNION</code> und meist nicht bei Joins.</p>",
     code: ["CREATE VIEW v_berliner AS\nSELECT kunden_id, vorname, nachname, stadt, registriert\nFROM kunden\nWHERE stadt = 'Berlin'\nWITH CHECK OPTION;\n\nUPDATE v_berliner SET nachname = 'Berger-Meier' WHERE kunden_id = 1;   -- geht\nINSERT INTO v_berliner (vorname, nachname, stadt, registriert)\nVALUES ('Zoe', 'Test', 'Berlin', '2024-10-01');                         -- geht\nINSERT INTO v_berliner (vorname, nachname, stadt, registriert)\nVALUES ('Max', 'Test', 'Bonn', '2024-10-01');                           -- Fehler!"],
     text: "<p><code>WITH CHECK OPTION</code> sorgt dafür, dass über die Sicht nur Zeilen entstehen, die die Sicht selbst auch sehen würde. Fehlen Pflichtspalten in der Sicht (hier z. B. wäre <code>vorname</code> Pflicht), scheitert das Einfügen.</p>"}
  ],
  exercises: [
    {id: "k11-1", title: "Sicht für Lagerbestand",
     task: "<p>Erstelle eine Sicht <code>v_knapp</code> mit Name und Lagerbestand aller Produkte mit weniger als 20 Stück im Lager. Frage sie danach ab.</p>",
     solution: "CREATE VIEW v_knapp AS\nSELECT name, lagerbestand FROM produkte WHERE lagerbestand < 20;\n\nSELECT * FROM v_knapp;"},
    {id: "k11-2", title: "Umsatzsicht",
     task: "<p>Erstelle eine Sicht <code>v_umsatz_kunde</code> mit Kunden-ID, Nachname und Gesamtumsatz (Menge × Preis) je Kunde. Zeige mit einer Abfrage auf die Sicht die Kunden mit mehr als 50 € Umsatz.</p>",
     solution: "CREATE VIEW v_umsatz_kunde AS\nSELECT k.kunden_id, k.nachname, SUM(bp.menge * p.preis) AS umsatz\nFROM kunden k\nJOIN bestellungen b       ON b.kunden_id = k.kunden_id\nJOIN bestellpositionen bp ON bp.bestell_id = b.bestell_id\nJOIN produkte p           ON p.produkt_id = bp.produkt_id\nGROUP BY k.kunden_id, k.nachname;\n\nSELECT * FROM v_umsatz_kunde WHERE umsatz > 50;"},
    {id: "k11-3", title: "Datenschutz-Sicht",
     task: "<p>Erstelle <code>v_kunden_oeffentlich</code> mit allen Kundenspalten außer <code>email</code>. Ändere dann über die Sicht die Stadt von Kunde 5 auf ‚Bonn‘ und prüfe die Änderung in der Tabelle <code>kunden</code>.</p>",
     solution: "CREATE VIEW v_kunden_oeffentlich AS\nSELECT kunden_id, vorname, nachname, stadt, registriert FROM kunden;\n\nUPDATE v_kunden_oeffentlich SET stadt = 'Bonn' WHERE kunden_id = 5;\nSELECT kunden_id, stadt FROM kunden WHERE kunden_id = 5;"},
    {id: "k11-4", title: "WITH CHECK OPTION ausprobieren",
     task: "<p>Erstelle <code>v_moebel</code> für alle Produkte der Kategorie ‚Möbel‘ mit <code>WITH CHECK OPTION</code>. Setze versuchsweise über die Sicht die Kategorie von Produkt 6 auf ‚Papier‘. Was passiert? Räume danach alle Sichten wieder auf.</p>",
     solution: "CREATE VIEW v_moebel AS\nSELECT produkt_id, name, kategorie, preis, lagerbestand\nFROM produkte WHERE kategorie = 'Möbel'\nWITH CHECK OPTION;\n\n-- Dieser Befehl schlägt fehl (CHECK OPTION failed):\nUPDATE v_moebel SET kategorie = 'Papier' WHERE produkt_id = 6;\n\nDROP VIEW IF EXISTS v_moebel;",
     note: "Der <code>UPDATE</code> wird abgelehnt, weil die Zeile danach nicht mehr in der Sicht läge. In einem Skript brichst du bei diesem Fehler ab, im Client kannst du einfach weitermachen."}
  ]
};
