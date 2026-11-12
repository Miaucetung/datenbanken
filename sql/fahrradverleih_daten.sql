-- Testdaten für das Abschlussprojekt "Fahrradverleih" (Kapitel 17).
-- Voraussetzung: Datenbank "fahrradverleih" und die Tabellen standort, kunde,
-- fahrrad, ausleihe existieren genau wie in der Aufgabe beschrieben.
-- Import:  mariadb -u root -p fahrradverleih < sql/fahrradverleih_daten.sql
-- Das Skript leert die Tabellen zuerst und lässt sich daher beliebig oft ausführen.

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ausleihe;
TRUNCATE TABLE fahrrad;
TRUNCATE TABLE kunde;
TRUNCATE TABLE standort;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO standort (name, stadt) VALUES
('Hauptbahnhof', 'Berlin'),
('Seeufer',      'Hamburg'),
('Altstadt',     'München');

INSERT INTO kunde (vorname, nachname, email, ort) VALUES
('Lena',   'Maurer',  'lena.maurer@example.org',  'Berlin'),
('Jonas',  'Weber',   'jonas.weber@example.org',  'Hamburg'),
('Sophie', 'Klein',   'sophie.klein@example.org', 'München'),
('Murat',  'Yilmaz',  'murat.yilmaz@example.org', 'Berlin'),
('Hanna',  'Roth',    'hanna.roth@example.org',   'Hamburg'),
('Paul',   'Sommer',  'paul.sommer@example.org',  'Berlin');

INSERT INTO fahrrad (modell, typ, tagespreis, standort_id, status) VALUES
('Citybike Classic', 'city',     12.00, 1, 'verfuegbar'),   -- 1
('Citybike Classic', 'city',     12.00, 1, 'verliehen'),    -- 2
('Trekking Pro',     'trekking', 18.00, 2, 'verfuegbar'),   -- 3
('Mountain X',       'mountain', 25.00, 2, 'wartung'),      -- 4
('E-Bike Urban',     'e-bike',   35.00, 1, 'verliehen'),    -- 5
('E-Bike Urban',     'e-bike',   35.00, 3, 'verfuegbar'),   -- 6
('Trekking Pro',     'trekking', 18.00, 3, 'verfuegbar'),   -- 7
('Mountain X',       'mountain', 25.00, 3, 'verfuegbar');   -- 8

-- Abgeschlossene Ausleihen: gesamtpreis = max(1, Tage) * tagespreis
INSERT INTO ausleihe (kunden_id, fahrrad_id, von, bis, gesamtpreis) VALUES
(1, 1, '2025-06-01', '2025-06-04',  36.00),
(2, 3, '2025-06-10', '2025-06-11',  18.00),
(1, 5, '2025-07-01', '2025-07-03',  70.00),
(3, 4, '2025-07-05', '2025-07-08',  75.00),
(4, 1, '2025-08-02', '2025-08-02',  12.00),
(2, 6, '2025-08-15', '2025-08-18', 105.00);

-- Laufende Ausleihen (bis und gesamtpreis sind noch NULL)
INSERT INTO ausleihe (kunden_id, fahrrad_id, von, bis, gesamtpreis) VALUES
(5, 2, '2026-11-10', NULL, NULL),
(3, 5, '2026-11-11', NULL, NULL);
