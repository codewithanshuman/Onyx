/*!
 * Onyx v1.1.1 — interactive behaviors
 * Zero dependencies. Works via data attributes, or the window.Onyx API.
 */
(function (global) {
  "use strict";

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  /* ---------- Modal ---------- */
  var lastFocused = null;

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.setAttribute("data-open", "true");
    modal.setAttribute("aria-hidden", "false");
    var first = modal.querySelector(FOCUSABLE);
    if (first) setTimeout(function () { first.focus(); }, 60);
  }

  function closeModal(modal) {
    if (typeof modal === "string") modal = document.getElementById(modal);
    if (!modal) return;
    modal.setAttribute("data-open", "false");
    modal.setAttribute("aria-hidden", "true");
    if (lastFocused) lastFocused.focus();
  }

  function trapFocus(modal, e) {
    var items = modal.querySelectorAll(FOCUSABLE);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Tabs ---------- */
  function selectTab(tab) {
    var list = tab.closest('[role="tablist"]');
    if (!list) return;
    list.querySelectorAll('[role="tab"]').forEach(function (t) {
      var selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
  }

  /* ---------- Segmented control ---------- */
  function pressSegment(btn) {
    var group = btn.closest(".ox-segmented");
    group.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === btn));
    });
    group.dispatchEvent(new CustomEvent("ox:change", { bubbles: true, detail: { value: btn.value || btn.textContent.trim() } }));
  }

  /* ---------- Dropdown ---------- */
  function closeAllDropdowns(except) {
    document.querySelectorAll('.ox-dropdown[data-open="true"]').forEach(function (d) {
      if (d !== except) {
        d.setAttribute("data-open", "false");
        var trigger = d.querySelector("[data-ox-dropdown-toggle]");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Toast ---------- */
  function toast(message, opts) {
    opts = opts || {};
    var region = document.querySelector(".ox-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "ox-toast-region ox";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    var el = document.createElement("div");
    el.className = "ox-toast";
    el.setAttribute("role", "status");
    el.textContent = message;
    region.appendChild(el);
    setTimeout(function () {
      el.setAttribute("data-leaving", "");
      el.addEventListener("animationend", function () { el.remove(); });
    }, opts.duration || 2800);
    return el;
  }

  /* ---------- Copy ---------- */
  function copy(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
    toast("Copied to clipboard");
  }

  /* ---------- Theme ---------- */
  var THEME_KEY = "onyx-theme";

  function currentTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return global.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
  }

  // With a point ({ x, y }), the new theme spreads out from it like ink, where the browser supports it
  function setTheme(theme, from) {
    var reduce = global.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!from || reduce || !document.startViewTransition) { applyTheme(theme); return; }
    var r = Math.hypot(Math.max(from.x, innerWidth - from.x), Math.max(from.y, innerHeight - from.y));
    var vt = document.startViewTransition(function () { applyTheme(theme); });
    vt.ready.then(function () {
      document.documentElement.animate(
        { clipPath: ["circle(0px at " + from.x + "px " + from.y + "px)", "circle(" + r + "px at " + from.x + "px " + from.y + "px)"] },
        { duration: 520, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () {});
  }

  function restoreTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved) document.documentElement.setAttribute("data-theme", saved);
    } catch (e) { /* storage unavailable */ }
  }

  /* ---------- Navbar border on scroll ---------- */
  function syncNavbars() {
    var scrolled = String(global.scrollY > 4);
    document.querySelectorAll(".ox-navbar").forEach(function (n) { n.setAttribute("data-scrolled", scrolled); });
  }

  /* ---------- Mobile navigation menu ---------- */
  function setNav(nav, open) {
    if (!nav) return;
    nav.setAttribute("data-open", String(open));
    var toggle = nav.querySelector("[data-ox-nav-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    document.body.classList.toggle("ox-nav-locked", open);
  }

  /* ---------- Range slider fill ---------- */
  function syncRange(r) {
    var min = +r.min || 0, max = r.max === "" ? 100 : +r.max;
    r.style.setProperty("--_pct", ((+r.value - min) / (max - min || 1)) * 100 + "%");
  }

  /* ---------- Number stepper ---------- */
  function step(btn) {
    var box = btn.closest(".ox-stepper");
    var input = box.querySelector("input");
    var by = +btn.getAttribute("data-step") * (+input.step || 1);
    var min = input.min === "" ? -Infinity : +input.min;
    var max = input.max === "" ? Infinity : +input.max;
    var next = Math.min(max, Math.max(min, (+input.value || 0) + by));
    input.value = +next.toFixed(6);
    syncStepper(box);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function syncStepper(box) {
    var input = box.querySelector("input");
    var v = +input.value;
    box.querySelectorAll("[data-step]").forEach(function (b) {
      var dir = +b.getAttribute("data-step");
      b.disabled = dir < 0 ? input.min !== "" && v <= +input.min : input.max !== "" && v >= +input.max;
    });
  }

  /* ---------- Chips ---------- */
  function toggleChip(chip) {
    var group = chip.closest(".ox-chips");
    var on = chip.getAttribute("aria-pressed") !== "true";
    if (group && group.hasAttribute("data-single")) {
      group.querySelectorAll(".ox-chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      on = true;
    }
    chip.setAttribute("aria-pressed", String(on));
    if (group) {
      var values = Array.prototype.filter.call(group.querySelectorAll(".ox-chip"), function (c) { return c.getAttribute("aria-pressed") === "true"; })
        .map(function (c) { return c.value || c.textContent.trim(); });
      group.dispatchEvent(new CustomEvent("ox:change", { bubbles: true, detail: { value: values } }));
    }
  }

  function initWidgets(root) {
    (root || document).querySelectorAll(".ox-range").forEach(syncRange);
    (root || document).querySelectorAll(".ox-stepper").forEach(syncStepper);
    // Banners dismissed before stay hidden
    (root || document).querySelectorAll(".ox-banner[data-ox-banner]").forEach(function (b) {
      try { if (localStorage.getItem("ox-banner-" + b.getAttribute("data-ox-banner"))) b.hidden = true; } catch (e) { /* storage unavailable */ }
    });
  }

  /* ---------- Event delegation ---------- */
  document.addEventListener("input", function (e) {
    if (e.target.classList && e.target.classList.contains("ox-range")) syncRange(e.target);
    var box = e.target.closest && e.target.closest(".ox-stepper");
    if (box) syncStepper(box);
  });

  document.addEventListener("click", function (e) {
    var t = e.target;

    var navToggle = t.closest("[data-ox-nav-toggle]");
    if (navToggle) { var nav = navToggle.closest(".ox-navbar"); setNav(nav, nav.getAttribute("data-open") !== "true"); return; }
    if (t.closest(".ox-navbar-menu a")) setNav(t.closest(".ox-navbar"), false);

    var stepBtn = t.closest(".ox-stepper [data-step]");
    if (stepBtn) { step(stepBtn); return; }

    var chip = t.closest(".ox-chip");
    if (chip) { toggleChip(chip); return; }

    var dismiss = t.closest("[data-ox-dismiss]");
    if (dismiss) {
      var banner = dismiss.closest(".ox-banner");
      if (banner) {
        banner.hidden = true;
        try { if (banner.getAttribute("data-ox-banner")) localStorage.setItem("ox-banner-" + banner.getAttribute("data-ox-banner"), "1"); } catch (err) { /* storage unavailable */ }
      }
      return;
    }

    var opener = t.closest("[data-ox-modal-open]");
    if (opener) { openModal(opener.getAttribute("data-ox-modal-open")); return; }

    var closer = t.closest("[data-ox-modal-close]");
    if (closer) closeModal(closer.closest(".ox-modal"));

    if (t.classList && t.classList.contains("ox-modal")) { closeModal(t); return; }

    var tab = t.closest('[role="tab"]');
    if (tab) { selectTab(tab); return; }

    var seg = t.closest(".ox-segmented button");
    if (seg) { pressSegment(seg); return; }

    var ddToggle = t.closest("[data-ox-dropdown-toggle]");
    if (ddToggle) {
      var dd = ddToggle.closest(".ox-dropdown");
      var open = dd.getAttribute("data-open") === "true";
      closeAllDropdowns(dd);
      dd.setAttribute("data-open", String(!open));
      ddToggle.setAttribute("aria-expanded", String(!open));
      return;
    }
    if (!t.closest(".ox-dropdown-menu") || t.closest(".ox-dropdown-item")) closeAllDropdowns();

    var copier = t.closest("[data-ox-copy]");
    if (copier) copy(copier.getAttribute("data-ox-copy"));

    var toaster = t.closest("[data-ox-toast]");
    if (toaster) toast(toaster.getAttribute("data-ox-toast"));

    var themeBtn = t.closest("[data-ox-theme-toggle]");
    if (themeBtn) {
      var r = themeBtn.getBoundingClientRect();
      setTheme(currentTheme() === "dark" ? "light" : "dark", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  });

  document.addEventListener("keydown", function (e) {
    var openModalEl = document.querySelector('.ox-modal[data-open="true"]');
    if (e.key === "Escape") {
      if (openModalEl) closeModal(openModalEl);
      closeAllDropdowns();
      var openNav = document.querySelector('.ox-navbar[data-open="true"]');
      if (openNav) { setNav(openNav, false); var tg = openNav.querySelector("[data-ox-nav-toggle]"); if (tg) tg.focus(); }
    }
    if (e.key === "Tab" && openModalEl) trapFocus(openModalEl, e);

    // Arrow-key navigation between tabs
    var tab = e.target.closest && e.target.closest('[role="tab"]');
    if (tab && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      var tabs = Array.prototype.slice.call(tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
      var i = tabs.indexOf(tab) + (e.key === "ArrowRight" ? 1 : -1);
      var next = tabs[(i + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    }
  });

  global.addEventListener("scroll", syncNavbars, { passive: true });
  // Close the mobile menu if the window grows past the breakpoint while it's open
  global.addEventListener("resize", function () {
    document.querySelectorAll('.ox-navbar[data-open="true"]').forEach(function (n) {
      var toggle = n.querySelector("[data-ox-nav-toggle]");
      if (toggle && getComputedStyle(toggle).display === "none") setNav(n, false);
    });
  });
  document.addEventListener("DOMContentLoaded", function () { syncNavbars(); initWidgets(); });
  if (document.readyState !== "loading") initWidgets();
  restoreTheme();

  global.Onyx = {
    version: "1.1.1",
    modal: { open: openModal, close: closeModal },
    toast: toast,
    copy: copy,
    theme: { get: currentTheme, set: setTheme },
    nav: { open: function (n) { setNav(n || document.querySelector(".ox-navbar"), true); }, close: function (n) { setNav(n || document.querySelector(".ox-navbar"), false); } },
    init: initWidgets
  };
})(window);
