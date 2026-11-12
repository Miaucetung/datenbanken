(function () {
  // ER-Diagramm: Kunde 1:n Bestellung n:m Produkt (über "enthält")
  var er =
    '<div class="diagram"><svg viewBox="0 0 740 150" role="img" aria-label="ER-Diagramm Kunde, Bestellung, Produkt" width="740">' +
    '<g stroke="currentColor" fill="none" stroke-width="1.5">' +
    '<rect x="10" y="50" width="120" height="50"/>' +
    '<polygon points="215,75 255,50 295,75 255,100"/>' +
    '<rect x="340" y="50" width="120" height="50"/>' +
    '<polygon points="525,75 565,50 605,75 565,100"/>' +
    '<rect x="620" y="50" width="90" height="50"/>' +
    '<line x1="130" y1="75" x2="215" y2="75"/><line x1="295" y1="75" x2="340" y2="75"/>' +
    '<line x1="460" y1="75" x2="525" y2="75"/><line x1="605" y1="75" x2="620" y2="75"/></g>' +
    '<text x="70" y="80" text-anchor="middle">Kunde</text>' +
    '<text x="255" y="79" text-anchor="middle">gibt auf</text>' +
    '<text x="400" y="80" text-anchor="middle">Bestellung</text>' +
    '<text x="565" y="79" text-anchor="middle">enthält</text>' +
    '<text x="665" y="80" text-anchor="middle">Produkt</text>' +
    '<text x="170" y="68" text-anchor="middle">1</text><text x="318" y="68" text-anchor="middle">n</text>' +
    '<text x="492" y="68" text-anchor="middle">m</text><text x="612" y="68" text-anchor="middle">n</text>' +
    '<text x="70" y="125" text-anchor="middle" font-size="11">kunden_id, name, stadt</text>' +
    '<text x="400" y="125" text-anchor="middle" font-size="11">bestell_id, datum</text>' +
    '<text x="555" y="125" text-anchor="middle" font-size="11">menge</text>' +
    '<text x="668" y="125" text-anchor="middle" font-size="11">produkt_id, preis</text>' +
    '</svg></div>';

  window.LESSONS[2] = {
    intro: "Ein guter Entwurf entscheidet, ob eine Datenbank später einfach zu benutzen ist oder ständig Probleme macht. Du lernst die Entwurfsphasen und das Entity-Relationship-Modell (ER-Modell), mit dem du Strukturen zeichnest, bevor du Tabellen anlegst.",
    sections: [
      {title: "Datenbank-Lebenszyklus",
       text: "<ol><li><b>Anforderungsanalyse:</b> Was soll gespeichert werden? Wer nutzt die Daten wie?</li>" +
         "<li><b>Konzeptioneller Entwurf:</b> ER-Modell, unabhängig vom späteren DBMS.</li>" +
         "<li><b>Logischer Entwurf:</b> Umsetzung ins relationale Modell, Normalisierung (Kapitel 3).</li>" +
         "<li><b>Physischer Entwurf:</b> Datentypen, Indizes, Storage Engine, konkrete <code>CREATE TABLE</code>-Befehle.</li>" +
         "<li><b>Implementierung und Test:</b> Anlegen, mit Testdaten füllen, Abfragen prüfen.</li>" +
         "<li><b>Betrieb und Wartung:</b> Sicherung, Optimierung, Änderungen.</li></ol>" +
         "<p>Fehler in frühen Phasen sind später teuer. Wer die Anforderungen falsch versteht, baut eine saubere Datenbank für das falsche Problem.</p>"},
      {title: "Datenbanken entwerfen: Vorgehen",
       text: "<p>Aus einem Text mit den Anforderungen findest du die Bausteine so:</p><ul>" +
         "<li><b>Hauptwörter</b> (Substantive) → Entitäten oder Attribute</li><li><b>Verben</b> → Beziehungen</li><li><b>Zahlwörter</b> („mehrere“, „genau ein“) → Kardinalitäten</li></ul>" +
         "<p>Beispiel: „Kunden geben Bestellungen auf. Eine Bestellung enthält mehrere Produkte in einer bestimmten Menge.“ Entitäten: Kunde, Bestellung, Produkt. Beziehungen: gibt auf, enthält. Die Menge gehört zur Beziehung ‚enthält‘."},
      {title: "Das Entity-Relationship-Modell",
       text: "<table class='t'><tr><th>Begriff</th><th>Bedeutung</th><th>Beispiel</th></tr>" +
         "<tr><td>Entität</td><td>ein eindeutig unterscheidbares Objekt</td><td>der Kunde Anna Berger</td></tr>" +
         "<tr><td>Entitätstyp</td><td>Gruppe gleichartiger Entitäten (wird zur Tabelle)</td><td>Kunde</td></tr>" +
         "<tr><td>Attribut</td><td>Eigenschaft (wird zur Spalte)</td><td>name, stadt</td></tr>" +
         "<tr><td>Schlüsselattribut</td><td>identifiziert die Entität (unterstrichen)</td><td>kunden_id</td></tr>" +
         "<tr><td>Beziehung</td><td>Verbindung zwischen Entitäten (Raute)</td><td>gibt auf</td></tr>" +
         "<tr><td>Kardinalität</td><td>Wie viele Partner sind möglich?</td><td>1:n</td></tr></table>" +
         er +
         "<h3>Kardinalitäten</h3>" +
         "<table class='t'><tr><th>Typ</th><th>Bedeutung</th><th>Beispiel</th></tr>" +
         "<tr><td>1:1</td><td>jedes Element hat höchstens einen Partner</td><td>Mitarbeiter ↔ Dienstwagen</td></tr>" +
         "<tr><td>1:n</td><td>ein Element links, viele rechts</td><td>Kunde → Bestellungen</td></tr>" +
         "<tr><td>n:m</td><td>viele auf beiden Seiten</td><td>Bestellung ↔ Produkte</td></tr></table>" +
         "<p>Genauer wird es mit der <b>(min,max)-Notation</b>: <code>(0,n)</code> heißt „keiner oder viele“, <code>(1,1)</code> „genau einer“. Ein Kunde ohne Bestellung ist möglich, eine Bestellung ohne Kunde nicht. Also hat Kunde zu Bestellung <code>(0,n)</code> und Bestellung zu Kunde <code>(1,1)</code>.</p>" +
         "<h3>Besondere Attribute und Entitäten</h3><ul>" +
         "<li><b>Mehrwertiges Attribut:</b> mehrere Werte je Entität, z. B. Telefonnummern. Wird später eine eigene Tabelle.</li>" +
         "<li><b>Zusammengesetztes Attribut:</b> besteht aus Teilen, z. B. Adresse = Straße, PLZ, Ort.</li>" +
         "<li><b>Abgeleitetes Attribut:</b> lässt sich berechnen, z. B. Alter aus Geburtsdatum. Wird nicht gespeichert.</li>" +
         "<li><b>Schwache Entität:</b> ohne ihre „Eigentümer“-Entität nicht identifizierbar, z. B. eine Bestellposition ohne Bestellung.</li>" +
         "<li><b>Generalisierung / Spezialisierung:</b> Oberklasse mit Unterklassen, z. B. Person → Student, Dozent.</li></ul>",
       tip: "Bei einer Beziehung zwischen zwei Entitäten fragst du in beide Richtungen: „Wie viele Bestellungen kann ein Kunde haben?“ und „Wie viele Kunden hat eine Bestellung?“ Erst beide Antworten ergeben die Kardinalität."}
    ],
    exercises: [
      {id: "k2-1", title: "Entitäten und Beziehungen finden",
       task: "<p>Anforderung: „Eine Bibliothek verleiht Bücher an Mitglieder. Jedes Buch hat Titel, ISBN und genau einen Verlag. Ein Verlag bringt viele Bücher heraus. Mitglieder (Name, Mitgliedsnummer) können mehrere Bücher ausleihen, ein Buch kann über die Zeit an viele Mitglieder verliehen werden. Zu jeder Ausleihe wird das Ausleihdatum gespeichert.“<br>Nenne die Entitätstypen, Beziehungen und Kardinalitäten.</p>",
       hints: ["Unterstreiche die Hauptwörter. Was ist ein eigenes Objekt, was nur eine Eigenschaft?", "Das Ausleihdatum hängt weder nur am Buch noch nur am Mitglied."],
       answer: "<ul><li><b>Entitätstypen:</b> Buch (<u>isbn</u>, titel), Verlag (<u>verlag_id</u>, name), Mitglied (<u>mitgliedsnr</u>, name)</li>" +
         "<li><b>Verlag – Buch:</b> ‚bringt heraus‘, 1:n. Ein Verlag hat viele Bücher, ein Buch genau einen Verlag, also Buch→Verlag <code>(1,1)</code>.</li>" +
         "<li><b>Mitglied – Buch:</b> ‚leiht aus‘, n:m, mit dem Attribut <i>ausleihdatum</i> an der Beziehung.</li></ul>" +
         "<p>Die n:m-Beziehung wird im nächsten Kapitel zur eigenen Tabelle <code>ausleihe</code>.</p>"},
      {id: "k2-2", title: "Attribute einordnen",
       task: "<p>Entscheide bei Entität <i>Person</i> für diese Attribute, ob sie einfach, zusammengesetzt, mehrwertig oder abgeleitet sind: a) Geburtsdatum, b) Alter, c) Adresse (Straße, PLZ, Ort), d) Telefonnummern (mehrere), e) Nachname.</p>",
       answer: "<ul><li>a) einfach</li><li>b) <b>abgeleitet</b> (aus Geburtsdatum berechenbar, nicht speichern)</li><li>c) <b>zusammengesetzt</b> (in der Tabelle meist drei Spalten)</li><li>d) <b>mehrwertig</b> (eigene Tabelle)</li><li>e) einfach</li></ul>"},
      {id: "k2-3", title: "Kardinalitäten bestimmen",
       task: "<p>Bestimme die Kardinalität (1:1, 1:n oder n:m): a) Land ↔ Hauptstadt, b) Lehrer ↔ Klasse (ein Lehrer unterrichtet mehrere Klassen, eine Klasse hat mehrere Lehrer), c) Mutter ↔ Kind (jedes Kind hat genau eine leibliche Mutter), d) Student ↔ Prüfung (jede Prüfung wird von genau einem Studenten abgelegt).</p>",
       answer: "<ul><li>a) 1:1</li><li>b) n:m</li><li>c) 1:n (eine Mutter, viele Kinder)</li><li>d) 1:n (ein Student, viele Prüfungen)</li></ul>"},
      {id: "k2-4", title: "Eigenes ER-Modell",
       task: "<p>Entwirf ein ER-Modell für eine Fahrschule: Fahrschüler, Fahrlehrer, Fahrstunden, Fahrzeuge. Ein Fahrschüler absolviert viele Fahrstunden, jede Fahrstunde hat genau einen Fahrschüler, einen Fahrlehrer und ein Fahrzeug. Gib Entitäten mit Attributen und die Kardinalitäten an.</p>",
       answer: "<ul><li>Fahrschüler (<u>schueler_id</u>, name, geburtsdatum)</li><li>Fahrlehrer (<u>lehrer_id</u>, name)</li><li>Fahrzeug (<u>kennzeichen</u>, modell)</li><li>Fahrstunde (<u>stunde_id</u>, datum, dauer_min), mit Beziehungen zu den drei anderen</li></ul>" +
         "<p>Beziehungen: Fahrschüler 1:n Fahrstunde, Fahrlehrer 1:n Fahrstunde, Fahrzeug 1:n Fahrstunde. Die Fahrstunde steht in der Mitte und bekommt später drei Fremdschlüssel. Alternativ kannst du Fahrstunde als n:m-Beziehung zwischen Schüler und Lehrer sehen, das Ergebnis ist dieselbe Tabelle.</p>"}
    ],
    quiz: [
      {id: "q2-1", q: "In welcher Phase entsteht das ER-Modell?",
       options: ["Physischer Entwurf", "Konzeptioneller Entwurf", "Betrieb und Wartung", "Implementierung"],
       correct: 1, explain: "Das ER-Modell ist der konzeptionelle Entwurf: unabhängig vom DBMS und von konkreten Datentypen."},
      {id: "q2-2", q: "Ein Kunde kann viele Bestellungen aufgeben, jede Bestellung gehört genau einem Kunden. Welche Kardinalität?",
       options: ["1:1", "1:n", "n:m", "0:0"],
       correct: 1, explain: "Ein Kunde, viele Bestellungen: 1:n."},
      {id: "q2-3", q: "Was ist ein abgeleitetes Attribut?",
       options: ["Ein Attribut mit mehreren Werten", "Ein Attribut, das sich aus anderen berechnen lässt (z. B. Alter)", "Ein Attribut, das den Schlüssel bildet", "Ein Attribut ohne Datentyp"],
       correct: 1, explain: "Abgeleitete Attribute werden meist nicht gespeichert, weil sie sich berechnen lassen. Gespeichert, könnten sie veralten."},
      {id: "q2-4", q: "Was zeigt (0,n) an der Beziehung Kunde → Bestellung?",
       options: ["Jeder Kunde hat mindestens eine Bestellung", "Ein Kunde kann keine, eine oder viele Bestellungen haben", "Ein Kunde hat genau eine Bestellung", "Es gibt höchstens null Bestellungen"],
       correct: 1, explain: "Die erste Zahl ist das Minimum, die zweite das Maximum. 0 = optional, n = beliebig viele."}
    ]
  };
})();
