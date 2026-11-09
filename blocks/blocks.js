/* Onyx Blocks: ready-made page sections built only from Onyx classes.
   Each block is self-contained HTML: its own scoped <style>, and a <script> when it has behaviour.
   Paste it into any page that loads onyx.css and onyx.js (Pro blocks also need onyx-pro.css and .js). */
(function () {
  "use strict";

  var icon = function (d) {
    return '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  };
  var I = {
    bolt: icon('<path d="M11 2 4 11h5l-1 7 7-9h-5l1-7Z"/>'),
    moon: icon('<path d="M16 11.5A6.5 6.5 0 0 1 8.5 4 6.5 6.5 0 1 0 16 11.5Z"/>'),
    shield: icon('<path d="M10 2 4 4.5v5c0 4 2.6 6.9 6 8.5 3.4-1.6 6-4.5 6-8.5v-5L10 2Z"/><path d="m7.5 10 1.8 1.8L13 8"/>'),
    grid: icon('<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/>'),
    type: icon('<path d="M4 5V3.5h12V5M10 3.5v13M7.5 16.5h5"/>'),
    phone: icon('<rect x="5.5" y="2" width="9" height="16" rx="2"/><path d="M9 15h2"/>'),
    check: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8.5 3.2 3L13 4.5"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
    mail: icon('<rect x="2.5" y="4" width="15" height="12" rx="2"/><path d="m3 5 7 6 7-6"/>'),
    pin: icon('<path d="M10 18s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z"/><circle cx="10" cy="8" r="2"/>'),
    chat: icon('<path d="M3.5 4.5h13v9h-7l-4 3v-3h-2v-9Z"/>')
  };
  var gh = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>';
  var logo = '<span class="b-logo" aria-hidden="true"></span>';
  // Every block that shows the brand mark shares this tiny rule
  var logoCss = ".b-logo { display: inline-block; width: 1.1rem; height: 1.1rem; border-radius: 50%; background: var(--ox-fg); box-shadow: inset -0.3rem -0.2rem 0 0 var(--ox-bg-muted); }";

  var BLOCKS = [
    /* =================== Marketing =================== */
    {
      id: "navbar", name: "Navbar", category: "Marketing",
      minHeight: 460, // room for the phone menu when it opens
      description: "Sticky top bar with links, a call to action, and a full-screen menu on phones.",
      html: `<nav class="ox-navbar" data-collapse="md" aria-label="Primary">
  <style>${logoCss}
    .b-nav-brand { display: inline-flex; align-items: center; gap: var(--ox-space-2); font-weight: 600; letter-spacing: -0.02em; color: var(--ox-fg); text-decoration: none; }
  </style>
  <div class="ox-container ox-navbar-inner">
    <a href="#" class="b-nav-brand">${logo}Lumen</a>
    <div class="ox-navbar-links">
      <a href="#" aria-current="page">Product</a>
      <a href="#">Customers</a>
      <a href="#">Pricing</a>
      <a href="#">Docs</a>
    </div>
    <div class="ox-row" style="gap: var(--ox-space-2); flex-wrap: nowrap">
      <a href="#" class="ox-btn ox-btn-ghost ox-btn-sm">Sign in</a>
      <a href="#" class="ox-btn ox-btn-sm ox-btn-pill">Get started</a>
      <button class="ox-navbar-toggle" data-ox-nav-toggle aria-expanded="false" aria-controls="b-nav-menu" aria-label="Open menu"><span></span><span></span></button>
    </div>
  </div>
  <div class="ox-navbar-menu" id="b-nav-menu">
    <a href="#">Product</a>
    <a href="#">Customers</a>
    <a href="#">Pricing</a>
    <a href="#">Docs</a>
    <a href="#" class="ox-btn ox-btn-lg ox-btn-pill ox-btn-block">Get started</a>
  </div>
</nav>`
    },
    {
      id: "hero-centered", name: "Hero, centred", category: "Marketing",
      description: "Big headline, short pitch, two actions and social proof. The page's first impression.",
      html: `<section class="b-hero">
  <style>
    .b-hero { position: relative; padding: clamp(4rem, 12vw, 8rem) 0; text-align: center; overflow: hidden; }
    .b-hero::before { content: ""; position: absolute; inset: 0; z-index: -1; background-image: radial-gradient(var(--ox-border) 1px, transparent 1px); background-size: 22px 22px; -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 70%); mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 70%); }
    .b-hero .ox-container { display: grid; justify-items: center; gap: var(--ox-space-6); }
    .b-hero h1 { max-width: 15ch; margin: 0; font-size: clamp(2.4rem, 7vw, 4.5rem); font-weight: 600; line-height: 1; letter-spacing: -0.05em; }
    .b-hero .ox-lead { max-width: 50ch; margin: 0; }
    .b-hero-proof { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: var(--ox-space-3); font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
  </style>
  <div class="ox-container">
    <a class="ox-badge ox-badge-outline" href="#">New · Lumen 2.0 is here ${I.arrow}</a>
    <h1>Ship interfaces that feel finished.</h1>
    <p class="ox-lead">Lumen turns rough ideas into production screens in an afternoon: components, layouts and themes that already agree with each other.</p>
    <div class="ox-row" style="justify-content: center">
      <a class="ox-btn ox-btn-lg ox-btn-pill" href="#">Start for free</a>
      <a class="ox-btn ox-btn-lg ox-btn-pill ox-btn-outline" href="#">Book a demo</a>
    </div>
    <div class="b-hero-proof">
      <div class="ox-avatar-stack"><span class="ox-avatar ox-avatar-sm">AL</span><span class="ox-avatar ox-avatar-sm">GH</span><span class="ox-avatar ox-avatar-sm ox-avatar-solid">KJ</span><span class="ox-avatar ox-avatar-sm">MH</span></div>
      <span>Used by 12,000+ product teams</span>
    </div>
  </div>
</section>`
    },
    {
      id: "hero-split", name: "Hero with product shot", category: "Marketing",
      description: "Pitch on the left, a live-looking product window on the right. Stacks on phones.",
      html: `<section class="b-split">
  <style>
    .b-split { padding: clamp(3.5rem, 9vw, 6.5rem) 0; }
    .b-split .ox-container { display: grid; gap: clamp(2.5rem, 6vw, 4rem); grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); align-items: center; }
    .b-split h1 { margin: var(--ox-space-4) 0; font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 600; line-height: 1.02; letter-spacing: -0.045em; }
    .b-split .ox-lead { margin: 0 0 var(--ox-space-8); max-width: 44ch; }
    .b-split ul { display: grid; gap: var(--ox-space-2); margin: var(--ox-space-8) 0 0; padding: 0; list-style: none; font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    .b-split li { display: flex; align-items: center; gap: var(--ox-space-2); }
    .b-split li svg { color: var(--ox-fg); }
    .b-window { border: 1px solid var(--ox-border); border-radius: var(--ox-radius-xl); background: var(--ox-surface); box-shadow: var(--ox-shadow-lg); overflow: hidden; }
    .b-window-bar { display: flex; gap: 6px; padding: 0.75rem 1rem; border-bottom: 1px solid var(--ox-border); background: var(--ox-bg-subtle); }
    .b-window-bar i { width: 10px; height: 10px; border-radius: 50%; background: var(--ox-border-strong); }
    .b-window-body { display: grid; gap: var(--ox-space-4); padding: var(--ox-space-6); }
    .b-kpis { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--ox-space-3); }
    .b-kpi { padding: var(--ox-space-4); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-lg); }
    .b-kpi span { display: block; font-size: var(--ox-text-xs); color: var(--ox-fg-muted); }
    .b-kpi b { display: block; margin-top: 2px; font-size: var(--ox-text-xl); letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
    .b-bars { display: flex; align-items: flex-end; gap: 6px; height: 120px; padding: var(--ox-space-4); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-lg); }
    .b-bars i { flex: 1; border-radius: 3px 3px 0 0; background: var(--ox-fg); }
    .b-bars i:nth-child(odd) { background: var(--ox-border-strong); }
    @media (max-width: 860px) { .b-split .ox-container { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 420px) { .b-kpis { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } .b-kpi:last-child { display: none; } }
  </style>
  <div class="ox-container">
    <div>
      <span class="ox-badge ox-badge-dot ox-badge-live">Live analytics</span>
      <h1>Know what changed, the minute it changes.</h1>
      <p class="ox-lead">Connect your product once. Lumen watches every signup, upgrade and cancellation, and tells you why the numbers moved.</p>
      <div class="ox-row">
        <a class="ox-btn ox-btn-lg" href="#">Try it free</a>
        <a class="ox-btn ox-btn-lg ox-btn-ghost" href="#">See how it works ${I.arrow}</a>
      </div>
      <ul>
        <li>${I.check}Set up in under five minutes</li>
        <li>${I.check}No credit card for the first 14 days</li>
      </ul>
    </div>
    <div class="b-window" role="img" aria-label="Lumen dashboard showing revenue, active users and churn">
      <div class="b-window-bar"><i></i><i></i><i></i></div>
      <div class="b-window-body">
        <div class="b-kpis">
          <div class="b-kpi"><span>Revenue</span><b>$48.2k</b></div>
          <div class="b-kpi"><span>Active users</span><b>9,312</b></div>
          <div class="b-kpi"><span>Churn</span><b>1.8%</b></div>
        </div>
        <div class="b-bars"><i style="height:38%"></i><i style="height:52%"></i><i style="height:45%"></i><i style="height:63%"></i><i style="height:58%"></i><i style="height:74%"></i><i style="height:69%"></i><i style="height:86%"></i><i style="height:80%"></i><i style="height:96%"></i></div>
        <div class="ox-skeleton" style="height: 10px; width: 70%"></div>
        <div class="ox-skeleton" style="height: 10px; width: 45%"></div>
      </div>
    </div>
  </div>
</section>`
    },
    {
      id: "logo-cloud", name: "Logo cloud", category: "Marketing",
      description: "A quiet row of customer wordmarks under the hero. Swap the text for your SVG logos.",
      html: `<section class="b-logos" aria-labelledby="b-logos-title">
  <style>
    .b-logos { padding: var(--ox-space-12) 0; border-block: 1px solid var(--ox-border); }
    .b-logos h2 { margin: 0 0 var(--ox-space-8); text-align: center; font-size: var(--ox-text-sm); font-weight: 500; color: var(--ox-fg-muted); }
    .b-logos ul { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: var(--ox-space-8) var(--ox-space-6); margin: 0; padding: 0; list-style: none; }
    .b-logos li { text-align: center; font-size: var(--ox-text-lg); font-weight: 600; letter-spacing: -0.03em; color: var(--ox-fg-muted); white-space: nowrap; }
    .b-logos li:nth-child(even) { font-family: var(--ox-font-mono); font-weight: 500; letter-spacing: 0; }
    @media (max-width: 860px) { .b-logos ul { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 420px) { .b-logos ul { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  </style>
  <div class="ox-container">
    <h2 id="b-logos-title">Trusted by teams at</h2>
    <ul>
      <li>Northwind</li><li>orbital</li><li>Halcyon</li><li>parallax</li><li>Monolith</li><li>kestrel</li>
    </ul>
  </div>
</section>`
    },
    {
      id: "features-grid", name: "Feature grid", category: "Marketing",
      description: "Six features with icons in a responsive grid: three, two, then one column.",
      html: `<section class="b-features" aria-labelledby="b-features-title">
  <style>
    .b-features { padding: clamp(4rem, 9vw, 6rem) 0; }
    .b-features header { max-width: 40rem; margin-bottom: var(--ox-space-12); }
    .b-features h2 { margin: var(--ox-space-3) 0; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600; line-height: 1.1; letter-spacing: -0.04em; }
    .b-features .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--ox-border); border-left: 1px solid var(--ox-border); }
    .b-features article { padding: var(--ox-space-8); border-right: 1px solid var(--ox-border); border-bottom: 1px solid var(--ox-border); }
    .b-features article span { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; margin-bottom: var(--ox-space-5); border: 1px solid var(--ox-border); border-radius: var(--ox-radius); background: var(--ox-bg-subtle); }
    .b-features h3 { margin: 0 0 var(--ox-space-2); font-size: var(--ox-text-base); font-weight: 600; letter-spacing: -0.01em; }
    .b-features p { margin: 0; font-size: var(--ox-text-sm); line-height: 1.6; color: var(--ox-fg-muted); }
    @media (max-width: 860px) { .b-features .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 560px) { .b-features .grid { grid-template-columns: minmax(0, 1fr); } .b-features article { padding: var(--ox-space-6); } }
  </style>
  <div class="ox-container">
    <header>
      <span class="ox-eyebrow">Why Lumen</span>
      <h2 id="b-features-title">Everything a polished product needs, nothing it doesn't.</h2>
      <p class="ox-lead" style="margin: 0">Opinionated defaults you can override one token at a time.</p>
    </header>
    <div class="grid">
      <article><span>${I.bolt}</span><h3>Fast by default</h3><p>Zero-dependency CSS under 30 KB. Pages paint before your fonts finish loading.</p></article>
      <article><span>${I.moon}</span><h3>Dark mode, done</h3><p>Every component is designed twice, so dark mode is a choice, not a cleanup project.</p></article>
      <article><span>${I.shield}</span><h3>Accessible</h3><p>Keyboard support, focus rings and WCAG AA contrast, checked automatically on every change.</p></article>
      <article><span>${I.grid}</span><h3>Composable</h3><p>Cards, stacks and grids snap together without one-off margins or overrides.</p></article>
      <article><span>${I.type}</span><h3>Typography first</h3><p>A tight type scale with tuned letter-spacing at every size, from captions to display.</p></article>
      <article><span>${I.phone}</span><h3>Every screen</h3><p>Layouts reflow from 320px phones to wide monitors, with larger touch targets on touch screens.</p></article>
    </div>
  </div>
</section>`
    },
    {
      id: "feature-split", name: "Feature with checklist", category: "Marketing",
      description: "One feature explained in depth: copy and checklist beside a tabbed preview.",
      html: `<section class="b-fsplit" aria-labelledby="b-fsplit-title">
  <style>
    .b-fsplit { padding: clamp(4rem, 9vw, 6rem) 0; }
    .b-fsplit .ox-container { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(2.5rem, 6vw, 5rem); align-items: center; }
    .b-fsplit h2 { margin: var(--ox-space-3) 0; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600; line-height: 1.1; letter-spacing: -0.04em; }
    .b-fsplit ul { display: grid; gap: var(--ox-space-4); margin: var(--ox-space-8) 0 0; padding: 0; list-style: none; }
    .b-fsplit li { display: grid; grid-template-columns: auto 1fr; gap: var(--ox-space-3); font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    .b-fsplit li b { display: block; color: var(--ox-fg); font-weight: 600; }
    .b-fsplit li > span { display: grid; place-items: center; width: 1.5rem; height: 1.5rem; border-radius: 50%; color: var(--ox-inverse); background: var(--ox-fg); }
    .b-fsplit .panel { padding: var(--ox-space-6); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-xl); background: var(--ox-bg-subtle); }
    .b-fsplit .ox-code { font-size: var(--ox-text-xs); }
    @media (max-width: 860px) { .b-fsplit .ox-container { grid-template-columns: minmax(0, 1fr); } }
  </style>
  <div class="ox-container">
    <div>
      <span class="ox-eyebrow">Theming</span>
      <h2 id="b-fsplit-title">Your brand in twelve tokens.</h2>
      <p class="ox-lead" style="margin: 0">Change a token and every component follows: buttons, focus rings, charts and shadows.</p>
      <ul>
        <li><span>${I.check}</span><div><b>One source of truth</b>Colors, radius, spacing and motion live in CSS variables.</div></li>
        <li><span>${I.check}</span><div><b>Scoped themes</b>Put data-theme on any element to theme just that part of the page.</div></li>
        <li><span>${I.check}</span><div><b>Export anywhere</b>Copy tokens as CSS, JSON or a Tailwind config.</div></li>
      </ul>
    </div>
    <div class="panel">
      <div>
        <div class="ox-tabs-list" role="tablist" aria-label="Theme format">
          <button class="ox-tab" role="tab" aria-selected="true" aria-controls="b-fs-css" id="b-fs-t1">CSS</button>
          <button class="ox-tab" role="tab" aria-selected="false" aria-controls="b-fs-json" id="b-fs-t2" tabindex="-1">JSON</button>
        </div>
        <div class="ox-tab-panel" role="tabpanel" id="b-fs-css" aria-labelledby="b-fs-t1">
<pre class="ox-code"><code>:root {
  --ox-fg: #0a0a0a;
  --ox-bg: #ffffff;
  --ox-radius: 8px;
  --ox-font-sans: "Geist", sans-serif;
}</code></pre>
        </div>
        <div class="ox-tab-panel" role="tabpanel" id="b-fs-json" aria-labelledby="b-fs-t2" hidden>
<pre class="ox-code"><code>{
  "fg": "#0a0a0a",
  "bg": "#ffffff",
  "radius": "8px",
  "fontSans": "Geist, sans-serif"
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</section>`
    },
    {
      id: "stats", name: "Stats", category: "Marketing",
      description: "Four headline numbers with context. Reads well inverted, as shown.",
      html: `<section class="b-stats ox-invert" aria-labelledby="b-stats-title">
  <style>
    .b-stats { padding: clamp(3.5rem, 8vw, 5.5rem) 0; color: var(--ox-fg); background: var(--ox-bg); }
    .b-stats h2 { max-width: 30ch; margin: 0 0 var(--ox-space-12); font-size: clamp(1.6rem, 3.5vw, 2.25rem); font-weight: 600; line-height: 1.15; letter-spacing: -0.035em; }
    .b-stats dl { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--ox-space-8); margin: 0; }
    .b-stats div { padding-top: var(--ox-space-5); border-top: 1px solid var(--ox-border-strong); }
    .b-stats dt { font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    .b-stats dd { order: -1; margin: 0 0 var(--ox-space-1); font-size: clamp(2.2rem, 5vw, 3.25rem); font-weight: 600; letter-spacing: -0.05em; font-variant-numeric: tabular-nums; }
    .b-stats div { display: flex; flex-direction: column; }
    @media (max-width: 860px) { .b-stats dl { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  </style>
  <div class="ox-container">
    <h2 id="b-stats-title">Teams ship faster from their first week on Lumen.</h2>
    <dl>
      <div><dt>Faster from design to production</dt><dd>3.4×</dd></div>
      <div><dt>Product teams</dt><dd>12k</dd></div>
      <div><dt>Uptime over the last year</dt><dd>99.99%</dd></div>
      <div><dt>Average setup time</dt><dd>4 min</dd></div>
    </dl>
  </div>
</section>`
    },
    {
      id: "testimonials", name: "Testimonials", category: "Marketing",
      description: "A featured quote plus three short ones. Real names and roles build trust.",
      html: `<section class="b-quotes" aria-labelledby="b-quotes-title">
  <style>
    .b-quotes { padding: clamp(4rem, 9vw, 6rem) 0; }
    .b-quotes h2 { margin: 0 0 var(--ox-space-10); text-align: center; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600; letter-spacing: -0.04em; }
    .b-quotes .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--ox-space-4); }
    .b-quotes figure { display: flex; flex-direction: column; gap: var(--ox-space-5); margin: 0; padding: var(--ox-space-6); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-lg); background: var(--ox-surface); }
    .b-quotes .lead { grid-column: 1 / -1; padding: clamp(1.5rem, 4vw, 2.5rem); background: var(--ox-bg-subtle); }
    .b-quotes blockquote { margin: 0; font-size: var(--ox-text-sm); line-height: 1.65; }
    .b-quotes .lead blockquote { font-size: clamp(1.15rem, 2.4vw, 1.5rem); line-height: 1.4; letter-spacing: -0.02em; }
    .b-quotes figcaption { display: flex; align-items: center; gap: var(--ox-space-3); margin-top: auto; font-size: var(--ox-text-sm); }
    .b-quotes figcaption div span { display: block; color: var(--ox-fg-muted); font-size: var(--ox-text-xs); }
    @media (max-width: 860px) { .b-quotes .grid { grid-template-columns: minmax(0, 1fr); } }
  </style>
  <div class="ox-container">
    <h2 id="b-quotes-title">Loved by people who sweat the details</h2>
    <div class="grid">
      <figure class="lead">
        <blockquote>“We replaced three internal component kits with Lumen in a month. Our designers stopped redlining buttons and started designing products again.”</blockquote>
        <figcaption><span class="ox-avatar ox-avatar-solid">MH</span><div><b>Margaret Hamilton</b><span>Head of Design, Northwind</span></div></figcaption>
      </figure>
      <figure>
        <blockquote>“Dark mode used to be a quarter-long project. Now it's a checkbox.”</blockquote>
        <figcaption><span class="ox-avatar">AL</span><div><b>Ada Lovelace</b><span>Engineer, Orbital</span></div></figcaption>
      </figure>
      <figure>
        <blockquote>“The accessibility work is real. Our audit came back clean on the first pass.”</blockquote>
        <figcaption><span class="ox-avatar">KJ</span><div><b>Katherine Johnson</b><span>Product Lead, Halcyon</span></div></figcaption>
      </figure>
      <figure>
        <blockquote>“Tiny, fast, and it looks expensive. That's the whole pitch.”</blockquote>
        <figcaption><span class="ox-avatar">GH</span><div><b>Grace Hopper</b><span>Founder, Kestrel</span></div></figcaption>
      </figure>
    </div>
  </div>
</section>`
    },
    {
      id: "pricing", name: "Pricing table", category: "Marketing",
      description: "Three plans with a working monthly/yearly switch. The featured plan is inverted.",
      html: `<section class="b-pricing" aria-labelledby="b-pricing-title">
  <style>
    .b-pricing { padding: clamp(4rem, 9vw, 6rem) 0; }
    .b-pricing header { display: grid; justify-items: center; gap: var(--ox-space-4); margin-bottom: var(--ox-space-10); text-align: center; }
    .b-pricing h2 { margin: 0; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600; letter-spacing: -0.04em; }
    .b-pricing .plans { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--ox-space-4); align-items: stretch; }
    .b-plan { display: flex; flex-direction: column; gap: var(--ox-space-5); padding: var(--ox-space-8); color: var(--ox-fg); background: var(--ox-surface); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-xl); }
    .b-plan.ox-invert { background: var(--ox-bg); box-shadow: var(--ox-shadow-lg); }
    .b-plan h3 { display: flex; align-items: center; justify-content: space-between; margin: 0; font-size: var(--ox-text-base); font-weight: 600; }
    .b-plan p { margin: 0; font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    .b-price { display: flex; align-items: baseline; gap: var(--ox-space-1); }
    .b-price b { font-size: 2.75rem; font-weight: 600; letter-spacing: -0.05em; font-variant-numeric: tabular-nums; }
    .b-price span { font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    .b-plan ul { display: grid; gap: var(--ox-space-3); margin: 0; padding: var(--ox-space-5) 0 0; list-style: none; border-top: 1px solid var(--ox-border); font-size: var(--ox-text-sm); }
    .b-plan li { display: flex; gap: var(--ox-space-2); }
    .b-plan .ox-btn { margin-top: auto; }
    @media (max-width: 900px) { .b-pricing .plans { grid-template-columns: minmax(0, 1fr); max-width: 28rem; margin-inline: auto; } }
  </style>
  <div class="ox-container">
    <header>
      <span class="ox-eyebrow">Pricing</span>
      <h2 id="b-pricing-title">Simple plans that grow with you</h2>
      <div class="ox-segmented" role="group" aria-label="Billing period" data-b-billing>
        <button type="button" value="monthly" aria-pressed="true">Monthly</button>
        <button type="button" value="yearly" aria-pressed="false">Yearly · save 20%</button>
      </div>
    </header>
    <div class="plans">
      <article class="b-plan">
        <h3>Starter</h3>
        <p>For side projects and trying things out.</p>
        <div class="b-price"><b data-monthly="$0" data-yearly="$0">$0</b><span>/ month</span></div>
        <ul><li>${I.check}3 projects</li><li>${I.check}All core components</li><li>${I.check}Community support</li></ul>
        <a href="#" class="ox-btn ox-btn-outline ox-btn-block">Start free</a>
      </article>
      <article class="b-plan ox-invert">
        <h3>Pro <span class="ox-badge ox-badge-solid">Popular</span></h3>
        <p>For freelancers and small teams shipping real products.</p>
        <div class="b-price"><b data-monthly="$19" data-yearly="$15">$19</b><span>/ month<span data-b-note hidden>, billed yearly</span></span></div>
        <ul><li>${I.check}Unlimited projects</li><li>${I.check}Pro components and templates</li><li>${I.check}Priority email support</li><li>${I.check}Figma kit</li></ul>
        <a href="#" class="ox-btn ox-btn-block">Get Pro</a>
      </article>
      <article class="b-plan">
        <h3>Team</h3>
        <p>For companies with a design system to maintain.</p>
        <div class="b-price"><b data-monthly="$49" data-yearly="$39">$49</b><span>/ month<span data-b-note hidden>, billed yearly</span></span></div>
        <ul><li>${I.check}Everything in Pro</li><li>${I.check}Up to 20 seats</li><li>${I.check}Shared themes</li><li>${I.check}SSO and audit log</li></ul>
        <a href="#" class="ox-btn ox-btn-outline ox-btn-block">Contact sales</a>
      </article>
    </div>
  </div>
  <script>
    // onyx.js marks the pressed button and fires ox:change; swap every price to match
    document.querySelectorAll("[data-b-billing]").forEach(function (seg) {
      var root = seg.closest(".b-pricing");
      seg.addEventListener("ox:change", function (e) {
        var period = e.detail.value;
        root.querySelectorAll("[data-monthly]").forEach(function (el) { el.textContent = el.getAttribute("data-" + period); });
        root.querySelectorAll("[data-b-note]").forEach(function (el) { el.hidden = period !== "yearly"; });
      });
    });
  </script>
</section>`
    },
    {
      id: "faq", name: "FAQ", category: "Marketing",
      description: "Questions in an accessible accordion, with a contact prompt beside them.",
      html: `<section class="b-faq" aria-labelledby="b-faq-title">
  <style>
    .b-faq { padding: clamp(4rem, 9vw, 6rem) 0; }
    .b-faq .ox-container { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(2rem, 6vw, 5rem); }
    .b-faq h2 { margin: var(--ox-space-3) 0; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600; line-height: 1.1; letter-spacing: -0.04em; }
    .b-faq p { color: var(--ox-fg-muted); }
    @media (max-width: 860px) { .b-faq .ox-container { grid-template-columns: minmax(0, 1fr); } }
  </style>
  <div class="ox-container">
    <div>
      <span class="ox-eyebrow">FAQ</span>
      <h2 id="b-faq-title">Questions, answered</h2>
      <p>Can't find what you need? <a href="#">Talk to a person</a>. We reply within a working day.</p>
    </div>
    <div class="ox-accordion">
      <details open><summary>Can I use Lumen in client projects?</summary><p>Yes. Every plan includes a commercial licence. Use it in as many client projects as you like; you just can't resell the kit itself.</p></details>
      <details><summary>Does it work with React, Vue or plain HTML?</summary><p>All three. The core is plain CSS and a small script; the React package wraps the same components with typed props.</p></details>
      <details><summary>What happens when my subscription ends?</summary><p>You keep everything you downloaded and can keep shipping it. You only lose access to new releases and support.</p></details>
      <details><summary>Is there a student discount?</summary><p>Students and teachers get Pro free for a year. Write to us from your school email address.</p></details>
    </div>
  </div>
</section>`
    },
    {
      id: "cta", name: "Call to action", category: "Marketing",
      description: "A closing banner that asks once, clearly. Inverted to stand apart from the page.",
      html: `<section class="b-cta" aria-labelledby="b-cta-title">
  <style>
    .b-cta { padding: clamp(3rem, 7vw, 5rem) 0; }
    .b-cta .box { position: relative; display: grid; justify-items: center; gap: var(--ox-space-5); padding: clamp(2.5rem, 7vw, 5rem) var(--ox-space-6); overflow: hidden; text-align: center; color: var(--ox-fg); background: var(--ox-bg); border-radius: var(--ox-radius-xl); }
    .b-cta .box::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(var(--ox-border) 1px, transparent 1px), linear-gradient(90deg, var(--ox-border) 1px, transparent 1px); background-size: 40px 40px; -webkit-mask-image: radial-gradient(ellipse at 50% 0%, #000, transparent 70%); mask-image: radial-gradient(ellipse at 50% 0%, #000, transparent 70%); pointer-events: none; }
    .b-cta .box > * { position: relative; z-index: 1; }
    .b-cta h2 { max-width: 20ch; margin: 0; font-size: clamp(1.9rem, 5vw, 3rem); font-weight: 600; line-height: 1.05; letter-spacing: -0.045em; }
    .b-cta p { max-width: 44ch; margin: 0; color: var(--ox-fg-muted); }
  </style>
  <div class="ox-container">
    <div class="box ox-invert">
      <h2 id="b-cta-title">Start building something people remember.</h2>
      <p>Free for personal projects. Upgrade when your work starts paying the bills.</p>
      <div class="ox-row" style="justify-content: center">
        <a href="#" class="ox-btn ox-btn-lg ox-btn-pill">Get started free</a>
        <a href="#" class="ox-btn ox-btn-lg ox-btn-pill ox-btn-outline">Talk to sales</a>
      </div>
    </div>
  </div>
</section>`
    },
    {
      id: "newsletter", name: "Newsletter signup", category: "Marketing",
      description: "Email capture with validation and a success message, no page reload.",
      html: `<section class="b-news" aria-labelledby="b-news-title">
  <style>
    .b-news { padding: clamp(3rem, 7vw, 4.5rem) 0; }
    .b-news .ox-container { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--ox-space-8); align-items: center; }
    .b-news h2 { margin: 0 0 var(--ox-space-2); font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.03em; }
    .b-news p { margin: 0; color: var(--ox-fg-muted); }
    .b-news form { display: flex; gap: var(--ox-space-2); }
    .b-news form .ox-input { flex: 1; min-width: 0; }
    .b-news [data-b-done] { display: flex; align-items: center; gap: var(--ox-space-2); font-weight: 500; }
    @media (max-width: 760px) { .b-news .ox-container { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 420px) { .b-news form { flex-direction: column; } }
  </style>
  <div class="ox-container">
    <div>
      <h2 id="b-news-title">The Lumen letter</h2>
      <p>One email a month: new components, design notes and nothing else. Unsubscribe in one click.</p>
    </div>
    <div>
      <form data-b-news novalidate>
        <label class="ox-sr-only" for="b-news-email">Email address</label>
        <input class="ox-input" id="b-news-email" type="email" name="email" placeholder="you@company.com" autocomplete="email" required aria-describedby="b-news-hint">
        <button class="ox-btn" type="submit">Subscribe</button>
      </form>
      <p class="ox-hint" id="b-news-hint" style="margin-top: var(--ox-space-2)" aria-live="polite">We'll never share your address.</p>
      <p data-b-done hidden>${I.check}You're in. Check your inbox to confirm.</p>
    </div>
  </div>
  <script>
    document.querySelectorAll("[data-b-news]").forEach(function (form) {
      var box = form.parentElement, input = form.querySelector("input"), hint = box.querySelector(".ox-hint");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!input.checkValidity()) {
          input.setAttribute("aria-invalid", "true");
          hint.textContent = "Enter a valid email address, like you@company.com.";
          input.focus();
          return;
        }
        // Send input.value to your email provider here
        form.hidden = true; hint.hidden = true;
        box.querySelector("[data-b-done]").hidden = false;
      });
      input.addEventListener("input", function () { input.removeAttribute("aria-invalid"); hint.textContent = "We'll never share your address."; });
    });
  </script>
</section>`
    },
    {
      id: "team", name: "Team", category: "Marketing",
      description: "People behind the product, with roles and a hiring nudge.",
      html: `<section class="b-team" aria-labelledby="b-team-title">
  <style>
    .b-team { padding: clamp(4rem, 9vw, 6rem) 0; }
    .b-team header { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: var(--ox-space-4); margin-bottom: var(--ox-space-10); }
    .b-team h2 { margin: 0; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600; letter-spacing: -0.04em; }
    .b-team ul { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--ox-space-6); margin: 0; padding: 0; list-style: none; }
    .b-team .photo { display: grid; place-items: center; aspect-ratio: 4 / 5; margin-bottom: var(--ox-space-3); font-size: 2rem; font-weight: 600; letter-spacing: -0.04em; color: var(--ox-fg-muted); background: var(--ox-bg-muted); border-radius: var(--ox-radius-lg); }
    .b-team b { display: block; }
    .b-team span { font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    @media (max-width: 860px) { .b-team ul { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  </style>
  <div class="ox-container">
    <header>
      <h2 id="b-team-title">The people behind Lumen</h2>
      <a href="#" class="ox-btn ox-btn-outline ox-btn-pill">We're hiring ${I.arrow}</a>
    </header>
    <ul>
      <li><div class="photo" aria-hidden="true">AL</div><b>Ada Lovelace</b><span>Co-founder, Engineering</span></li>
      <li><div class="photo" aria-hidden="true">MH</div><b>Margaret Hamilton</b><span>Co-founder, Design</span></li>
      <li><div class="photo" aria-hidden="true">AT</div><b>Alan Turing</b><span>Research</span></li>
      <li><div class="photo" aria-hidden="true">KJ</div><b>Katherine Johnson</b><span>Customer Success</span></li>
    </ul>
  </div>
</section>`
    },
    {
      id: "contact", name: "Contact", category: "Marketing",
      description: "Contact details and a validated message form side by side.",
      html: `<section class="b-contact" aria-labelledby="b-contact-title">
  <style>
    .b-contact { padding: clamp(4rem, 9vw, 6rem) 0; }
    .b-contact .ox-container { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(2rem, 6vw, 5rem); }
    .b-contact h2 { margin: var(--ox-space-3) 0; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600; letter-spacing: -0.04em; }
    .b-contact dl { display: grid; gap: var(--ox-space-5); margin: var(--ox-space-8) 0 0; }
    .b-contact dl div { display: grid; grid-template-columns: auto 1fr; gap: 0 var(--ox-space-3); }
    .b-contact dt { grid-row: span 2; color: var(--ox-fg-muted); }
    .b-contact dd { margin: 0; font-size: var(--ox-text-sm); }
    .b-contact dd:first-of-type { font-weight: 600; }
    .b-contact form { display: grid; grid-template-columns: 1fr 1fr; gap: var(--ox-space-4); padding: var(--ox-space-8); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-xl); background: var(--ox-surface); }
    .b-contact .full { grid-column: 1 / -1; }
    .b-contact [data-b-sent] { grid-column: 1 / -1; }
    @media (max-width: 860px) { .b-contact .ox-container { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 480px) { .b-contact form { grid-template-columns: minmax(0, 1fr); padding: var(--ox-space-5); } }
  </style>
  <div class="ox-container">
    <div>
      <span class="ox-eyebrow">Contact</span>
      <h2 id="b-contact-title">Let's talk</h2>
      <p class="ox-muted" style="margin: 0">Questions about plans, licences or a custom setup? We answer every message.</p>
      <dl>
        <div><dt>${I.mail}<span class="ox-sr-only">Email</span></dt><dd>Email</dd><dd>hello@lumen.example</dd></div>
        <div><dt>${I.chat}<span class="ox-sr-only">Chat</span></dt><dd>Live chat</dd><dd>Weekdays, 9am to 6pm CET</dd></div>
        <div><dt>${I.pin}<span class="ox-sr-only">Office</span></dt><dd>Office</dd><dd>12 Harbour Street, Lisbon</dd></div>
      </dl>
    </div>
    <form data-b-contact novalidate>
      <div class="ox-field"><label class="ox-label" for="b-c-first">First name</label><input class="ox-input" id="b-c-first" autocomplete="given-name" required></div>
      <div class="ox-field"><label class="ox-label" for="b-c-last">Last name</label><input class="ox-input" id="b-c-last" autocomplete="family-name"></div>
      <div class="ox-field full"><label class="ox-label" for="b-c-email">Work email</label><input class="ox-input" id="b-c-email" type="email" autocomplete="email" required></div>
      <div class="ox-field full"><label class="ox-label" for="b-c-topic">Topic</label><select class="ox-select" id="b-c-topic"><option>Plans and pricing</option><option>Licensing</option><option>Something else</option></select></div>
      <div class="ox-field full"><label class="ox-label" for="b-c-msg">Message</label><textarea class="ox-textarea" id="b-c-msg" rows="4" required></textarea></div>
      <button class="ox-btn full" type="submit">Send message</button>
      <div class="ox-alert" role="status" data-b-sent hidden><span class="ox-alert-icon" aria-hidden="true">✓</span><div>Thanks, your message is on its way. We'll reply by email.</div></div>
    </form>
  </div>
  <script>
    document.querySelectorAll("[data-b-contact]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var bad = null;
        form.querySelectorAll("[required]").forEach(function (f) {
          var field = f.closest(".ox-field"), ok = f.checkValidity();
          field.toggleAttribute("data-invalid", !ok);
          f.setAttribute("aria-invalid", String(!ok));
          if (!ok && !bad) bad = f;
        });
        if (bad) { bad.focus(); return; }
        // Send the form to your backend here
        form.reset();
        form.querySelector("[data-b-sent]").hidden = false;
      });
    });
  </script>
</section>`
    },
    {
      id: "footer", name: "Footer", category: "Marketing",
      description: "Brand, four link columns and a legal row. Columns fold neatly on phones.",
      html: `<footer class="b-footer" aria-label="Lumen">
  <style>${logoCss}
    .b-footer { padding: var(--ox-space-16) 0 var(--ox-space-8); border-top: 1px solid var(--ox-border); font-size: var(--ox-text-sm); }
    .b-footer .top { display: grid; grid-template-columns: minmax(0, 1.4fr) repeat(4, minmax(0, 1fr)); gap: var(--ox-space-8); }
    .b-footer .brand { display: inline-flex; align-items: center; gap: var(--ox-space-2); font-size: var(--ox-text-base); font-weight: 600; color: var(--ox-fg); text-decoration: none; }
    .b-footer p { max-width: 28ch; color: var(--ox-fg-muted); }
    .b-footer h2 { margin: 0 0 var(--ox-space-4); font-size: var(--ox-text-sm); font-weight: 600; }
    .b-footer ul { display: grid; gap: var(--ox-space-3); margin: 0; padding: 0; list-style: none; }
    .b-footer a { color: var(--ox-fg-muted); text-decoration: none; }
    .b-footer a:hover { color: var(--ox-fg); }
    .b-footer .bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--ox-space-4); margin-top: var(--ox-space-12); padding-top: var(--ox-space-6); border-top: 1px solid var(--ox-border); color: var(--ox-fg-muted); }
    @media (max-width: 860px) { .b-footer .top { grid-template-columns: repeat(2, minmax(0, 1fr)); } .b-footer .top > :first-child { grid-column: 1 / -1; } }
  </style>
  <div class="ox-container">
    <div class="top">
      <div><a href="#" class="brand">${logo}Lumen</a><p>Interfaces that feel finished, from the first commit.</p></div>
      <nav aria-labelledby="b-f-product"><h2 id="b-f-product">Product</h2><ul><li><a href="#">Components</a></li><li><a href="#">Templates</a></li><li><a href="#">Pricing</a></li><li><a href="#">Changelog</a></li></ul></nav>
      <nav aria-labelledby="b-f-resources"><h2 id="b-f-resources">Resources</h2><ul><li><a href="#">Docs</a></li><li><a href="#">Guides</a></li><li><a href="#">Figma kit</a></li></ul></nav>
      <nav aria-labelledby="b-f-company"><h2 id="b-f-company">Company</h2><ul><li><a href="#">About</a></li><li><a href="#">Careers</a></li><li><a href="#">Contact</a></li></ul></nav>
      <nav aria-labelledby="b-f-legal"><h2 id="b-f-legal">Legal</h2><ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Licence</a></li></ul></nav>
    </div>
    <div class="bottom">
      <span>© 2026 Lumen Labs. All rights reserved.</span>
      <a href="#" class="ox-row" style="gap: var(--ox-space-2)">${gh}GitHub</a>
    </div>
  </div>
</footer>`
    },

    /* =================== Authentication =================== */
    {
      id: "sign-in", name: "Sign in", category: "Authentication", height: 720,
      description: "Centred card with social sign-in, a password reveal toggle and inline errors.",
      html: `<section class="b-auth" aria-labelledby="b-auth-title">
  <style>${logoCss}
    .b-auth { display: grid; place-items: center; min-height: 100vh; padding: var(--ox-space-12) var(--ox-space-4); background: var(--ox-bg-subtle); }
    .b-auth .card { width: 100%; max-width: 24rem; padding: clamp(1.5rem, 5vw, 2.5rem); background: var(--ox-surface); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-xl); box-shadow: var(--ox-shadow); }
    .b-auth h1 { margin: var(--ox-space-6) 0 var(--ox-space-1); font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.03em; }
    .b-auth form { display: grid; gap: var(--ox-space-4); margin-top: var(--ox-space-6); }
    .b-auth .pw { position: relative; }
    .b-auth .pw .ox-input { padding-right: 4.5rem; }
    .b-auth .pw button { position: absolute; right: 0.35rem; top: 50%; transform: translateY(-50%); }
    .b-auth .foot { margin: var(--ox-space-6) 0 0; text-align: center; font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
  </style>
  <div class="card">
    ${logo}
    <h1 id="b-auth-title">Welcome back</h1>
    <p class="ox-muted" style="margin: 0; font-size: var(--ox-text-sm)">Sign in to continue to Lumen.</p>
    <form data-b-signin novalidate>
      <div class="ox-row" style="display: grid; grid-template-columns: 1fr 1fr">
        <button type="button" class="ox-btn ox-btn-outline">${gh}GitHub</button>
        <button type="button" class="ox-btn ox-btn-outline">Google</button>
      </div>
      <div class="ox-divider">or with email</div>
      <div class="ox-field">
        <label class="ox-label" for="b-si-email">Email</label>
        <input class="ox-input" id="b-si-email" type="email" autocomplete="email" required aria-describedby="b-si-email-err">
        <span class="ox-hint" id="b-si-email-err" hidden>Enter the email you signed up with.</span>
      </div>
      <div class="ox-field">
        <div class="ox-row ox-between"><label class="ox-label" for="b-si-pw">Password</label><a href="#" style="font-size: var(--ox-text-sm)">Forgot password?</a></div>
        <div class="pw">
          <input class="ox-input" id="b-si-pw" type="password" autocomplete="current-password" required minlength="8" aria-describedby="b-si-pw-err">
          <button type="button" class="ox-btn ox-btn-ghost ox-btn-sm" data-b-reveal aria-pressed="false">Show</button>
        </div>
        <span class="ox-hint" id="b-si-pw-err" hidden>Passwords are at least 8 characters.</span>
      </div>
      <label class="ox-checkbox"><input type="checkbox" checked> Keep me signed in</label>
      <button class="ox-btn ox-btn-block" type="submit">Sign in</button>
    </form>
    <p class="foot">New to Lumen? <a href="#">Create an account</a></p>
  </div>
  <script>
    document.querySelectorAll("[data-b-signin]").forEach(function (form) {
      var reveal = form.querySelector("[data-b-reveal]"), pw = form.querySelector('input[autocomplete="current-password"]');
      reveal.addEventListener("click", function () {
        var show = pw.type === "password";
        pw.type = show ? "text" : "password";
        reveal.textContent = show ? "Hide" : "Show";
        reveal.setAttribute("aria-pressed", String(show));
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var first = null;
        form.querySelectorAll("input[required]").forEach(function (input) {
          var ok = input.checkValidity(), field = input.closest(".ox-field");
          field.toggleAttribute("data-invalid", !ok);
          input.setAttribute("aria-invalid", String(!ok));
          document.getElementById(input.getAttribute("aria-describedby")).hidden = ok;
          if (!ok && !first) first = input;
        });
        if (first) { first.focus(); return; }
        // Signed in: send the credentials to your auth endpoint here
        form.querySelector('[type="submit"]').setAttribute("data-loading", "true");
      });
    });
  </script>
</section>`
    },
    {
      id: "sign-up", name: "Sign up, split", category: "Authentication", height: 760,
      description: "Account form beside an inverted testimonial panel; the panel hides on phones.",
      html: `<section class="b-signup" aria-labelledby="b-su-title">
  <style>${logoCss}
    .b-signup { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); min-height: 100vh; }
    .b-signup .form { display: grid; align-content: center; justify-items: center; padding: var(--ox-space-12) var(--ox-space-6); }
    .b-signup .form > div { width: 100%; max-width: 22rem; }
    .b-signup h1 { margin: var(--ox-space-6) 0 var(--ox-space-1); font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.03em; }
    .b-signup form { display: grid; gap: var(--ox-space-4); margin-top: var(--ox-space-6); }
    .b-signup .meter { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 2px; }
    .b-signup .meter i { height: 4px; border-radius: 2px; background: var(--ox-border); transition: background var(--ox-duration); }
    .b-signup .meter i.on { background: var(--ox-fg); }
    .b-signup .quote { display: grid; margin: 0; align-content: end; gap: var(--ox-space-6); padding: clamp(2rem, 5vw, 4rem); color: var(--ox-fg); background: var(--ox-bg); }
    .b-signup blockquote { margin: 0; font-size: clamp(1.3rem, 2.4vw, 1.75rem); line-height: 1.3; letter-spacing: -0.025em; }
    .b-signup .quote p { margin: 0; color: var(--ox-fg-muted); font-size: var(--ox-text-sm); }
    @media (max-width: 860px) { .b-signup { grid-template-columns: minmax(0, 1fr); } .b-signup .quote { display: none; } }
  </style>
  <div class="form">
    <div>
      ${logo}
      <h1 id="b-su-title">Create your account</h1>
      <p class="ox-muted" style="margin: 0; font-size: var(--ox-text-sm)">14 days of Pro, free. No card needed.</p>
      <form data-b-signup novalidate>
        <div class="ox-field"><label class="ox-label" for="b-su-name">Full name</label><input class="ox-input" id="b-su-name" autocomplete="name" required></div>
        <div class="ox-field"><label class="ox-label" for="b-su-email">Work email</label><input class="ox-input" id="b-su-email" type="email" autocomplete="email" required></div>
        <div class="ox-field">
          <label class="ox-label" for="b-su-pw">Password</label>
          <input class="ox-input" id="b-su-pw" type="password" autocomplete="new-password" minlength="8" required aria-describedby="b-su-pw-hint">
          <div class="meter" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <span class="ox-hint" id="b-su-pw-hint" aria-live="polite">At least 8 characters.</span>
        </div>
        <label class="ox-checkbox"><input type="checkbox" required> I agree to the <a href="#">terms</a></label>
        <button class="ox-btn ox-btn-block" type="submit">Create account</button>
      </form>
      <p style="margin: var(--ox-space-6) 0 0; font-size: var(--ox-text-sm)" class="ox-muted">Already have an account? <a href="#">Sign in</a></p>
    </div>
  </div>
  <figure class="quote ox-invert">
    <blockquote>“Lumen is the first kit our designers and engineers both defend in code review.”</blockquote>
    <div class="ox-row"><span class="ox-avatar">GH</span><div><b style="display: block; font-size: var(--ox-text-sm)">Grace Hopper</b><p>Founder, Kestrel</p></div></div>
  </figure>
  <script>
    document.querySelectorAll("[data-b-signup]").forEach(function (form) {
      var pw = form.querySelector('[autocomplete="new-password"]'), bars = form.querySelectorAll(".meter i"), hint = form.querySelector("#b-su-pw-hint");
      var LABELS = ["At least 8 characters.", "Weak: add numbers or symbols.", "Fair: longer is stronger.", "Good password.", "Strong password."];
      pw.addEventListener("input", function () {
        var v = pw.value, score = 0;
        if (v.length >= 8) score++;
        if (/[0-9]/.test(v) && /[a-zA-Z]/.test(v)) score++;
        if (/[^a-zA-Z0-9]/.test(v)) score++;
        if (v.length >= 14) score++;
        bars.forEach(function (b, i) { b.classList.toggle("on", i < score); });
        hint.textContent = v ? LABELS[score] : LABELS[0];
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var first = null;
        form.querySelectorAll("[required]").forEach(function (f) {
          var ok = f.checkValidity(), field = f.closest(".ox-field");
          if (field) field.toggleAttribute("data-invalid", !ok);
          f.setAttribute("aria-invalid", String(!ok));
          if (!ok && !first) first = f;
        });
        if (first) { first.focus(); return; }
        form.querySelector('[type="submit"]').setAttribute("data-loading", "true");
      });
    });
  </script>
</section>`
    },

    /* =================== Application =================== */
    {
      id: "settings", name: "Settings page", category: "Application",
      description: "Profile and notification settings in labelled sections, with a save bar.",
      html: `<section class="b-settings" aria-labelledby="b-set-title">
  <style>
    .b-settings { padding: var(--ox-space-10) 0; }
    .b-settings .ox-container { max-width: 52rem; }
    .b-settings h1 { margin: 0 0 var(--ox-space-1); font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.03em; }
    .b-settings form > section { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: var(--ox-space-8); padding: var(--ox-space-8) 0; border-bottom: 1px solid var(--ox-border); }
    .b-settings h2 { margin: 0 0 var(--ox-space-1); font-size: var(--ox-text-base); font-weight: 600; }
    .b-settings section p { margin: 0; font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    .b-settings .fields { display: grid; gap: var(--ox-space-4); }
    .b-settings .who { display: flex; align-items: center; gap: var(--ox-space-4); }
    .b-settings .switches { display: grid; gap: var(--ox-space-5); }
    .b-settings .switches label { justify-content: space-between; width: 100%; }
    .b-settings .bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: var(--ox-space-3); padding-top: var(--ox-space-6); }
    .b-settings .bar span { margin-right: auto; font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    @media (max-width: 720px) { .b-settings form > section { grid-template-columns: minmax(0, 1fr); gap: var(--ox-space-5); } }
  </style>
  <div class="ox-container">
    <h1 id="b-set-title">Settings</h1>
    <p class="ox-muted" style="margin: 0">Manage your profile and how Lumen keeps in touch.</p>
    <form data-b-settings>
      <section aria-labelledby="b-set-profile">
        <div><h2 id="b-set-profile">Profile</h2><p>Shown to people in your workspace.</p></div>
        <div class="fields">
          <div class="who"><span class="ox-avatar ox-avatar-lg ox-avatar-solid">AL</span><button type="button" class="ox-btn ox-btn-outline ox-btn-sm">Change photo</button></div>
          <div class="ox-field"><label class="ox-label" for="b-set-name">Name</label><input class="ox-input" id="b-set-name" value="Ada Lovelace" autocomplete="name"></div>
          <div class="ox-field"><label class="ox-label" for="b-set-bio">Bio</label><textarea class="ox-textarea" id="b-set-bio" rows="3" aria-describedby="b-set-bio-hint">Engineer. Writes about analytical engines.</textarea><span class="ox-hint" id="b-set-bio-hint">Up to 160 characters.</span></div>
        </div>
      </section>
      <section aria-labelledby="b-set-notify">
        <div><h2 id="b-set-notify">Notifications</h2><p>Pick what's worth an email.</p></div>
        <div class="switches">
          <label class="ox-switch">Product updates<input type="checkbox" checked><span class="ox-switch-track"></span></label>
          <label class="ox-switch">Weekly report<input type="checkbox" checked><span class="ox-switch-track"></span></label>
          <label class="ox-switch">Comments and mentions<input type="checkbox"><span class="ox-switch-track"></span></label>
        </div>
      </section>
      <div class="bar">
        <span data-b-status aria-live="polite">No unsaved changes</span>
        <button type="reset" class="ox-btn ox-btn-ghost">Discard</button>
        <button type="submit" class="ox-btn">Save changes</button>
      </div>
    </form>
  </div>
  <script>
    document.querySelectorAll("[data-b-settings]").forEach(function (form) {
      var status = form.querySelector("[data-b-status]");
      form.addEventListener("input", function () { status.textContent = "Unsaved changes"; });
      form.addEventListener("reset", function () { status.textContent = "Changes discarded"; });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Save to your backend here
        status.textContent = "Saved just now";
        if (window.Onyx) Onyx.toast("Settings saved");
      });
    });
  </script>
</section>`
    },
    {
      id: "empty-state", name: "Empty state", category: "Application",
      description: "First-run screen for a list with nothing in it yet: explain, then offer the next step.",
      html: `<section class="b-empty" aria-labelledby="b-empty-title">
  <style>
    .b-empty { padding: var(--ox-space-10) 0; }
    .b-empty header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--ox-space-3); margin-bottom: var(--ox-space-6); }
    .b-empty h1 { margin: 0; font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.03em; }
  </style>
  <div class="ox-container">
    <header><h1 id="b-empty-title">Projects</h1><button type="button" class="ox-btn ox-btn-sm">New project</button></header>
    <div class="ox-empty">
      <span class="ox-empty-icon" aria-hidden="true">◌</span>
      <h2 class="ox-empty-title">No projects yet</h2>
      <p class="ox-empty-text">Projects keep your screens, themes and exports together. Start from scratch or from a template.</p>
      <div class="ox-row" style="justify-content: center">
        <button type="button" class="ox-btn">Create a project</button>
        <a href="#" class="ox-btn ox-btn-outline">Browse templates</a>
      </div>
    </div>
  </div>
</section>`
    },
    {
      id: "not-found", name: "404 page", category: "Application", height: 620,
      description: "A friendly dead end with a way back and a search box.",
      html: `<section class="b-404" aria-labelledby="b-404-title">
  <style>
    .b-404 { display: grid; place-items: center; min-height: 80vh; padding: var(--ox-space-12) var(--ox-space-4); text-align: center; }
    .b-404 .code { font-family: var(--ox-font-mono); font-size: clamp(5rem, 22vw, 10rem); font-weight: 500; line-height: 1; letter-spacing: -0.06em; color: transparent; -webkit-text-stroke: 1.5px var(--ox-fg); }
    .b-404 h1 { margin: var(--ox-space-6) 0 var(--ox-space-2); font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.03em; }
    .b-404 p { max-width: 38ch; margin: 0 auto var(--ox-space-8); color: var(--ox-fg-muted); }
    .b-404 form { display: flex; gap: var(--ox-space-2); max-width: 24rem; margin: 0 auto var(--ox-space-6); }
    .b-404 form .ox-input-group { flex: 1; }
  </style>
  <div>
    <div class="code" aria-hidden="true">404</div>
    <h1 id="b-404-title">This page wandered off</h1>
    <p>The link may be old, or the page moved. Try a search, or head back home.</p>
    <form role="search" action="#">
      <div class="ox-input-group">
        <svg class="ox-input-icon" viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></g></svg>
        <input class="ox-input" type="search" name="q" placeholder="Search the docs" aria-label="Search the docs">
      </div>
      <button class="ox-btn ox-btn-outline" type="submit">Search</button>
    </form>
    <a href="#" class="ox-btn ox-btn-pill">Back to home</a>
  </div>
</section>`
    },
    {
      id: "dashboard", name: "Analytics dashboard", category: "Application", pro: true, height: 780,
      description: "Sidebar, KPI cards with sparklines and a live revenue chart. Uses Pro charts.",
      html: `<div class="b-dash">
  <style>${logoCss}
    .b-dash { display: grid; grid-template-columns: 15rem minmax(0, 1fr); min-height: 100vh; background: var(--ox-bg-subtle); }
    .b-dash aside { display: flex; flex-direction: column; gap: var(--ox-space-1); padding: var(--ox-space-5) var(--ox-space-3); background: var(--ox-surface); border-right: 1px solid var(--ox-border); }
    .b-dash .brand { display: flex; align-items: center; gap: var(--ox-space-2); padding: 0 var(--ox-space-3) var(--ox-space-5); font-weight: 600; }
    .b-dash aside a { display: flex; align-items: center; height: 2.25rem; padding: 0 var(--ox-space-3); font-size: var(--ox-text-sm); color: var(--ox-fg-muted); text-decoration: none; border-radius: var(--ox-radius); }
    .b-dash aside a:hover { color: var(--ox-fg); background: var(--ox-bg-muted); }
    .b-dash aside a[aria-current] { color: var(--ox-fg); font-weight: 500; background: var(--ox-bg-muted); }
    .b-dash main { display: grid; align-content: start; gap: var(--ox-space-6); padding: var(--ox-space-8) clamp(1rem, 3vw, 2rem); }
    .b-dash header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--ox-space-3); }
    .b-dash h1 { margin: 0; font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.03em; }
    .b-dash .kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--ox-space-4); }
    .b-dash .kpi { display: grid; gap: var(--ox-space-1); padding: var(--ox-space-5); background: var(--ox-surface); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-lg); }
    .b-dash .kpi span { font-size: var(--ox-text-sm); color: var(--ox-fg-muted); }
    .b-dash .kpi b { font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
    .b-dash .kpi div { display: flex; align-items: center; justify-content: space-between; gap: var(--ox-space-2); font-size: var(--ox-text-xs); color: var(--ox-fg-muted); }
    .b-dash .panel { padding: var(--ox-space-6); background: var(--ox-surface); border: 1px solid var(--ox-border); border-radius: var(--ox-radius-lg); }
    .b-dash .panel h2 { margin: 0 0 var(--ox-space-5); font-size: var(--ox-text-base); font-weight: 600; }
    @media (max-width: 1100px) { .b-dash .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 760px) { .b-dash { grid-template-columns: minmax(0, 1fr); } .b-dash aside { flex-direction: row; overflow-x: auto; padding: var(--ox-space-2); border-right: 0; border-bottom: 1px solid var(--ox-border); } .b-dash .brand { padding: 0 var(--ox-space-3); } }
    @media (max-width: 420px) { .b-dash .kpis { grid-template-columns: minmax(0, 1fr); } }
  </style>
  <aside>
    <nav aria-label="Workspace" style="display: contents">
      <span class="brand">${logo}Lumen</span>
      <a href="#" aria-current="page">Overview</a>
      <a href="#">Customers</a>
      <a href="#">Revenue</a>
      <a href="#">Settings</a>
    </nav>
  </aside>
  <main aria-label="Overview">
    <header>
      <h1>Overview</h1>
      <div class="ox-segmented" role="group" aria-label="Date range">
        <button type="button" value="7" aria-pressed="false">7 days</button>
        <button type="button" value="30" aria-pressed="false">30 days</button>
        <button type="button" value="365" aria-pressed="true">12 months</button>
      </div>
    </header>
    <div class="kpis">
      <div class="kpi"><span>Revenue</span><b>$48,210</b><div><span>+12.4% vs last year</span><span data-b-spark="4,6,5,8,7,9,12"></span></div></div>
      <div class="kpi"><span>Customers</span><b>1,284</b><div><span>+86 this month</span><span data-b-spark="3,4,4,5,7,6,8"></span></div></div>
      <div class="kpi"><span>Churn</span><b>1.8%</b><div><span>−0.3 points</span><span data-b-spark="6,5,6,4,4,3,3"></span></div></div>
      <div class="kpi"><span>Avg. order</span><b>$37.50</b><div><span>+$2.10</span><span data-b-spark="5,5,6,6,7,7,8"></span></div></div>
    </div>
    <section class="panel" aria-labelledby="b-dash-rev">
      <h2 id="b-dash-rev">Revenue</h2>
      <div id="b-dash-chart"></div>
    </section>
  </main>
  <script>
    (function () {
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var k = function (v) { return v * 1000; };
      var series = [
        { name: "This year", data: [21, 24, 23, 29, 31, 30, 35, 38, 36, 42, 45, 48].map(k) },
        { name: "Last year", data: [17, 18, 20, 21, 24, 23, 26, 27, 29, 30, 31, 33].map(k) }
      ];
      var chart = OnyxPro.chart("#b-dash-chart", {
        type: "area", height: 260, title: "Revenue by month", labels: months, series: series, legend: true,
        format: function (v) { return "$" + new Intl.NumberFormat("en-US").format(v); }
      });
      document.querySelectorAll("[data-b-spark]").forEach(function (el) { OnyxPro.sparkline(el, el.getAttribute("data-b-spark").split(",").map(Number)); });
      // The range switch shows the most recent points; swap in your own data per range here
      document.querySelector(".b-dash .ox-segmented").addEventListener("ox:change", function (e) {
        var n = { "7": 4, "30": 6, "365": 12 }[e.detail.value];
        chart.update({ labels: months.slice(-n), series: series.map(function (s) { return { name: s.name, data: s.data.slice(-n) }; }) });
      });
    })();
  </script>
</div>`
    },
    {
      id: "customers-table", name: "Customers table", category: "Application", pro: true,
      description: "Searchable, sortable, paged table with bulk selection. Uses the Pro data table.",
      html: `<section class="b-table" aria-labelledby="b-table-title">
  <style>
    .b-table { padding: var(--ox-space-10) 0; }
    .b-table header { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: var(--ox-space-3); margin-bottom: var(--ox-space-6); }
    .b-table h1 { margin: 0 0 var(--ox-space-1); font-size: var(--ox-text-2xl); font-weight: 600; letter-spacing: -0.03em; }
    .b-table p { margin: 0; color: var(--ox-fg-muted); font-size: var(--ox-text-sm); }
  </style>
  <div class="ox-container">
    <header>
      <div><h1 id="b-table-title">Customers</h1><p>Everyone with an active or past subscription.</p></div>
      <button type="button" class="ox-btn ox-btn-sm">Add customer</button>
    </header>
    <div id="b-customers"></div>
  </div>
  <script>
    (function () {
      var names = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Linus Torvalds", "Margaret Hamilton", "Dennis Ritchie", "Barbara Liskov", "Donald Knuth", "Frances Allen", "Ken Thompson", "Radia Perlman"];
      var plans = ["Starter", "Pro", "Team"];
      var rows = names.map(function (n, i) {
        return { id: i + 1, name: n, email: n.split(" ")[0].toLowerCase() + "@example.com", plan: plans[i % 3], status: i % 5 === 3 ? "Paused" : "Active", mrr: [0, 19, 49][i % 3] * (1 + (i % 4)) };
      });
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
      OnyxPro.DataTable("#b-customers", {
        rows: rows, pageSize: 6, selectable: true, searchPlaceholder: "Search customers…",
        actions: '<button type="button" class="ox-btn ox-btn-outline ox-btn-sm">Export</button>',
        columns: [
          { key: "name", label: "Name", render: function (r) { return "<b>" + esc(r.name) + '</b><div class="ox-muted" style="font-size:var(--ox-text-xs)">' + esc(r.email) + "</div>"; } },
          { key: "plan", label: "Plan" },
          { key: "status", label: "Status", render: function (r) { return '<span class="ox-badge' + (r.status === "Active" ? " ox-badge-dot" : " ox-badge-outline") + '">' + r.status + "</span>"; } },
          { key: "mrr", label: "MRR", align: "right", render: function (r) { return "$" + r.mrr; } }
        ]
      });
    })();
  </script>
</section>`
    }
  ];

  window.ONYX_BLOCKS = BLOCKS;
})();
