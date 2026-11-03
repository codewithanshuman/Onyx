/*! Onyx Pro v1.0.0 — PREVIEW BUILD for the Onyx documentation only.
 *  Not licensed for use in your projects. Get a license from the Onyx pricing page. */
(function (global) {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";
  var uid = 0;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function svgEl(tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  var defaultFormat = function (v) { return new Intl.NumberFormat().format(v); };

  // Round the axis maximum up to a friendly number (1, 2, 2.5, 5 × 10^n)
  function niceMax(v) {
    if (v <= 0) return 1;
    var exp = Math.pow(10, Math.floor(Math.log10(v)));
    var steps = [1, 2, 2.5, 5, 10];
    for (var i = 0; i < steps.length; i++) if (steps[i] * exp >= v) return steps[i] * exp;
    return 10 * exp;
  }

  // Pick a tick count whose step is a friendly number and wastes the least headroom
  function niceScale(v) {
    var best = null;
    [4, 5, 3].forEach(function (t) {
      var step = niceMax(v / t);
      if (!best || step * t < best.max) best = { max: step * t, ticks: t };
    });
    return best;
  }

  // Smooth path through points that never overshoots between neighbours (monotone cubic)
  function smoothPath(pts) {
    if (pts.length < 2) return "";
    var d = "M" + pts[0][0] + " " + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var t = 0.18;
      var c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      var c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      var lo = Math.min(p1[1], p2[1]), hi = Math.max(p1[1], p2[1]);
      c1y = Math.min(hi, Math.max(lo, c1y));
      c2y = Math.min(hi, Math.max(lo, c2y));
      d += "C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }

  /* =========================================================
     Charts
     ========================================================= */
  var SHADES = [100, 62, 38, 20, 10]; // % of foreground mixed into background, for bars and slices

  function shade(i) {
    return "color-mix(in srgb, var(--ox-fg) " + SHADES[i % SHADES.length] + "%, var(--ox-bg))";
  }

  function chart(el, opts) {
    if (typeof el === "string") el = document.querySelector(el);
    opts = Object.assign({ type: "line", height: 240, labels: [], series: [], format: defaultFormat, legend: false }, opts);
    var id = "oxp-c" + (++uid);
    el.classList.add("oxp-chart");
    el.innerHTML = "";
    var svg = svgEl("svg", { role: "img", "aria-label": opts.title || "Chart" }, el);
    var tip = document.createElement("div");
    tip.className = "oxp-chart-tip";
    el.appendChild(tip);
    if (opts.legend) el.appendChild(legend(opts));

    function draw() {
      var W = el.clientWidth || 600;
      var H = opts.type === "donut" ? Math.min(opts.height, W) : opts.height;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("height", H);
      svg.innerHTML = "";
      if (opts.type === "donut") drawDonut(svg, W, H, opts);
      else drawXY(svg, W, H, opts, tip, id);
    }

    draw();
    if ("ResizeObserver" in global) {
      var lastW = el.clientWidth;
      new ResizeObserver(function () {
        if (el.clientWidth !== lastW) { lastW = el.clientWidth; draw(); }
      }).observe(el);
    }
    return { update: function (o) { Object.assign(opts, o); draw(); }, el: el };
  }

  function legend(opts) {
    var box = document.createElement("div");
    box.className = "oxp-legend";
    box.style.marginTop = "var(--ox-space-4)";
    var items = opts.type === "donut" ? opts.labels : opts.series.map(function (s) { return s.name; });
    box.innerHTML = items.map(function (name, i) {
      var mark = opts.type === "line" || opts.type === "area"
        ? '<i class="s' + i + '"></i>'
        : '<i class="sq" style="--c:' + shade(i) + '"></i>';
      return "<span>" + mark + esc(name) + "</span>";
    }).join("");
    return box;
  }

  function drawXY(svg, W, H, opts, tip, id) {
    var pad = { t: 12, r: 8, b: 26, l: 44 };
    var iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    var all = [];
    opts.series.forEach(function (s) { all = all.concat(s.data); });
    var scale = niceScale(Math.max.apply(null, all));
    var max = scale.max;
    var n = opts.labels.length;
    var isBar = opts.type === "bar";
    var band = iw / n;
    var x = function (i) { return pad.l + (isBar ? band * (i + 0.5) : (n === 1 ? iw / 2 : (iw * i) / (n - 1))); };
    var y = function (v) { return pad.t + ih - (v / max) * ih; };

    // Gradient for area fills
    var defs = svgEl("defs", {}, svg);
    var grad = svgEl("linearGradient", { id: id + "-fade", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    svgEl("stop", { offset: "0%", "stop-color": "currentColor", "stop-opacity": 0.14 }, grad);
    svgEl("stop", { offset: "100%", "stop-color": "currentColor", "stop-opacity": 0 }, grad);
    svg.style.color = "var(--ox-fg)";

    // Grid and y axis
    var grid = svgEl("g", { class: "grid" }, svg);
    var axis = svgEl("g", { class: "axis" }, svg);
    var ticks = scale.ticks;
    for (var t = 0; t <= ticks; t++) {
      var v = (max / ticks) * t;
      svgEl("line", { x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v) }, grid);
      svgEl("text", { x: pad.l - 10, y: y(v) + 4, "text-anchor": "end" }, axis).textContent = compact(v);
    }

    // X labels: thin them out so they never overlap
    var every = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(iw / 56))));
    opts.labels.forEach(function (l, i) {
      if (i % every) return;
      var anchor = isBar ? "middle" : i === 0 ? "start" : i === n - 1 ? "end" : "middle";
      svgEl("text", { x: x(i), y: H - 6, "text-anchor": anchor }, axis).textContent = l;
    });

    var bars = [];
    if (isBar) {
      var groupW = band * 0.64;
      var bw = groupW / opts.series.length;
      opts.series.forEach(function (s, si) {
        s.data.forEach(function (v, i) {
          var bx = x(i) - groupW / 2 + bw * si + 1;
          var r = svgEl("rect", { class: "bar s" + si, x: bx, y: y(v), width: Math.max(1, bw - 2), height: Math.max(0, pad.t + ih - y(v)), rx: Math.min(3, bw / 4) }, svg);
          bars.push({ el: r, i: i });
        });
      });
    } else {
      opts.series.forEach(function (s, si) {
        var pts = s.data.map(function (v, i) { return [x(i), y(v)]; });
        var line = smoothPath(pts);
        if (opts.type === "area" && si === 0) {
          svgEl("path", { d: line + "L" + x(n - 1) + " " + (pad.t + ih) + "L" + x(0) + " " + (pad.t + ih) + "Z", fill: "url(#" + id + "-fade)" }, svg);
        }
        svgEl("path", { class: "line s" + si, d: line }, svg);
      });
    }

    // Hover: crosshair, dots and tooltip
    var cross = svgEl("line", { class: "crosshair", y1: pad.t, y2: pad.t + ih, visibility: "hidden" }, svg);
    var dots = isBar ? [] : opts.series.map(function () { return svgEl("circle", { class: "dot", r: 4, visibility: "hidden" }, svg); });
    var hit = svgEl("rect", { x: pad.l, y: 0, width: iw, height: H, fill: "transparent" }, svg);

    function show(clientX) {
      var rect = svg.getBoundingClientRect();
      var px = ((clientX - rect.left) / rect.width) * W;
      var i = isBar ? Math.floor((px - pad.l) / band) : Math.round(((px - pad.l) / iw) * (n - 1));
      i = Math.max(0, Math.min(n - 1, i));
      if (isBar) {
        bars.forEach(function (b) { b.el.classList.toggle("dim", b.i !== i); });
      } else {
        cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i));
        cross.setAttribute("visibility", "visible");
        dots.forEach(function (d, si) {
          d.setAttribute("cx", x(i)); d.setAttribute("cy", y(opts.series[si].data[i]));
          d.setAttribute("visibility", si === 0 ? "visible" : "hidden");
        });
      }
      var top = Math.min.apply(null, opts.series.map(function (s) { return y(s.data[i]); }));
      tip.innerHTML = "<b>" + esc(opts.labels[i]) + "</b>" + opts.series.map(function (s) {
        return "<div><span>" + esc(s.name) + "</span><span>" + esc(opts.format(s.data[i])) + "</span></div>";
      }).join("");
      var left = (x(i) / W) * rect.width;
      tip.style.left = Math.max(70, Math.min(rect.width - 70, left)) + "px";
      tip.style.top = (top / H) * rect.height + "px";
      tip.setAttribute("data-show", "");
    }

    function hide() {
      tip.removeAttribute("data-show");
      cross.setAttribute("visibility", "hidden");
      dots.forEach(function (d) { d.setAttribute("visibility", "hidden"); });
      bars.forEach(function (b) { b.el.classList.remove("dim"); });
    }

    hit.addEventListener("pointermove", function (e) { show(e.clientX); });
    hit.addEventListener("pointerleave", hide);
  }

  // Hovering a slice swaps the centre text to that slice's value and share
  function drawDonut(svg, W, H, opts) {
    var data = opts.series[0].data;
    var sum = data.reduce(function (a, b) { return a + b; }, 0) || 1;
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 4, r = R * 0.68;
    var centerLabel = opts.centerLabel || "Total";
    var slices = [];
    var a0 = -Math.PI / 2;
    var p = function (rad, a) { return (cx + rad * Math.cos(a)).toFixed(2) + " " + (cy + rad * Math.sin(a)).toFixed(2); };

    data.forEach(function (v, i) {
      var a1 = a0 + (v / sum) * Math.PI * 2;
      var large = a1 - a0 > Math.PI ? 1 : 0;
      var d = "M" + p(R, a0) + "A" + R + " " + R + " 0 " + large + " 1 " + p(R, a1) + "L" + p(r, a1) + "A" + r + " " + r + " 0 " + large + " 0 " + p(r, a0) + "Z";
      slices.push({ el: svgEl("path", { class: "slice", d: d, fill: shade(i) }, svg), v: v, i: i });
      a0 = a1;
    });

    var valueText = svgEl("text", { class: "donut-total", x: cx, y: cy + 4, "text-anchor": "middle" }, svg);
    var labelText = svgEl("text", { class: "donut-label", x: cx, y: cy + 22, "text-anchor": "middle" }, svg);
    function reset() {
      slices.forEach(function (s) { s.el.style.opacity = 1; });
      valueText.textContent = opts.format(sum);
      labelText.textContent = centerLabel;
    }
    slices.forEach(function (s) {
      s.el.addEventListener("pointerenter", function () {
        slices.forEach(function (o) { o.el.style.opacity = o === s ? 1 : 0.35; });
        valueText.textContent = opts.format(s.v);
        labelText.textContent = opts.labels[s.i] + " · " + Math.round((s.v / sum) * 100) + "%";
      });
      s.el.addEventListener("pointerleave", reset);
    });
    reset();
  }

  function compact(v) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v);
  }

  function sparkline(el, values) {
    if (typeof el === "string") el = document.querySelector(el);
    var W = 88, H = 28;
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    var span = max - min || 1;
    var pts = values.map(function (v, i) { return [(i / (values.length - 1)) * W, H - 2 - ((v - min) / span) * (H - 4)]; });
    el.innerHTML = '<svg class="oxp-sparkline" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true"><path d="' + smoothPath(pts) + '"/></svg>';
  }

  /* =========================================================
     Data table
     ========================================================= */
  function DataTable(el, opts) {
    if (typeof el === "string") el = document.querySelector(el);
    opts = Object.assign({ columns: [], rows: [], pageSize: 8, selectable: false, searchable: true, searchPlaceholder: "Search…", empty: "No results.", actions: "" }, opts);
    var state = { query: "", sortKey: null, sortDir: 1, page: 0, selected: new Set() };
    var rows = opts.rows.map(function (r, i) { return Object.assign({ _id: r.id != null ? r.id : i }, r); });
    var tid = "oxp-t" + (++uid);

    el.innerHTML =
      '<div class="oxp-table-tools">' +
        (opts.searchable
          ? '<div class="ox-input-group"><svg class="ox-input-icon" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></g></svg>' +
            '<input class="ox-input" type="search" placeholder="' + esc(opts.searchPlaceholder) + '" aria-label="Search table" aria-controls="' + tid + '"></div>'
          : "<span></span>") +
        '<div class="ox-row oxp-table-actions"><span class="ox-muted oxp-selected-count" style="font-size:var(--ox-text-sm)" aria-live="polite"></span>' + opts.actions + "</div>" +
      "</div>" +
      '<div class="oxp-table-wrap"><table class="oxp-table" id="' + tid + '"><thead></thead><tbody></tbody></table></div>' +
      '<div class="oxp-table-foot"><span class="oxp-range" aria-live="polite"></span><div class="oxp-pager">' +
        '<button class="ox-btn ox-btn-outline ox-btn-sm" data-page="-1">Previous</button>' +
        '<button class="ox-btn ox-btn-outline ox-btn-sm" data-page="1">Next</button>' +
      "</div></div>";

    var thead = el.querySelector("thead"), tbody = el.querySelector("tbody");
    var search = el.querySelector('input[type="search"]');

    function visible() {
      var q = state.query.toLowerCase();
      var list = !q ? rows.slice() : rows.filter(function (r) {
        return opts.columns.some(function (c) { return String(r[c.key] == null ? "" : r[c.key]).toLowerCase().indexOf(q) !== -1; });
      });
      if (state.sortKey) {
        var col = opts.columns.filter(function (c) { return c.key === state.sortKey; })[0];
        var val = col.sortValue || function (r) { return r[col.key]; };
        list.sort(function (a, b) {
          var x = val(a), y = val(b);
          return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * state.sortDir;
        });
      }
      return list;
    }

    function renderHead() {
      thead.innerHTML = "<tr>" +
        (opts.selectable ? '<th class="check"><label class="ox-checkbox"><input type="checkbox" data-select-all aria-label="Select all rows on this page"></label></th>' : "") +
        opts.columns.map(function (c) {
          var cls = c.align === "right" ? ' class="num"' : "";
          var sort = state.sortKey === c.key ? (state.sortDir === 1 ? "ascending" : "descending") : "none";
          var inner = c.sortable === false ? esc(c.label) : '<button class="oxp-sort" data-sort="' + esc(c.key) + '">' + esc(c.label) + "</button>";
          return "<th" + cls + (c.sortable === false ? "" : ' aria-sort="' + sort + '"') + ">" + inner + "</th>";
        }).join("") + "</tr>";
    }

    function render() {
      var list = visible();
      var pages = Math.max(1, Math.ceil(list.length / opts.pageSize));
      state.page = Math.min(state.page, pages - 1);
      var start = state.page * opts.pageSize;
      var pageRows = list.slice(start, start + opts.pageSize);
      var cols = opts.columns.length + (opts.selectable ? 1 : 0);

      renderHead();
      tbody.innerHTML = pageRows.length ? pageRows.map(function (r) {
        var sel = state.selected.has(r._id);
        return '<tr data-id="' + esc(r._id) + '"' + (opts.selectable ? ' aria-selected="' + sel + '"' : "") + ">" +
          (opts.selectable ? '<td class="check"><label class="ox-checkbox"><input type="checkbox" data-select-row ' + (sel ? "checked" : "") + ' aria-label="Select row"></label></td>' : "") +
          opts.columns.map(function (c) {
            var v = c.render ? c.render(r) : esc(r[c.key] == null ? "" : r[c.key]);
            return "<td" + (c.align === "right" ? ' class="num"' : "") + ">" + v + "</td>";
          }).join("") + "</tr>";
      }).join("") : '<tr><td class="oxp-table-empty" colspan="' + cols + '">' + esc(opts.empty) + "</td></tr>";

      var all = thead.querySelector("[data-select-all]");
      if (all) {
        var onPage = pageRows.filter(function (r) { return state.selected.has(r._id); }).length;
        all.checked = pageRows.length > 0 && onPage === pageRows.length;
        all.indeterminate = onPage > 0 && onPage < pageRows.length;
      }
      el.querySelector(".oxp-range").textContent = list.length
        ? "Showing " + (start + 1) + "–" + (start + pageRows.length) + " of " + list.length
        : "0 results";
      el.querySelector('[data-page="-1"]').disabled = state.page === 0;
      el.querySelector('[data-page="1"]').disabled = state.page >= pages - 1;
      el.querySelector(".oxp-selected-count").textContent = state.selected.size ? state.selected.size + " selected" : "";
    }

    el.addEventListener("click", function (e) {
      var s = e.target.closest("[data-sort]");
      if (s) {
        var key = s.getAttribute("data-sort");
        if (state.sortKey === key) state.sortDir = -state.sortDir;
        else { state.sortKey = key; state.sortDir = 1; }
        render();
        el.querySelector('[data-sort="' + key + '"]').focus();
        return;
      }
      var p = e.target.closest("[data-page]");
      if (p) { state.page += Number(p.getAttribute("data-page")); render(); }
    });

    el.addEventListener("change", function (e) {
      if (e.target.matches("[data-select-row]")) {
        var id = e.target.closest("tr").getAttribute("data-id");
        var row = rows.filter(function (r) { return String(r._id) === id; })[0];
        if (e.target.checked) state.selected.add(row._id); else state.selected.delete(row._id);
      } else if (e.target.matches("[data-select-all]")) {
        var on = e.target.checked;
        tbody.querySelectorAll("tr[data-id]").forEach(function (tr) {
          var id2 = tr.getAttribute("data-id");
          var r2 = rows.filter(function (r) { return String(r._id) === id2; })[0];
          if (on) state.selected.add(r2._id); else state.selected.delete(r2._id);
        });
      } else return;
      render();
      if (opts.onSelect) opts.onSelect(api.getSelected());
    });

    if (search) {
      search.addEventListener("input", function () { state.query = search.value; state.page = 0; render(); });
    }

    var api = {
      setRows: function (next) {
        rows = next.map(function (r, i) { return Object.assign({ _id: r.id != null ? r.id : i }, r); });
        state.selected.clear();
        render();
      },
      getSelected: function () { return rows.filter(function (r) { return state.selected.has(r._id); }); },
      clearSelection: function () { state.selected.clear(); render(); },
      el: el
    };
    render();
    return api;
  }

  /* =========================================================
     Command menu
     ========================================================= */
  // Subsequence match: every query character in order. Earlier, consecutive hits score higher.
  function fuzzy(text, q) {
    if (!q) return { score: 0, marks: [] };
    var t = text.toLowerCase(), score = 0, last = -1, marks = [];
    for (var i = 0; i < q.length; i++) {
      var at = t.indexOf(q[i], last + 1);
      if (at === -1) return null;
      score += at === last + 1 ? 3 : 1;
      if (at === 0 || t[at - 1] === " ") score += 2;
      marks.push(at);
      last = at;
    }
    return { score: score - t.length * 0.01, marks: marks };
  }

  function highlight(text, marks) {
    var set = {};
    marks.forEach(function (m) { set[m] = true; });
    var out = "";
    for (var i = 0; i < text.length; i++) out += set[i] ? "<mark>" + esc(text[i]) + "</mark>" : esc(text[i]);
    return out;
  }

  function command(opts) {
    opts = Object.assign({ items: [], placeholder: "Type a command or search…", hotkey: true }, opts);
    var id = "oxp-cmd" + (++uid);
    var modal = document.createElement("div");
    modal.className = "ox-modal oxp-command";
    modal.id = id;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Command menu");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="ox-modal-dialog">' +
        '<div class="oxp-command-field"><svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></g></svg>' +
        '<input type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(opts.placeholder) + '" role="combobox" aria-expanded="true" aria-controls="' + id + '-list" aria-label="Command"><span class="ox-kbd">Esc</span></div>' +
        '<div class="oxp-command-list" id="' + id + '-list" role="listbox"></div>' +
        '<div class="oxp-command-foot"><span><span class="ox-kbd">↑</span><span class="ox-kbd">↓</span>Navigate</span><span><span class="ox-kbd">↵</span>Select</span></div>' +
      "</div>";
    document.body.appendChild(modal);
    if (document.body.classList.contains("ox") === false) modal.classList.add("ox");

    var input = modal.querySelector("input");
    var list = modal.querySelector(".oxp-command-list");
    var shown = [];
    var sel = 0;

    function render() {
      var q = input.value.trim().toLowerCase();
      shown = opts.items.map(function (item) {
        var m = fuzzy(item.label + (item.keywords ? " " + item.keywords : ""), q);
        return m && { item: item, score: m.score, marks: m.marks.filter(function (x) { return x < item.label.length; }) };
      }).filter(Boolean);
      if (q) shown.sort(function (a, b) { return b.score - a.score; });
      sel = 0;
      if (!shown.length) { list.innerHTML = '<div class="oxp-command-empty">No results for “' + esc(input.value) + "”</div>"; return; }
      var html = "", group = null;
      shown.forEach(function (s, i) {
        var g = q ? "Results" : s.item.group || "Commands";
        if (g !== group) { html += '<div class="oxp-command-group">' + esc(g) + "</div>"; group = g; }
        html += '<button class="oxp-command-item" role="option" id="' + id + "-o" + i + '" data-i="' + i + '" aria-selected="' + (i === 0) + '">' +
          (s.item.icon || "") + "<span>" + highlight(s.item.label, s.marks) + "</span>" +
          (s.item.hint ? '<span class="hint">' + esc(s.item.hint) + "</span>" : "") +
          (s.item.shortcut ? '<span class="ox-kbd">' + esc(s.item.shortcut) + "</span>" : "") + "</button>";
      });
      list.innerHTML = html;
      input.setAttribute("aria-activedescendant", id + "-o0");
    }

    function move(d) {
      if (!shown.length) return;
      sel = (sel + d + shown.length) % shown.length;
      list.querySelectorAll(".oxp-command-item").forEach(function (b, i) { b.setAttribute("aria-selected", String(i === sel)); });
      var cur = list.querySelector('[data-i="' + sel + '"]');
      cur.scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", cur.id);
    }

    function run(i) {
      var s = shown[i];
      if (!s) return;
      close();
      if (s.item.href) location.href = s.item.href;
      if (s.item.action) s.item.action();
    }

    function open() { input.value = ""; render(); global.Onyx.modal.open(id); setTimeout(function () { input.focus(); }, 70); }
    function close() { global.Onyx.modal.close(id); }

    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); run(sel); }
    });
    list.addEventListener("click", function (e) {
      var b = e.target.closest(".oxp-command-item");
      if (b) run(Number(b.getAttribute("data-i")));
    });
    list.addEventListener("pointermove", function (e) {
      var b = e.target.closest(".oxp-command-item");
      if (b && Number(b.getAttribute("data-i")) !== sel) move(Number(b.getAttribute("data-i")) - sel);
    });
    if (opts.hotkey) {
      document.addEventListener("keydown", function (e) {
        if (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          if (modal.getAttribute("data-open") === "true") close(); else open();
        }
      });
    }
    return { open: open, close: close, setItems: function (items) { opts.items = items; render(); } };
  }

  /* =========================================================
     Dropzone and app shell (auto-initialised)
     ========================================================= */
  function formatBytes(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  }

  function showFiles(zone, files) {
    var target = zone.getAttribute("data-oxp-files");
    var listEl = target && document.querySelector(target);
    if (listEl) {
      listEl.innerHTML = Array.prototype.map.call(files, function (f) {
        return '<li><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 1.5H4.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5Z"/><path d="M9 1.5V5h3.5"/></svg><span>' + esc(f.name) + "</span><small>" + formatBytes(f.size) + "</small></li>";
      }).join("");
    }
    zone.dispatchEvent(new CustomEvent("oxp:files", { bubbles: true, detail: { files: files } }));
  }

  document.addEventListener("change", function (e) {
    var zone = e.target.closest && e.target.closest(".oxp-dropzone");
    if (zone && e.target.type === "file") showFiles(zone, e.target.files);
  });
  ["dragenter", "dragover"].forEach(function (t) {
    document.addEventListener(t, function (e) {
      var zone = e.target.closest && e.target.closest(".oxp-dropzone");
      if (zone) zone.setAttribute("data-dragging", "");
    });
  });
  ["dragleave", "drop"].forEach(function (t) {
    document.addEventListener(t, function (e) {
      var zone = e.target.closest && e.target.closest(".oxp-dropzone");
      if (zone) zone.removeAttribute("data-dragging");
    });
  });

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest("[data-oxp-shell-toggle]");
    var shell = document.querySelector(".oxp-shell");
    if (!shell) return;
    if (toggle) {
      if (shell.hasAttribute("data-nav-open")) shell.removeAttribute("data-nav-open");
      else shell.setAttribute("data-nav-open", "");
    } else if (shell.hasAttribute("data-nav-open") && !e.target.closest(".oxp-shell-nav")) {
      shell.removeAttribute("data-nav-open");
    }
  });

  global.OnyxPro = {
    version: "1.0.0",
    chart: chart,
    sparkline: sparkline,
    DataTable: DataTable,
    command: command
  };
})(window);
