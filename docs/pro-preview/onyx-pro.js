/*! Onyx Pro v1.1.1 — PREVIEW BUILD for the Onyx documentation only.
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
      if (!shown.length) { list.innerHTML = '<div class="oxp-command-empty" role="option" aria-disabled="true" aria-selected="false">No results for “' + esc(input.value) + "”</div>"; input.removeAttribute("aria-activedescendant"); return; }
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

  /* =========================================================
     Shared helpers for popovers
     ========================================================= */
  function $(el) { return typeof el === "string" ? document.querySelector(el) : el; }

  // Close a popover on outside pointerdown; returns a function that removes the listener
  function onOutside(root, close) {
    function handler(e) { if (!root.contains(e.target)) close(); }
    document.addEventListener("pointerdown", handler, true);
    return function () { document.removeEventListener("pointerdown", handler, true); };
  }

  // Open below the anchor, or above it when there isn't room
  function place(pop, anchor, height) {
    var r = anchor.getBoundingClientRect();
    var above = r.bottom + height + 12 > global.innerHeight && r.top > height + 12;
    pop.style.top = above ? "auto" : "calc(100% + 6px)";
    pop.style.bottom = above ? "calc(100% + 6px)" : "auto";
  }

  /* =========================================================
     Calendar & date picker
     ========================================================= */
  var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
  function iso(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function parseISO(s) {
    if (!s) return null;
    if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
    var p = String(s).split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function addMonths(d, n) {
    var t = new Date(d.getFullYear(), d.getMonth() + n, 1);
    var last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
  }

  function calendar(el, opts) {
    el = $(el);
    opts = Object.assign({ range: false, weekStart: 0, locale: undefined, min: null, max: null, disabled: null, onSelect: null }, opts);
    if (opts.weekStart == null) opts.weekStart = 0; // the date picker passes undefined when not set
    var min = parseISO(opts.min), max = parseISO(opts.max);
    var today = parseISO(new Date());
    var start = null, end = null, hover = null;
    if (opts.range && Array.isArray(opts.value)) { start = parseISO(opts.value[0]); end = parseISO(opts.value[1]); }
    else if (!opts.range) start = parseISO(opts.value);
    var focus = start || today;
    var id = "oxp-cal" + (++uid);

    el.classList.add("oxp-calendar");
    el.innerHTML =
      '<div class="oxp-cal-head">' +
        '<button type="button" class="ox-btn ox-btn-ghost ox-btn-sm ox-btn-icon" data-nav="-1" aria-label="Previous month">‹</button>' +
        '<div class="oxp-cal-title" id="' + id + '-title" aria-live="polite"></div>' +
        '<button type="button" class="ox-btn ox-btn-ghost ox-btn-sm ox-btn-icon" data-nav="1" aria-label="Next month">›</button>' +
      "</div>" +
      '<div class="oxp-cal-grid" role="grid" aria-labelledby="' + id + '-title"></div>';
    var grid = el.querySelector(".oxp-cal-grid");
    var title = el.querySelector(".oxp-cal-title");
    var dowFmt = new Intl.DateTimeFormat(opts.locale, { weekday: "short" });
    var longFmt = new Intl.DateTimeFormat(opts.locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

    function isDisabled(d) {
      return (min && d < min) || (max && d > max) || (opts.disabled && opts.disabled(d));
    }
    function same(a, b) { return !!(a && b) && a.getTime() === b.getTime(); }

    function render(focusAfter) {
      var first = new Date(focus.getFullYear(), focus.getMonth(), 1);
      var lead = (first.getDay() - opts.weekStart + 7) % 7;
      var cursor = addDays(first, -lead);
      title.textContent = new Intl.DateTimeFormat(opts.locale, { month: "long", year: "numeric" }).format(first);
      var rangeEnd = end || (opts.range && start && hover && hover > start ? hover : null);
      // Rows are display: contents, so the 7-column grid layout is unchanged but screen readers hear weeks
      var html = '<div role="row">';
      for (var w = 0; w < 7; w++) {
        var dow = addDays(cursor, w);
        html += '<div class="oxp-cal-dow" role="columnheader" aria-label="' + esc(new Intl.DateTimeFormat(opts.locale, { weekday: "long" }).format(dow)) + '">' + esc(dowFmt.format(dow).slice(0, 2)) + "</div>";
      }
      html += "</div>";
      for (var i = 0; i < 42; i++) {
        if (i % 7 === 0) html += (i ? "</div>" : "") + '<div role="row">';
        var d = addDays(cursor, i);
        var selected = same(d, start) || same(d, end);
        var inRange = opts.range && start && rangeEnd && d > start && d < rangeEnd;
        html += '<button type="button" role="gridcell" class="oxp-day" data-date="' + iso(d) + '"' +
          ' tabindex="' + (same(d, focus) ? 0 : -1) + '"' +
          ' aria-label="' + esc(longFmt.format(d)) + '"' +
          ' aria-selected="' + selected + '"' +
          (same(d, today) ? ' aria-current="date"' : "") +
          (d.getMonth() !== first.getMonth() ? " data-outside" : "") +
          (inRange ? " data-in-range" : "") +
          (isDisabled(d) ? " disabled" : "") + ">" + d.getDate() + "</button>";
      }
      grid.innerHTML = html + "</div>";
      if (focusAfter) grid.querySelector('[tabindex="0"]').focus();
    }

    function select(d) {
      if (isDisabled(d)) return;
      focus = d;
      if (!opts.range) { start = d; render(true); if (opts.onSelect) opts.onSelect(iso(d)); return; }
      if (!start || end || d < start) { start = d; end = null; }
      else { end = d; }
      render(true);
      if (opts.onSelect) opts.onSelect(end ? [iso(start), iso(end)] : [iso(start), null]);
    }

    el.addEventListener("click", function (e) {
      var nav = e.target.closest("[data-nav]");
      if (nav) { focus = addMonths(focus, +nav.getAttribute("data-nav")); render(); return; }
      var day = e.target.closest(".oxp-day");
      if (day) select(parseISO(day.getAttribute("data-date")));
    });
    grid.addEventListener("pointerover", function (e) {
      if (!opts.range || !start || end) return;
      var day = e.target.closest(".oxp-day");
      if (!day) return;
      hover = parseISO(day.getAttribute("data-date"));
      grid.querySelectorAll(".oxp-day").forEach(function (b) {
        var d = parseISO(b.getAttribute("data-date"));
        b.toggleAttribute("data-in-range", d > start && d < hover);
      });
    });
    grid.addEventListener("keydown", function (e) {
      var moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      var next = null;
      if (moves[e.key]) next = addDays(focus, moves[e.key]);
      else if (e.key === "PageUp") next = addMonths(focus, e.shiftKey ? -12 : -1);
      else if (e.key === "PageDown") next = addMonths(focus, e.shiftKey ? 12 : 1);
      else if (e.key === "Home") next = addDays(focus, -((focus.getDay() - opts.weekStart + 7) % 7));
      else if (e.key === "End") next = addDays(focus, 6 - ((focus.getDay() - opts.weekStart + 7) % 7));
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(focus); return; }
      if (!next) return;
      e.preventDefault();
      focus = next;
      render(true);
    });

    render();
    return {
      el: el,
      getValue: function () { return opts.range ? [start && iso(start), end && iso(end)] : start && iso(start); },
      setValue: function (v) {
        if (opts.range) { start = parseISO(v && v[0]); end = parseISO(v && v[1]); }
        else start = parseISO(v);
        focus = start || today;
        render();
      },
      focus: function () { render(true); }
    };
  }

  function datepicker(input, opts) {
    input = $(input);
    opts = Object.assign({ range: false, locale: undefined, placeholder: opts && opts.range ? "Pick a date range" : "Pick a date", onChange: null }, opts);
    var fmt = new Intl.DateTimeFormat(opts.locale, { month: "short", day: "numeric", year: "numeric" });
    var wrap = document.createElement("span");
    wrap.className = "oxp-anchor";
    wrap.style.display = "block";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    input.classList.add("oxp-date-input");
    input.readOnly = true;
    input.placeholder = input.placeholder || opts.placeholder;
    // A read-only field that opens a dialog is a combobox, which is what allows aria-expanded on it
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-haspopup", "dialog");
    input.setAttribute("aria-expanded", "false");

    var pop = document.createElement("div");
    pop.className = "oxp-popover";
    pop.hidden = true;
    pop.id = "oxp-dp" + (++uid);
    pop.setAttribute("role", "dialog");
    input.setAttribute("aria-controls", pop.id);
    pop.setAttribute("aria-label", opts.range ? "Choose dates" : "Choose a date");
    pop.innerHTML = '<div></div><div class="oxp-cal-foot"><button type="button" class="ox-btn ox-btn-ghost ox-btn-sm" data-act="clear">Clear</button><button type="button" class="ox-btn ox-btn-outline ox-btn-sm" data-act="today">Today</button></div>';
    wrap.appendChild(pop);
    var stopOutside = null;

    function show(value) {
      if (opts.range) {
        var a = value && value[0] && parseISO(value[0]), b = value && value[1] && parseISO(value[1]);
        input.value = a ? fmt.format(a) + " – " + (b ? fmt.format(b) : "…") : "";
        input.dataset.value = a && b ? value[0] + "/" + value[1] : "";
      } else {
        input.value = value ? fmt.format(parseISO(value)) : "";
        input.dataset.value = value || "";
      }
    }

    var cal = calendar(pop.firstChild, {
      range: opts.range, weekStart: opts.weekStart, locale: opts.locale, min: opts.min, max: opts.max, disabled: opts.disabled, value: opts.value,
      onSelect: function (v) {
        show(v);
        var done = !opts.range || v[1];
        if (done) {
          close(true);
          input.dispatchEvent(new Event("change", { bubbles: true }));
          if (opts.onChange) opts.onChange(v);
        }
      }
    });
    show(opts.value);

    function open() {
      if (!pop.hidden) return;
      place(pop, input, 360);
      pop.hidden = false;
      input.setAttribute("aria-expanded", "true");
      cal.focus();
      stopOutside = onOutside(wrap, function () { close(false); });
    }
    function close(refocus) {
      if (pop.hidden) return;
      pop.hidden = true;
      input.setAttribute("aria-expanded", "false");
      if (stopOutside) stopOutside();
      if (refocus) input.focus();
    }

    input.addEventListener("click", open);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); open(); }
    });
    pop.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(true); }
    });
    pop.addEventListener("click", function (e) {
      var act = e.target.closest("[data-act]");
      if (!act) return;
      if (act.getAttribute("data-act") === "clear") {
        cal.setValue(null); show(null); close(true);
        input.dispatchEvent(new Event("change", { bubbles: true }));
        if (opts.onChange) opts.onChange(opts.range ? [null, null] : null);
      } else {
        var t = iso(parseISO(new Date()));
        if (opts.range) { cal.setValue([t, null]); show([t, null]); cal.focus(); }
        else { cal.setValue(t); show(t); close(true); input.dispatchEvent(new Event("change", { bubbles: true })); if (opts.onChange) opts.onChange(t); }
      }
    });

    return { getValue: cal.getValue, setValue: function (v) { cal.setValue(v); show(v); }, open: open, close: close, input: input };
  }

  /* =========================================================
     Combobox: searchable select, multi-select and tag input
     ========================================================= */
  function combobox(el, opts) {
    el = $(el);
    opts = Object.assign({ options: [], multiple: false, creatable: false, placeholder: "Select…", label: "", onChange: null, max: Infinity }, opts);
    var options = opts.options.map(function (o) { return typeof o === "string" ? { value: o, label: o } : o; });
    var value = opts.multiple ? (opts.value || []).slice() : (opts.value == null ? null : opts.value);
    var id = "oxp-cb" + (++uid);
    var active = -1, shown = [], stopOutside = null;

    el.classList.add("oxp-anchor");
    el.innerHTML =
      '<div class="oxp-combo-control">' +
        '<input type="text" role="combobox" autocomplete="off" spellcheck="false" aria-autocomplete="list" aria-expanded="false" aria-controls="' + id + '-list"' +
          (opts.label ? ' aria-label="' + esc(opts.label) + '"' : "") + ">" +
      "</div>" +
      '<svg class="oxp-combo-caret" viewBox="0 0 10 10" aria-hidden="true"><path d="m2 3.5 3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<div class="oxp-popover oxp-listbox" id="' + id + '-list" role="listbox"' + (opts.multiple ? ' aria-multiselectable="true"' : "") + " hidden></div>";
    var control = el.querySelector(".oxp-combo-control");
    var input = el.querySelector("input");
    var list = el.querySelector(".oxp-listbox");
    if (opts.inputId) input.id = opts.inputId;

    function labelOf(v) {
      var o = options.filter(function (x) { return x.value === v; })[0];
      return o ? o.label : v;
    }
    function isSelected(v) { return opts.multiple ? value.indexOf(v) !== -1 : value === v; }

    function renderTags() {
      control.querySelectorAll(".oxp-tag").forEach(function (t) { t.remove(); });
      if (!opts.multiple) {
        input.placeholder = opts.placeholder;
        if (document.activeElement !== input) input.value = value == null ? "" : labelOf(value);
        return;
      }
      value.forEach(function (v) {
        var tag = document.createElement("span");
        tag.className = "oxp-tag";
        tag.innerHTML = esc(labelOf(v)) + '<button type="button" aria-label="Remove ' + esc(labelOf(v)) + '" data-remove="' + esc(v) + '">×</button>';
        control.insertBefore(tag, input);
      });
      input.placeholder = value.length ? "" : opts.placeholder;
    }

    function filter() {
      var q = input.value.trim().toLowerCase();
      // In single mode, showing the selected label in the input shouldn't hide the other options
      if (!opts.multiple && value != null && input.value === labelOf(value)) q = "";
      shown = options.filter(function (o) { return !q || o.label.toLowerCase().indexOf(q) !== -1; }).map(function (o) {
        var at = q ? o.label.toLowerCase().indexOf(q) : -1;
        return { o: o, html: at < 0 ? esc(o.label) : esc(o.label.slice(0, at)) + "<mark>" + esc(o.label.slice(at, at + q.length)) + "</mark>" + esc(o.label.slice(at + q.length)) };
      });
      var exact = options.some(function (o) { return o.label.toLowerCase() === q; });
      if (opts.creatable && q && !exact) shown.push({ create: input.value.trim(), html: "Create “" + esc(input.value.trim()) + "”" });
      active = shown.length ? Math.max(0, Math.min(active, shown.length - 1)) : -1;
      if (active < 0 && shown.length) active = 0;
      list.innerHTML = shown.length ? shown.map(function (s, i) {
        var sel = s.o ? isSelected(s.o.value) : false;
        return '<div class="oxp-option" role="option" id="' + id + "-o" + i + '" data-i="' + i + '" aria-selected="' + sel + '"' + (i === active ? " data-active" : "") + ">" +
          '<svg class="check" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "<span>" + s.html + "</span>" + (s.o && s.o.hint ? '<span class="hint">' + esc(s.o.hint) + "</span>" : "") + "</div>";
      }).join("") : '<div class="oxp-option-empty" role="option" aria-disabled="true" aria-selected="false">' + (opts.creatable ? "Type to add" : "No matches") + "</div>";
      if (active >= 0) input.setAttribute("aria-activedescendant", id + "-o" + active);
      else input.removeAttribute("aria-activedescendant");
    }

    function open() {
      if (!list.hidden) return;
      place(list, control, 260);
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      filter();
      stopOutside = onOutside(el, close);
    }
    function close() {
      if (list.hidden) return;
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      if (stopOutside) stopOutside();
      if (opts.multiple) input.value = "";
      else input.value = value == null ? "" : labelOf(value);
    }

    function emit() {
      renderTags();
      el.dispatchEvent(new CustomEvent("oxp:change", { bubbles: true, detail: { value: opts.multiple ? value.slice() : value } }));
      if (opts.onChange) opts.onChange(opts.multiple ? value.slice() : value);
    }

    function choose(i) {
      var s = shown[i];
      if (!s) return;
      var v;
      if (s.create) {
        v = s.create;
        if (!options.some(function (o) { return o.value === v; })) options.push({ value: v, label: v });
      } else v = s.o.value;
      if (opts.multiple) {
        var at = value.indexOf(v);
        if (at === -1) { if (value.length < opts.max) value.push(v); }
        else value.splice(at, 1);
        input.value = "";
        emit();
        filter();
      } else {
        value = v;
        emit();
        close();
      }
    }

    function move(d) {
      if (!shown.length) return;
      active = (active + d + shown.length) % shown.length;
      list.querySelectorAll(".oxp-option").forEach(function (o, i) { o.toggleAttribute("data-active", i === active); });
      var cur = list.querySelector('[data-i="' + active + '"]');
      cur.scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", cur.id);
    }

    control.addEventListener("click", function (e) {
      var rm = e.target.closest("[data-remove]");
      if (rm) {
        value.splice(value.indexOf(rm.getAttribute("data-remove")), 1);
        emit();
        if (!list.hidden) filter();
        input.focus();
        return;
      }
      input.focus();
      open();
    });
    input.addEventListener("focus", function () { if (!opts.multiple && value != null) input.select(); });
    input.addEventListener("input", function () { open(); active = 0; filter(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); if (list.hidden) open(); else move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (list.hidden) open(); else move(-1); }
      else if (e.key === "Enter") { if (!list.hidden && active >= 0) { e.preventDefault(); choose(active); } }
      else if (e.key === "Escape") { if (!list.hidden) { e.preventDefault(); e.stopPropagation(); close(); } }
      else if (e.key === "Tab") close();
      else if (e.key === "," && opts.multiple && opts.creatable && input.value.trim()) {
        e.preventDefault();
        filter();
        var match = shown.findIndex(function (s) { return s.create || (s.o && s.o.label.toLowerCase() === input.value.trim().toLowerCase()); });
        if (match >= 0) choose(match);
      } else if (e.key === "Backspace" && opts.multiple && !input.value && value.length) {
        value.pop();
        emit();
        if (!list.hidden) filter();
      }
    });
    list.addEventListener("pointerdown", function (e) { e.preventDefault(); }); // keep focus in the input
    list.addEventListener("click", function (e) {
      var o = e.target.closest(".oxp-option");
      if (o) choose(+o.getAttribute("data-i"));
    });

    renderTags();
    return {
      el: el,
      input: input,
      getValue: function () { return opts.multiple ? value.slice() : value; },
      setValue: function (v) { value = opts.multiple ? (v || []).slice() : v; renderTags(); },
      setOptions: function (o) { options = o.map(function (x) { return typeof x === "string" ? { value: x, label: x } : x; }); if (!list.hidden) filter(); }
    };
  }

  /* =========================================================
     Code input (one-time passcodes)
     ========================================================= */
  function otp(el, opts) {
    el = $(el);
    opts = Object.assign({ length: 6, separator: 3, label: "Verification code", onComplete: null, numeric: true }, opts);
    el.classList.add("oxp-otp");
    el.setAttribute("role", "group");
    el.setAttribute("aria-label", opts.label);
    var html = "";
    for (var i = 0; i < opts.length; i++) {
      if (opts.separator && i === opts.separator) html += '<span class="oxp-otp-sep" aria-hidden="true"></span>';
      html += '<input type="text" inputmode="' + (opts.numeric ? "numeric" : "text") + '" maxlength="1" placeholder=" "' +
        (i === 0 ? ' autocomplete="one-time-code"' : ' autocomplete="off"') +
        ' aria-label="Character ' + (i + 1) + " of " + opts.length + '">';
    }
    el.innerHTML = html;
    var inputs = Array.prototype.slice.call(el.querySelectorAll("input"));
    var allowed = opts.numeric ? /\d/ : /[A-Za-z0-9]/;

    function code() { return inputs.map(function (i) { return i.value; }).join(""); }
    function check() {
      el.removeAttribute("data-state");
      var c = code();
      if (c.length === opts.length) {
        el.dispatchEvent(new CustomEvent("oxp:complete", { bubbles: true, detail: { code: c } }));
        if (opts.onComplete) opts.onComplete(c);
      }
    }
    // Spread several characters (paste or SMS autofill) across the boxes starting at index
    function fill(from, text) {
      var chars = String(text).split("").filter(function (c) { return allowed.test(c); });
      if (!chars.length) return false;
      for (var i = 0; i < chars.length && from + i < inputs.length; i++) inputs[from + i].value = opts.numeric ? chars[i] : chars[i].toUpperCase();
      inputs[Math.min(from + chars.length, inputs.length - 1)].focus();
      check();
      return true;
    }

    inputs.forEach(function (input, i) {
      input.addEventListener("input", function () {
        var v = input.value;
        input.value = "";
        if (!fill(i, v)) return;
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !input.value && i > 0) { e.preventDefault(); inputs[i - 1].value = ""; inputs[i - 1].focus(); el.removeAttribute("data-state"); }
        else if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); inputs[i - 1].focus(); }
        else if (e.key === "ArrowRight" && i < inputs.length - 1) { e.preventDefault(); inputs[i + 1].focus(); }
      });
      input.addEventListener("paste", function (e) {
        e.preventDefault();
        fill(i, (e.clipboardData || global.clipboardData).getData("text"));
      });
      input.addEventListener("focus", function () { input.select(); });
    });

    return {
      el: el,
      getValue: code,
      clear: function () { inputs.forEach(function (i) { i.value = ""; }); el.removeAttribute("data-state"); inputs[0].focus(); },
      setState: function (s) {
        el.removeAttribute("data-state");
        void el.offsetWidth; // restart the shake animation
        if (s) el.setAttribute("data-state", s);
      },
      focus: function () { inputs[0].focus(); }
    };
  }

  /* =========================================================
     Task board (kanban) with pointer and keyboard dragging
     ========================================================= */
  function kanban(el, opts) {
    el = $(el);
    opts = Object.assign({ columns: [], renderCard: null, onMove: null }, opts);
    var cards = {};
    el.classList.add("oxp-board");
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", opts.label || "Task board");

    function cardHTML(c) {
      var body = opts.renderCard ? opts.renderCard(c) :
        "<div>" + esc(c.title) + "</div>" +
        (c.tag || c.assignee ? '<div class="oxp-card-meta">' + (c.tag ? '<span class="ox-badge ox-badge-outline">' + esc(c.tag) + "</span>" : "<span></span>") +
          (c.assignee ? '<span class="ox-avatar ox-avatar-sm">' + esc(c.assignee) + "</span>" : "") + "</div>" : "");
      return '<div class="oxp-card" tabindex="0" role="listitem" data-id="' + esc(c.id) + '" aria-roledescription="draggable card" aria-describedby="' + el.id + '-help">' + body + "</div>";
    }

    if (!el.id) el.id = "oxp-kb" + (++uid);
    el.innerHTML = opts.columns.map(function (col) {
      col.cards.forEach(function (c) { cards[c.id] = c; });
      return '<section class="oxp-col" data-col="' + esc(col.id) + '" aria-label="' + esc(col.title) + '">' +
        '<div class="oxp-col-head">' + esc(col.title) + "<span>" + col.cards.length + "</span></div>" +
        '<div class="oxp-col-list" role="list">' + col.cards.map(cardHTML).join("") + "</div></section>";
    }).join("") +
      '<p class="ox-sr-only" id="' + el.id + '-help">Press Space to pick up. Use arrow keys to move, Space to drop, Escape to cancel.</p>' +
      '<div class="ox-sr-only" aria-live="assertive" data-live></div>';
    var live = el.querySelector("[data-live]");

    function say(t) { live.textContent = t; }
    function colOf(card) { return card.closest(".oxp-col"); }
    function titleOf(col) { return col.getAttribute("aria-label"); }
    function counts() { el.querySelectorAll(".oxp-col").forEach(function (c) { c.querySelector(".oxp-col-head span").textContent = c.querySelectorAll(".oxp-card").length; }); }
    function positionOf(card) { return Array.prototype.indexOf.call(card.parentNode.querySelectorAll(".oxp-card"), card); }
    function commit(card, from, fromIndex) {
      counts();
      var to = colOf(card), index = positionOf(card);
      if (to === from && index === fromIndex) return;
      say(cards[card.dataset.id].title + " moved to " + titleOf(to) + ", position " + (index + 1) + ".");
      var detail = { card: cards[card.dataset.id], from: from.dataset.col, to: to.dataset.col, index: index };
      el.dispatchEvent(new CustomEvent("oxp:move", { bubbles: true, detail: detail }));
      if (opts.onMove) opts.onMove(detail);
    }

    // ---- Pointer dragging ----
    var drag = null;
    el.addEventListener("pointerdown", function (e) {
      var card = e.target.closest(".oxp-card");
      if (!card || e.button !== 0) return;
      drag = { card: card, x: e.clientX, y: e.clientY, started: false, from: colOf(card), fromIndex: positionOf(card), next: card.nextSibling };
    });
    document.addEventListener("pointermove", function (e) {
      if (!drag) return;
      if (!drag.started) {
        if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 6) return;
        var r = drag.card.getBoundingClientRect();
        drag.started = true;
        drag.dx = drag.x - r.left;
        drag.dy = drag.y - r.top;
        drag.ghost = drag.card.cloneNode(true);
        drag.ghost.classList.add("oxp-card-ghost");
        drag.ghost.style.width = r.width + "px";
        document.body.appendChild(drag.ghost);
        drag.ph = document.createElement("div");
        drag.ph.className = "oxp-card-placeholder";
        drag.ph.style.height = r.height + "px";
        drag.card.parentNode.insertBefore(drag.ph, drag.card);
        drag.card.style.display = "none";
        document.body.classList.add("oxp-dragging");
      }
      drag.ghost.style.left = e.clientX - drag.dx + "px";
      drag.ghost.style.top = e.clientY - drag.dy + "px";
      var under = document.elementFromPoint(e.clientX, e.clientY);
      var col = under && under.closest && under.closest(".oxp-col");
      el.querySelectorAll(".oxp-col").forEach(function (c) { c.toggleAttribute("data-over", c === col); });
      if (!col || !el.contains(col)) return;
      var listEl = col.querySelector(".oxp-col-list");
      var before = Array.prototype.filter.call(listEl.querySelectorAll(".oxp-card"), function (c) { return c !== drag.card; })
        .filter(function (c) { var b = c.getBoundingClientRect(); return e.clientY < b.top + b.height / 2; })[0];
      if (before) listEl.insertBefore(drag.ph, before); else listEl.appendChild(drag.ph);
    });
    function endDrag(cancel) {
      if (!drag) return;
      var d = drag;
      drag = null;
      if (!d.started) return;
      d.ghost.remove();
      document.body.classList.remove("oxp-dragging");
      el.querySelectorAll(".oxp-col").forEach(function (c) { c.removeAttribute("data-over"); });
      d.card.style.display = "";
      if (cancel) { d.ph.remove(); return; }
      d.ph.parentNode.insertBefore(d.card, d.ph);
      d.ph.remove();
      commit(d.card, d.from, d.fromIndex);
    }
    document.addEventListener("pointerup", function () { endDrag(false); });
    document.addEventListener("pointercancel", function () { endDrag(true); });

    // ---- Keyboard dragging ----
    var held = null;
    el.addEventListener("keydown", function (e) {
      var card = e.target.closest && e.target.closest(".oxp-card");
      if (!card) return;
      if (drag && e.key === "Escape") { endDrag(true); return; }
      if (!held) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          held = { card: card, from: colOf(card), fromIndex: positionOf(card), next: card.nextSibling, parent: card.parentNode };
          card.setAttribute("aria-grabbed", "true");
          say("Picked up " + cards[card.dataset.id].title + ". Use arrow keys to move, Space to drop, Escape to cancel.");
        }
        return;
      }
      var listEl = card.parentNode, cols = Array.prototype.slice.call(el.querySelectorAll(".oxp-col"));
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        var sib = e.key === "ArrowUp" ? card.previousElementSibling : card.nextElementSibling;
        if (sib && sib.classList.contains("oxp-card")) listEl.insertBefore(card, e.key === "ArrowUp" ? sib : sib.nextSibling);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        var target = cols[cols.indexOf(colOf(card)) + (e.key === "ArrowLeft" ? -1 : 1)];
        if (target) {
          var tl = target.querySelector(".oxp-col-list");
          var at = tl.querySelectorAll(".oxp-card")[positionOf(card)];
          tl.insertBefore(card, at || null);
        }
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        card.removeAttribute("aria-grabbed");
        var h = held; held = null;
        commit(card, h.from, h.fromIndex);
        if (colOf(card) === h.from && positionOf(card) === h.fromIndex) say("Dropped " + cards[card.dataset.id].title + " in its original place.");
      } else if (e.key === "Escape") {
        e.preventDefault();
        card.removeAttribute("aria-grabbed");
        held.parent.insertBefore(card, held.next && held.next.parentNode === held.parent ? held.next : null);
        held = null;
        say("Move cancelled.");
      } else return;
      card.focus();
      if (held) say(titleOf(colOf(card)) + ", position " + (positionOf(card) + 1) + ".");
    });

    return {
      el: el,
      getColumns: function () {
        return Array.prototype.map.call(el.querySelectorAll(".oxp-col"), function (c) {
          return { id: c.dataset.col, cards: Array.prototype.map.call(c.querySelectorAll(".oxp-card"), function (k) { return cards[k.dataset.id]; }) };
        });
      }
    };
  }

  /* =========================================================
     Rich toasts: title, description, actions, loading → done
     ========================================================= */
  var ICONS = { success: "✓", error: "!", info: "i", loading: "" };

  function richToast(o) {
    if (typeof o === "string") o = { title: o };
    var region = document.querySelector(".ox-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "ox-toast-region ox";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    var t = document.createElement("div");
    t.className = "oxp-toast";
    region.appendChild(t);
    var timer = null, remaining = 0, startedAt = 0, current = {};

    function render(next) {
      current = Object.assign({ variant: "success", duration: 4000 }, next);
      if (current.variant === "loading") current.duration = Infinity;
      t.setAttribute("data-variant", current.variant);
      t.setAttribute("role", current.variant === "error" ? "alert" : "status");
      t.innerHTML =
        (current.variant in ICONS ? '<span class="oxp-toast-icon" aria-hidden="true">' + ICONS[current.variant] + "</span>" : "") +
        '<div class="oxp-toast-body"><div class="oxp-toast-title">' + esc(current.title || "") + "</div>" +
          (current.description ? '<div class="oxp-toast-desc">' + esc(current.description) + "</div>" : "") +
          (current.action || current.cancel ? '<div class="oxp-toast-actions">' +
            (current.action ? '<button type="button" class="ox-btn ox-btn-sm" data-act="action">' + esc(current.action.label) + "</button>" : "") +
            (current.cancel ? '<button type="button" class="ox-btn ox-btn-ghost ox-btn-sm" data-act="cancel">' + esc(current.cancel.label || "Cancel") + "</button>" : "") +
          "</div>" : "") +
        "</div>" +
        (current.variant === "loading" ? "" : '<button type="button" class="oxp-toast-close" aria-label="Dismiss">×</button>');
      remaining = current.duration;
      start();
    }
    function start() {
      clearTimeout(timer);
      if (remaining === Infinity) return;
      startedAt = Date.now();
      timer = setTimeout(dismiss, remaining);
    }
    function pause() {
      if (remaining === Infinity) return;
      clearTimeout(timer);
      remaining = Math.max(800, remaining - (Date.now() - startedAt));
    }
    function dismiss() {
      clearTimeout(timer);
      if (t.hasAttribute("data-leaving")) return;
      t.setAttribute("data-leaving", "");
      var gone = function () { t.remove(); };
      t.addEventListener("animationend", gone);
      setTimeout(gone, 400); // in case animations are paused (hidden tab)
    }

    // Hovering or focusing a toast pauses its timer, so people can read it and reach the buttons
    t.addEventListener("pointerenter", pause);
    t.addEventListener("pointerleave", start);
    t.addEventListener("focusin", pause);
    t.addEventListener("focusout", start);
    t.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var act = b.getAttribute("data-act");
      if (act === "action" && current.action.onClick) current.action.onClick();
      if (act === "cancel" && current.cancel.onClick) current.cancel.onClick();
      dismiss();
    });

    render(o);
    return { update: render, dismiss: dismiss, el: t };
  }

  // Shows a loading toast that turns into success or error when the promise settles
  richToast.promise = function (promise, msgs) {
    var t = richToast({ variant: "loading", title: msgs.loading || "Working…" });
    var pick = function (m, arg) { return typeof m === "function" ? m(arg) : m; };
    var asOpts = function (m) { return typeof m === "string" ? { title: m } : m; };
    return Promise.resolve(promise).then(function (res) {
      t.update(Object.assign({ variant: "success" }, asOpts(pick(msgs.success, res))));
      return res;
    }, function (err) {
      t.update(Object.assign({ variant: "error" }, asOpts(pick(msgs.error, err))));
      throw err;
    });
  };

  global.OnyxPro = {
    version: "1.1.0",
    chart: chart,
    sparkline: sparkline,
    DataTable: DataTable,
    command: command,
    calendar: calendar,
    datepicker: datepicker,
    combobox: combobox,
    otp: otp,
    kanban: kanban,
    toast: richToast
  };
})(window);
