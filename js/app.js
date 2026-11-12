(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var main = $("#main"), nav = $("#nav");

  // ---- Speicher (Fortschritt, Theme); funktioniert auch ohne localStorage ----
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var done = store.get("done", {});
  function setDone(id, v) { if (v) done[id] = 1; else delete done[id]; store.set("done", done); }

  // ---- Theme ----
  var theme = store.get("theme", null);
  if (theme) document.documentElement.dataset.theme = theme;
  $("#themeBtn").onclick = function () {
    var dark = document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme:dark)").matches);
    theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme; store.set("theme", theme);
  };
  $("#menuBtn").onclick = function () { nav.classList.toggle("open"); };

  // SQL-Skripte zum Herunterladen
  var SQL_FILES = {
    "lernshop.sql": "Übungsdatenbank lernshop (legt sie neu an, setzt alles zurück)",
    "fahrradverleih_daten.sql": "Testdaten für das Abschlussprojekt (Tabellen vorher selbst anlegen)"
  };
  var CHAPTER_SQL = {3: ["lernshop.sql"], 6: ["lernshop.sql"], 7: ["lernshop.sql"], 8: ["lernshop.sql"], 9: ["lernshop.sql"], 10: ["lernshop.sql"],
    11: ["lernshop.sql"], 12: ["lernshop.sql"], 13: ["lernshop.sql"], 14: ["lernshop.sql"], 15: ["lernshop.sql"], 16: ["lernshop.sql"],
    17: ["fahrradverleih_daten.sql"]};
  function dlLink(name) {
    return '<a class="dl" href="sql/' + name + '" download="' + name + '">⬇ ' + name + "</a>";
  }
  function dlBox(names) {
    return '<p class="dls">' + names.map(function (n) { return dlLink(n) + ' <small class="lead">' + esc(SQL_FILES[n]) + "</small>"; }).join("<br>") +
      '</p><p><small class="lead">Import im Terminal, im Ordner der Datei: <code>mariadb -u root -p &lt; ' + names[0] + "</code></small></p>";
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function code(src) {
    return '<div class="codewrap"><button class="copy" type="button">Kopieren</button><pre><code>' + esc(src.trim()) + "</code></pre></div>";
  }
  function exIds(ch) {
    var l = window.LESSONS[ch.id]; if (!l) return [];
    return l.exercises.map(function (e) { return e.id; }).concat((l.quiz || []).map(function (q) { return q.id; }));
  }
  function chapterProgress(ch) {
    var ids = exIds(ch); if (!ids.length) return {n: 0, d: 0};
    return {n: ids.length, d: ids.filter(function (i) { return done[i]; }).length};
  }

  // ---- Navigation ----
  function renderNav(active) {
    nav.innerHTML = '<a href="#/" class="' + (active === "home" ? "active" : "") + '">Übersicht</a>' +
      window.CHAPTERS.slice().sort(function (a, b) { return a.id - b.id; }).map(function (c) {
        var p = chapterProgress(c);
        var cls = (active === c.id ? "active " : "") + (c.status === "planned" ? "planned " : "") + (p.n && p.d === p.n ? "done" : "");
        return '<a class="' + cls + '" href="#/k/' + c.id + '"><span class="num">' + c.id + '</span>' + esc(c.title) + "</a>";
      }).join("") + '<a href="#/spickzettel" class="' + (active === "cheat" ? "active" : "") + '">Spickzettel</a>';
  }

  // ---- Seiten ----
  function home() {
    var all = window.CHAPTERS.slice().sort(function (a, b) { return a.id - b.id; });
    var tn = 0, td = 0;
    all.forEach(function (c) { var p = chapterProgress(c); tn += p.n; td += p.d; });
    main.innerHTML = "<h1>SQL lernen mit MariaDB</h1>" +
      '<p class="lead">Lektionen, Befehle und Übungen zum Selbermachen. Du übst in deinem lokalen MariaDB, diese Seite liefert Erklärung, Aufgaben und Lösungen.</p>' +
      '<div class="card"><b>Start in 2 Schritten</b><ol>' +
      "<li>MariaDB-Client öffnen: <code>mariadb -u root -p</code></li>" +
      "<li>Ab Kapitel 6 die Übungsdatenbank laden: <code>source lernshop.sql;</code> (heruntergeladene Datei im aktuellen Ordner) oder <code>source sql/lernshop.sql;</code> (wenn du das Repo geklont hast)</li></ol>" +
      "<p><b>SQL-Skripte herunterladen:</b></p>" + dlBox(["lernshop.sql", "fahrradverleih_daten.sql"]) +
      "<p>Gesamtfortschritt: " + td + " von " + tn + " Übungen</p>" +
      '<div class="progress"><i style="width:' + (tn ? td / tn * 100 : 0) + '%"></i></div></div>' +
      '<div class="grid">' + all.map(function (c) {
        var p = chapterProgress(c);
        return '<a class="card" href="#/k/' + c.id + '"><span class="badge ' + c.status + '">' +
          (c.status === "ready" ? "bereit" : "geplant") + "</span><h3>" + c.id + ". " + esc(c.title) + "</h3>" +
          '<small class="lead">' + c.sections.map(esc).join(" · ") + "</small>" +
          (p.n ? '<div class="progress"><i style="width:' + p.d / p.n * 100 + '%"></i></div>' : "") + "</a>";
      }).join("") + "</div>";
    renderNav("home");
  }

  function chapter(id) {
    var ch = window.CHAPTERS.filter(function (c) { return c.id === id; })[0];
    if (!ch) return home();
    renderNav(id);
    var l = window.LESSONS[id];
    if (!l) {
      main.innerHTML = "<h1>" + ch.id + ". " + esc(ch.title) + "</h1>" +
        '<p class="lead">Diese Lektion ist noch in Arbeit. Geplante Themen:</p><ul>' +
        ch.sections.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>";
      return;
    }
    var h = "<h1>" + ch.id + ". " + esc(ch.title) + "</h1><p class='lead'>" + l.intro + "</p>";
    if (l.setup) h += '<div class="tip"><b>Vorbereitung:</b> ' + l.setup + "</div>";
    if (CHAPTER_SQL[id]) h += '<div class="card"><b>Skript zum Herunterladen</b>' + dlBox(CHAPTER_SQL[id]) + "</div>";
    l.sections.forEach(function (s) {
      h += "<h2>" + esc(s.title) + "</h2>" + (s.text || "");
      (s.code || []).forEach(function (c) { h += code(c); });
      if (s.tip) h += '<div class="tip">' + s.tip + "</div>";
      if (s.warn) h += '<div class="warn">' + s.warn + "</div>";
    });
    h += "<h2>Übungen</h2>";
    l.exercises.forEach(function (e, i) {
      h += '<div class="card ex' + (done[e.id] ? " done" : "") + '" data-id="' + e.id + '"><h3>Aufgabe ' + (i + 1) + ": " + esc(e.title) +
        '<label><input type="checkbox"' + (done[e.id] ? " checked" : "") + "> erledigt</label></h3><div>" + e.task + "</div>" +
        (e.hints || []).map(function (t, k) { return "<details><summary>Hinweis " + (k + 1) + "</summary>" + t + "</details>"; }).join("") +
        "<details><summary>Lösung anzeigen</summary>" + (e.answer || "") + (e.solution ? code(e.solution) : "") + (e.note ? "<p>" + e.note + "</p>" : "") + "</details></div>";
    });
    if (l.quiz && l.quiz.length) {
      h += "<h2>Kurzquiz</h2>";
      l.quiz.forEach(function (q, i) {
        h += '<div class="card quiz' + (done[q.id] ? " done" : "") + '" data-id="' + q.id + '"><b>Frage ' + (i + 1) + ":</b> " + q.q + '<div class="opts">' +
          q.options.map(function (o, k) { return '<button type="button" class="opt" data-k="' + k + '">' + o + "</button>"; }).join("") +
          '</div><div class="fb" hidden></div></div>';
      });
    }
    main.innerHTML = h;
  }

  function cheat() {
    renderNav("cheat");
    var items = window.CHEATSHEET || [];
    main.innerHTML = "<h1>Spickzettel</h1><input class='search' id='q' placeholder='Befehl suchen, z. B. JOIN, LIKE, GRANT …' autofocus><div id='res'></div>";
    function draw(q) {
      q = q.toLowerCase();
      $("#res").innerHTML = items.filter(function (i) {
        return !q || (i.cmd + " " + i.desc + " " + i.group).toLowerCase().indexOf(q) > -1;
      }).map(function (i) {
        return '<div class="card"><span class="badge">' + esc(i.group) + "</span> <b>" + esc(i.cmd) + "</b><br>" + esc(i.desc) + code(i.example) + "</div>";
      }).join("") || "<p>Nichts gefunden.</p>";
    }
    draw(""); $("#q").oninput = function (e) { draw(e.target.value); };
  }

  // ---- Events ----
  main.addEventListener("click", function (e) {
    if (e.target.classList.contains("copy")) {
      var t = e.target.nextElementSibling.textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () {
        e.target.textContent = "Kopiert ✓"; setTimeout(function () { e.target.textContent = "Kopieren"; }, 1200);
      }, function () {
        var r = document.createRange(); r.selectNodeContents(e.target.nextElementSibling);
        var s = getSelection(); s.removeAllRanges(); s.addRange(r); e.target.textContent = "Markiert";
      });
    }
  });
  main.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".opt"); if (!b) return;
    var card = b.closest(".quiz"), id = card.dataset.id;
    var l = window.LESSONS[parseInt((location.hash.match(/k\/(\d+)/) || [])[1], 10)];
    var q = l.quiz.filter(function (x) { return x.id === id; })[0];
    var k = parseInt(b.dataset.k, 10), ok = k === q.correct;
    card.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("right", "wrong"); });
    b.classList.add(ok ? "right" : "wrong");
    var fb = card.querySelector(".fb"); fb.hidden = false;
    fb.innerHTML = (ok ? "<b>Richtig.</b> " : "<b>Leider falsch.</b> Versuch es nochmal. ") + (ok ? q.explain : "");
    if (ok) { setDone(id, true); card.classList.add("done"); renderNav(parseInt((location.hash.match(/k\/(\d+)/) || [])[1], 10)); }
  });
  main.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") {
      var card = e.target.closest(".ex");
      setDone(card.dataset.id, e.target.checked);
      card.classList.toggle("done", e.target.checked);
      renderNav(parseInt((location.hash.match(/k\/(\d+)/) || [])[1], 10) || "home");
    }
  });

  function route() {
    var h = location.hash || "#/";
    nav.classList.remove("open");
    var m = h.match(/^#\/k\/(\d+)/);
    if (m) chapter(parseInt(m[1], 10));
    else if (h === "#/spickzettel") cheat();
    else home();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
