/* Onyx docs: hash router, page renderer, search and table of contents. */
(function () {
  "use strict";

  var groups = window.ONYX_DOCS;
  var pages = [];
  groups.forEach(function (g) {
    g.pages.forEach(function (p) { p.group = g.group; pages.push(p); });
  });
  var bySlug = {};
  pages.forEach(function (p, i) { p.index = i; bySlug[p.slug] = p; });

  var sidebar = document.getElementById("sidebar");
  var main = document.getElementById("main");
  var toc = document.getElementById("toc");

  /* ---------- Helpers ---------- */
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function slugify(s) {
    return s.toLowerCase().replace(/&amp;|&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // Wrap regex matches in highlight spans; everything between matches is escaped as plain text.
  function tokenize(src, re, classify) {
    var out = "";
    var last = 0;
    src.replace(re, function () {
      var m = arguments[0];
      var offset = arguments[arguments.length - 2];
      out += esc(src.slice(last, offset)) + classify(Array.prototype.slice.call(arguments, 0, -2));
      last = offset + m.length;
      return m;
    });
    return out + esc(src.slice(last));
  }

  var span = function (cls, text) { return '<span class="' + cls + '">' + esc(text) + "</span>"; };

  var highlighters = {
    html: function (src) {
      return tokenize(src, /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][\w-]*)|([\w:-]+)(=)("[^"]*")|(\/?>)/g, function (m) {
        if (m[1]) return span("c", m[1]);
        if (m[2]) return span("t", m[2]);
        if (m[3]) return span("a", m[3]) + "=" + span("s", m[5]);
        return span("t", m[6]);
      });
    },
    js: function (src) {
      return tokenize(src, /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*'|`[^`]*`)|\b(import|from|const|let|var|function|return|new|export)\b|([A-Za-z_$][\w$]*)(?=\()/g, function (m) {
        if (m[1]) return span("c", m[1]);
        if (m[2]) return span("s", m[2]);
        if (m[3]) return span("a", m[3]);
        return span("t", m[4]);
      });
    },
    css: function (src) {
      return tokenize(src, /(\/\*[\s\S]*?\*\/)|("[^"\n]*")|(--[\w-]+)|(^[^\s{][^{\n]*(?=\s*\{))/gm, function (m) {
        if (m[1]) return span("c", m[1]);
        if (m[2]) return span("s", m[2]);
        if (m[3]) return span("a", m[3]);
        return span("t", m[4]);
      });
    },
    bash: function (src) { return esc(src); }
  };

  function codeBlock(src, lang, label) {
    var hl = (highlighters[lang] || highlighters.bash)(src);
    return (
      '<div class="d-code-bar"><span>' + esc(label || lang) + "</span>" +
      '<button class="d-copy" data-src="' + esc(src) + '"><svg><use href="#i-copy"/></svg><span>Copy</span></button></div>' +
      '<pre class="ox-code">' + hl + "</pre>"
    );
  }

  /* ---------- Rendering ---------- */
  function renderBlock(b) {
    switch (b.type) {
      case "h2":
        return '<h2 id="' + slugify(b.text) + '">' + esc(b.text) + "</h2>";
      case "p":
        return "<p>" + b.html + "</p>";
      case "list":
        return '<ul class="d-list">' + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
      case "note":
        return '<div class="d-callout"><span>💡</span><div>' + b.html + "</div></div>";
      case "example":
        return (
          '<div class="d-example">' +
          '<div class="d-preview ' + b.layout + '">' + b.html + "</div>" +
          '<div class="d-code">' + codeBlock(b.html.trim(), "html", "HTML") + "</div>" +
          (b.js ? '<div class="d-code">' + codeBlock(b.js.trim(), "js", "JavaScript") + "</div>" : "") +
          "</div>"
        );
      case "code":
        return '<div class="d-code-standalone">' + codeBlock(b.src.trim(), b.lang, b.file || b.lang) + "</div>";
      case "table":
        return (
          '<div class="d-table-wrap"><table class="d-table"><thead><tr>' +
          b.head.map(function (h) { return "<th>" + h + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
          b.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
          "</tbody></table></div>"
        );
      case "cards":
        return (
          '<div class="d-cards">' +
          b.items.map(function (c) {
            return '<a class="ox-card ox-card-interactive" href="#/' + c[0] + '"><b>' + c[1] + "</b><span>" + c[2] + "</span></a>";
          }).join("") +
          "</div>"
        );
      default:
        return "";
    }
  }

  function renderSidebar(current) {
    sidebar.innerHTML = groups.map(function (g) {
      return (
        '<div class="d-nav-group"><p class="d-nav-title">' + g.group + "</p>" +
        g.pages.map(function (p) {
          return '<a class="d-nav-link" href="#/' + p.slug + '"' + (p.slug === current ? ' aria-current="page"' : "") + ">" + p.title +
            (g.pro ? '<span class="ox-badge ox-badge-outline">Pro</span>' : "") + "</a>";
        }).join("") +
        "</div>"
      );
    }).join("");
    var active = sidebar.querySelector('[aria-current="page"]');
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
  }

  function renderPager(page) {
    var prev = pages[page.index - 1];
    var next = pages[page.index + 1];
    var html = '<nav class="d-pager" aria-label="Pagination">';
    if (prev) html += '<a href="#/' + prev.slug + '"><small><svg><use href="#i-back"/></svg>Previous</small><b>' + prev.title + "</b></a>";
    if (next) html += '<a class="next" href="#/' + next.slug + '"><small>Next<svg><use href="#i-arrow"/></svg></small><b>' + next.title + "</b></a>";
    return html + "</nav>";
  }

  var spy = null;

  function renderToc(page) {
    var heads = page.blocks.filter(function (b) { return b.type === "h2"; });
    if (!heads.length) { toc.innerHTML = ""; return; }
    toc.innerHTML = "<h4>On this page</h4>" + heads.map(function (h) {
      var id = slugify(h.text);
      return '<a href="#/' + page.slug + "/" + id + '" data-id="' + id + '">' + esc(h.text) + "</a>";
    }).join("");

    if (spy) spy.disconnect();
    if (!("IntersectionObserver" in window)) return;
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        toc.querySelectorAll("a").forEach(function (a) {
          a.classList.toggle("active", a.dataset.id === en.target.id);
        });
      });
    }, { rootMargin: "-80px 0px -65% 0px" });
    main.querySelectorAll("h2[id]").forEach(function (h) { spy.observe(h); });
  }

  function route() {
    var parts = (location.hash.replace(/^#\/?/, "") || "introduction").split("/");
    var page = bySlug[parts[0]] || pages[0];
    var section = parts[1];

    main.innerHTML =
      '<article class="d-article">' +
      '<div class="d-breadcrumb"><span>' + page.group + "</span><span>/</span><span>" + page.title + "</span></div>" +
      "<h1>" + page.title + "</h1>" +
      '<p class="ox-lead">' + esc(page.lead) + "</p>" +
      page.blocks.map(renderBlock).join("") +
      renderPager(page) +
      "</article>";

    // Examples with a JS part (charts, tables) are started once their markup is on the page.
    // Command menus mount on <body>, so drop ones left behind by the previous page first.
    document.querySelectorAll(".oxp-command").forEach(function (m) { m.remove(); });
    page.blocks.forEach(function (b) {
      if (b.type !== "example" || !b.js) return;
      try { new Function(b.js)(); } catch (err) { console.error("Example failed on " + page.slug, err); }
    });

    document.title = page.title + " — Onyx Docs";
    renderSidebar(page.slug);
    renderToc(page);
    document.body.removeAttribute("data-nav-open");

    var target = section && document.getElementById(section);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  /* ---------- Copy buttons ---------- */
  main.addEventListener("click", function (e) {
    var btn = e.target.closest(".d-copy");
    if (!btn) return;
    Onyx.copy(btn.getAttribute("data-src"));
    var label = btn.querySelector("span");
    btn.setAttribute("data-copied", "");
    label.textContent = "Copied";
    setTimeout(function () { btn.removeAttribute("data-copied"); label.textContent = "Copy"; }, 1500);
  });

  /* ---------- Mobile navigation ---------- */
  var menuBtn = document.getElementById("menu-btn");
  function setNav(open) {
    if (open) document.body.setAttribute("data-nav-open", "");
    else document.body.removeAttribute("data-nav-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () { setNav(!document.body.hasAttribute("data-nav-open")); });
  document.getElementById("scrim").addEventListener("click", function () { setNav(false); });

  /* ---------- Search ---------- */
  var index = [];
  pages.forEach(function (p) {
    index.push({ title: p.title, group: p.group, hint: p.lead, href: "#/" + p.slug, text: (p.title + " " + p.lead).toLowerCase() });
    p.blocks.forEach(function (b) {
      if (b.type === "h2") {
        index.push({ title: b.text, group: p.title, hint: p.title, href: "#/" + p.slug + "/" + slugify(b.text), text: (b.text + " " + p.title).toLowerCase(), sub: true });
      }
    });
  });

  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var selected = 0;

  function search(q) {
    q = q.trim().toLowerCase();
    var words = q.split(/\s+/).filter(Boolean);
    var hits = index.filter(function (item) {
      if (!words.length) return !item.sub;
      return words.every(function (w) { return item.text.indexOf(w) !== -1; });
    });
    // Page titles that start with the query rank first
    hits.sort(function (a, b) {
      var as = a.title.toLowerCase().indexOf(q) === 0 ? 0 : 1;
      var bs = b.title.toLowerCase().indexOf(q) === 0 ? 0 : 1;
      return as - bs || (a.sub ? 1 : 0) - (b.sub ? 1 : 0);
    });
    return hits.slice(0, 12);
  }

  function renderResults() {
    var hits = search(input.value);
    selected = 0;
    if (!hits.length) {
      results.innerHTML = '<div class="d-search-empty">No results for “' + esc(input.value) + "”</div>";
      return;
    }
    var html = "";
    var lastGroup = null;
    hits.forEach(function (h, i) {
      var label = h.sub ? "Sections" : h.group;
      if (label !== lastGroup) { html += '<div class="d-search-group">' + esc(label) + "</div>"; lastGroup = label; }
      html += '<a class="d-search-item" role="option" href="' + h.href + '" aria-selected="' + (i === 0) + '"><span>' + esc(h.title) + "</span><small>" + esc(h.hint) + "</small></a>";
    });
    results.innerHTML = html;
  }

  function moveSelection(delta) {
    var items = results.querySelectorAll(".d-search-item");
    if (!items.length) return;
    selected = (selected + delta + items.length) % items.length;
    items.forEach(function (el, i) { el.setAttribute("aria-selected", String(i === selected)); });
    items[selected].scrollIntoView({ block: "nearest" });
  }

  function openSearch() {
    input.value = "";
    renderResults();
    Onyx.modal.open("search-modal");
  }

  function closeSearch() { Onyx.modal.close("search-modal"); }

  document.getElementById("search-trigger").addEventListener("click", openSearch);
  input.addEventListener("input", renderResults);
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); moveSelection(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveSelection(-1); }
    else if (e.key === "Enter") {
      var item = results.querySelectorAll(".d-search-item")[selected];
      if (item) { location.hash = item.getAttribute("href"); closeSearch(); }
    }
  });
  results.addEventListener("click", function (e) { if (e.target.closest(".d-search-item")) closeSearch(); });

  document.addEventListener("keydown", function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
      e.preventDefault();
      openSearch();
    }
  });

  // Show the platform's shortcut
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    document.querySelector(".d-search-trigger .ox-kbd").textContent = "⌘K";
  }

  window.addEventListener("hashchange", route);
  route();
})();
