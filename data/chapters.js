// Kapitelübersicht. status: "ready" = Lektion vorhanden, "planned" = noch offen.
// Lektionen liegen in data/lessons-XX.js und registrieren sich in window.LESSONS.
window.LESSONS = window.LESSONS || {};
window.CHAPTERS = [
  {id:4,  title:"Datenbanken",                       status:"ready",   sections:["Die Abfragesprache SQL","Datenbank erstellen","Datenbank anzeigen und auswählen","Datenbank löschen"]},
  {id:5,  title:"Tabellen erstellen und verwalten",  status:"ready",   sections:["Tabellen erstellen","Datentypen","Constraints","Domänen","Tabellen anzeigen, ändern, löschen"]},
  {id:6,  title:"Daten einfügen, ändern, löschen",   status:"ready",   sections:["INSERT","UPDATE","Bedingtes Einfügen/Aktualisieren","DELETE"]},
  {id:7,  title:"Einfache Datenabfrage",             status:"ready",   sections:["SELECT-Grundlagen","Bedingungen (WHERE)","Gruppieren","Sortieren"]},
  {id:1,  title:"Grundlagen zu Datenbanken",         status:"planned", sections:["Entwicklung","Datenbankmodelle","Aufbau und Organisation","Physische Architektur"]},
  {id:2,  title:"Der Datenbankentwurf",              status:"planned", sections:["Lebenszyklus","Entwerfen","Entity-Relationship-Modell"]},
  {id:3,  title:"Das relationale Datenmodell",       status:"planned", sections:["Begriffe","ER → relational","Normalisierung","Relationale Algebra"]},
  {id:8,  title:"Schlüsselfelder und Indizes",       status:"ready"  , sections:["Schlüssel","Schlüsselfelder festlegen","Indizes"]},
  {id:9,  title:"Funktionen in Abfragen",            status:"ready"  , sections:["Standardfunktionen","Nicht standardisierte Funktionen"]},
  {id:10, title:"Abfragen über mehrere Tabellen",    status:"ready"  , sections:["Verknüpfen","JOIN","UNION","Schnitt-/Differenzmengen","Unterabfragen"]},
  {id:11, title:"Sichten (Views)",                   status:"ready"  , sections:["Erstellen","Löschen","Daten über Sichten ändern"]},
  {id:12, title:"Cursor",                            status:"ready"  , sections:["Erstellen","Zugriff","Schließen"]},
  {id:13, title:"Zugriffsrechte und Benutzer",       status:"ready"  , sections:["Benutzer (MariaDB)","GRANT","REVOKE"]},
  {id:14, title:"Transaktionsverwaltung",            status:"ready"  , sections:["START TRANSACTION","COMMIT","ROLLBACK"]},
  {id:15, title:"Stored Procedures",                 status:"ready"  , sections:["Erstellen","Bearbeiten","Beispielanwendung"]},
  {id:16, title:"Trigger",                           status:"ready"  , sections:["Erstellen","Bearbeiten und löschen"]}
];
