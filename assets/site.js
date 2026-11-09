/* Shared header and footer for the Onyx site's inner pages.
   Put <header data-site-header></header> and <footer data-site-footer></footer> in the page,
   and data-page="components|studio|changelog" on <body> to highlight the current link. */
(function () {
  "use strict";

  var LINKS = [
    { href: "/components/", label: "Components", page: "components" },
    { href: "/blocks/", label: "Blocks", page: "blocks" },
    { href: "/studio/", label: "Theme Studio", page: "studio" },
    { href: "/docs/", label: "Docs", page: "docs" },
    { href: "/#pricing", label: "Pricing", page: "pricing" },
    { href: "/changelog/", label: "Changelog", page: "changelog" }
  ];
  var current = document.body.getAttribute("data-page");
  var link = function (l) { return '<a href="' + l.href + '"' + (l.page === current ? ' aria-current="page"' : "") + ">" + l.label + "</a>"; };

  var header = document.querySelector("[data-site-header]");
  if (header) {
    header.outerHTML =
      '<nav class="ox-navbar" data-collapse="lg" aria-label="Main">' +
        '<div class="ox-container ox-navbar-inner">' +
          '<a href="/" class="site-logo" aria-label="Onyx home"><i aria-hidden="true"></i>Onyx</a>' +
          '<div class="ox-navbar-links">' + LINKS.map(link).join("") + "</div>" +
          '<div class="ox-row" style="gap:var(--ox-space-1);flex-wrap:nowrap">' +
            '<a href="https://github.com/codewithanshuman/Onyx" class="ox-btn ox-btn-ghost ox-btn-sm ox-btn-icon site-nav-gh" aria-label="GitHub" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg></a>' +
            '<button class="ox-btn ox-btn-ghost ox-btn-sm ox-btn-icon" data-ox-theme-toggle aria-label="Toggle theme">' +
              '<svg class="icon-moon" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>' +
              '<svg class="icon-sun" viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1"/></g></svg>' +
            "</button>" +
            '<a href="/#pricing" class="ox-btn ox-btn-sm ox-btn-pill site-nav-pro" style="margin-left:var(--ox-space-2)">Get Pro</a>' +
            '<button class="ox-navbar-toggle" data-ox-nav-toggle aria-expanded="false" aria-controls="site-menu" aria-label="Open menu"><span></span><span></span></button>' +
          "</div>" +
        "</div>" +
        '<div class="ox-navbar-menu" id="site-menu">' + LINKS.map(link).join("") +
          '<a href="https://github.com/codewithanshuman/Onyx" target="_blank" rel="noopener">GitHub</a>' +
          '<a href="/#pricing" class="ox-btn ox-btn-lg ox-btn-pill ox-btn-block">Get Onyx Pro</a>' +
        "</div>" +
      "</nav>";
  }

  var footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.outerHTML =
      '<footer class="site-footer"><div class="ox-container">' +
        '<div class="site-foot">' +
          '<div><a href="/" class="site-logo"><i aria-hidden="true"></i>Onyx</a>' +
            '<p class="ox-muted" style="font-size:var(--ox-text-sm);max-width:30ch;margin:var(--ox-space-3) 0 0">A black &amp; white component library for people who care about the details.</p></div>' +
          '<div><h2 class="site-foot-title">Product</h2><ul><li><a href="/components/">Components</a></li><li><a href="/blocks/">Blocks</a></li><li><a href="/studio/">Theme Studio</a></li><li><a href="/#pricing">Pricing</a></li><li><a href="/changelog/">Changelog</a></li></ul></div>' +
          '<div><h2 class="site-foot-title">Developers</h2><ul><li><a href="/docs/">Documentation</a></li><li><a href="/docs/#/react">React</a></li><li><a href="https://www.npmjs.com/package/@onyxdesign/core" target="_blank" rel="noopener">npm</a></li><li><a href="https://github.com/codewithanshuman/Onyx" target="_blank" rel="noopener">GitHub</a></li></ul></div>' +
          '<div><h2 class="site-foot-title">Company</h2><ul><li><a href="/#faq">FAQ</a></li><li><a href="https://github.com/codewithanshuman/Onyx/blob/main/LICENSE" target="_blank" rel="noopener">License</a></li></ul></div>' +
        "</div>" +
        '<div class="site-foot-bottom"><span>© 2026 Onyx UI</span><span>Core MIT · Pro commercial license</span></div>' +
      "</div></footer>";
  }

  // Keep the navbar border in sync now that it exists
  window.dispatchEvent(new Event("scroll"));
})();
