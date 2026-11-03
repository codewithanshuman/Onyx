/*!
 * Nuvra UI v0.1.0 — interactive behaviors
 * Zero dependencies. Works via data attributes, or the window.Nuvra API.
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
    if (first) setTimeout(function () { first.focus(); }, 50);
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

  /* ---------- Dropdown ---------- */
  function closeAllDropdowns(except) {
    document.querySelectorAll('.nv-dropdown[data-open="true"]').forEach(function (d) {
      if (d !== except) {
        d.setAttribute("data-open", "false");
        var trigger = d.querySelector("[data-nv-dropdown-toggle]");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Toast ---------- */
  function toast(message, opts) {
    opts = opts || {};
    var region = document.querySelector(".nv-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "nv-toast-region nv";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    var el = document.createElement("div");
    el.className = "nv-toast" + (opts.variant ? " nv-toast-" + opts.variant : "");
    el.setAttribute("role", "status");
    el.textContent = message;
    region.appendChild(el);
    setTimeout(function () {
      el.setAttribute("data-leaving", "");
      el.addEventListener("animationend", function () { el.remove(); });
    }, opts.duration || 3000);
    return el;
  }

  /* ---------- Theme ---------- */
  var THEME_KEY = "nuvra-theme";

  function currentTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return global.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
  }

  function restoreTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved) document.documentElement.setAttribute("data-theme", saved);
    } catch (e) { /* storage unavailable */ }
  }

  /* ---------- Event delegation ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;

    var opener = t.closest("[data-nv-modal-open]");
    if (opener) { openModal(opener.getAttribute("data-nv-modal-open")); return; }

    var closer = t.closest("[data-nv-modal-close]");
    if (closer) { closeModal(closer.closest(".nv-modal")); return; }

    if (t.classList && t.classList.contains("nv-modal")) { closeModal(t); return; }

    var tab = t.closest('[role="tab"]');
    if (tab) { selectTab(tab); return; }

    var ddToggle = t.closest("[data-nv-dropdown-toggle]");
    if (ddToggle) {
      var dd = ddToggle.closest(".nv-dropdown");
      var open = dd.getAttribute("data-open") === "true";
      closeAllDropdowns(dd);
      dd.setAttribute("data-open", String(!open));
      ddToggle.setAttribute("aria-expanded", String(!open));
      return;
    }
    if (!t.closest(".nv-dropdown-menu")) closeAllDropdowns();

    var toaster = t.closest("[data-nv-toast]");
    if (toaster) toast(toaster.getAttribute("data-nv-toast"), { variant: toaster.getAttribute("data-nv-toast-variant") });

    if (t.closest("[data-nv-theme-toggle]")) setTheme(currentTheme() === "dark" ? "light" : "dark");
  });

  document.addEventListener("keydown", function (e) {
    var openModalEl = document.querySelector('.nv-modal[data-open="true"]');
    if (e.key === "Escape") {
      if (openModalEl) closeModal(openModalEl);
      closeAllDropdowns();
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

  restoreTheme();

  global.Nuvra = {
    version: "0.1.0",
    modal: { open: openModal, close: closeModal },
    toast: toast,
    theme: { get: currentTheme, set: setTheme }
  };
})(window);
