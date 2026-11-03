/*
 * Onyx docs content.
 * Each page is a list of blocks rendered by docs.js:
 *   H("Heading")                  section heading (also listed in "On this page")
 *   P("html")                     paragraph
 *   EX(`html`, "layout", `js`)    live preview + its source; layout: "block" | "left" | "wide"; optional js runs after render
 *   CODE("lang", `src`, "file")   code block only
 *   API([[name, description]])    options table
 *   LIST(["html", ...])           bullet list
 *   NOTE("html")                  callout
 */
(function () {
  var H = function (t) { return { type: "h2", text: t }; };
  var P = function (h) { return { type: "p", html: h }; };
  var EX = function (h, layout, js) { return { type: "example", html: h, layout: layout || "", js: js }; };
  var CODE = function (lang, src, file) { return { type: "code", lang: lang, src: src, file: file }; };
  var API = function (rows, head) { return { type: "table", head: head || ["Class / attribute", "Description"], rows: rows }; };
  var LIST = function (items) { return { type: "list", items: items }; };
  var NOTE = function (h) { return { type: "note", html: h }; };

  window.ONYX_DOCS = [
    {
      group: "Getting started",
      pages: [
        {
          slug: "introduction",
          title: "Introduction",
          lead: "Onyx is a black & white component library. One stylesheet, one small script, no dependencies.",
          blocks: [
            H("Why black & white?"),
            P("Color is the easiest way to add hierarchy, and the easiest way to make an interface noisy. Onyx takes it away on purpose. What's left — <strong>type, weight, spacing, contrast and motion</strong> — has to be right, so we made sure it is."),
            P("The result is an interface that looks considered on day one and stays out of the way of your content, your photography and your brand."),
            H("What you get"),
            LIST([
              "<strong>40+ components</strong> — buttons, forms, overlays, navigation and feedback.",
              "<strong>Light and dark themes</strong> that follow the system, plus <code>.ox-invert</code> to flip any region.",
              "<strong>Accessible behaviors</strong> — focus trapping, keyboard navigation and ARIA roles built in.",
              "<strong>Design tokens</strong> — every color, radius, shadow and spacing step is a CSS variable.",
              "<strong>~8 KB gzipped</strong> for the CSS and JS together."
            ]),
            H("Where to next"),
            { type: "cards", items: [
              ["installation", "Installation", "Add Onyx to any project in a minute."],
              ["theming", "Theming", "Change tokens to make Onyx your own."],
              ["button", "Components", "Browse every component with live examples."],
              ["javascript", "JavaScript API", "Open modals and show toasts from code."]
            ] }
          ]
        },
        {
          slug: "installation",
          title: "Installation",
          lead: "Onyx works in plain HTML and in every framework. There is no build step.",
          blocks: [
            H("Via CDN or files"),
            P("Download <code>onyx.css</code> and <code>onyx.js</code> from the repository and link them. Add the <code>ox</code> class to <code>&lt;body&gt;</code> for base typography and colors."),
            CODE("html", `<!doctype html>
<html lang="en">
<head>
  <link rel="stylesheet" href="onyx.css">
</head>
<body class="ox">
  <button class="ox-btn">Hello Onyx</button>

  <script src="onyx.js"></script>
</body>
</html>`, "index.html"),
            H("Via npm"),
            CODE("bash", `npm install onyx-ui`, "Terminal"),
            P("Then import it once at the entry point of your app:"),
            CODE("js", `import "onyx-ui/src/onyx.css";
import "onyx-ui/src/onyx.js";`, "main.js"),
            H("Fonts"),
            P("Onyx is designed around <strong>Geist</strong> and <strong>Geist Mono</strong>. They're optional — without them Onyx falls back to the system font."),
            CODE("html", `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">`, "index.html"),
            NOTE("<b>Using React, Vue or Svelte?</b> Onyx is just classes and data attributes, so use <code>className</code> / <code>class</code> as usual. The script uses event delegation, so components rendered later work automatically.")
          ]
        },
        {
          slug: "theming",
          title: "Theming",
          lead: "Every visual decision in Onyx is a CSS variable. Override them to make it yours.",
          blocks: [
            H("Overriding tokens"),
            P("Define your overrides after <code>onyx.css</code>. Shape, type and spacing tokens live on <code>:root</code>."),
            CODE("css", `:root {
  --ox-radius: 2px;        /* buttons, inputs */
  --ox-radius-lg: 4px;     /* cards, alerts */
  --ox-radius-xl: 8px;     /* modals */
  --ox-font-sans: "Inter", system-ui, sans-serif;
}`, "theme.css"),
            H("Token reference"),
            API([
              ["<code>--ox-bg</code>", "Page background."],
              ["<code>--ox-bg-subtle</code>, <code>--ox-bg-muted</code>", "Slightly and noticeably tinted surfaces."],
              ["<code>--ox-surface</code>", "Cards, inputs, menus and dialogs."],
              ["<code>--ox-border</code>, <code>--ox-border-strong</code>", "Hairlines and hover borders."],
              ["<code>--ox-fg</code>", "Primary text and solid fills."],
              ["<code>--ox-fg-muted</code>, <code>--ox-fg-subtle</code>", "Secondary and tertiary text."],
              ["<code>--ox-inverse</code>", "Text on solid fills."],
              ["<code>--ox-radius-sm … --ox-radius-xl</code>", "Corner radius scale (6, 8, 12, 20px)."],
              ["<code>--ox-space-1 … --ox-space-16</code>", "Spacing scale on a 4px grid."],
              ["<code>--ox-shadow-sm</code>, <code>--ox-shadow</code>, <code>--ox-shadow-lg</code>", "Elevation."],
              ["<code>--ox-font-sans</code>, <code>--ox-font-mono</code>", "Font stacks."],
              ["<code>--ox-ease</code>, <code>--ox-duration</code>", "Motion curve and base duration."]
            ], ["Token", "Used for"]),
            H("Adding an accent"),
            P("Onyx is black & white by default, but nothing stops you. Because primary buttons use <code>--ox-fg</code>, you can scope an accent to a region:"),
            EX(`<div style="--ox-fg:#2563eb; --ox-inverse:#fff">
  <button class="ox-btn">Accent button</button>
</div>`),
          ]
        },
        {
          slug: "dark-mode",
          title: "Dark mode",
          lead: "Onyx follows the operating system by default, and can be switched or inverted per region.",
          blocks: [
            H("Automatic"),
            P("Without any setup, Onyx uses the light palette or the dark palette based on <code>prefers-color-scheme</code>."),
            H("Forcing a theme"),
            P("Set <code>data-theme</code> on <code>&lt;html&gt;</code> to force a theme. Add a toggle button with <code>data-ox-theme-toggle</code> — the choice is remembered."),
            CODE("html", `<html data-theme="dark">
  …
  <button class="ox-btn ox-btn-ghost" data-ox-theme-toggle>Toggle theme</button>`),
            H("Inverting a region"),
            P("Add <code>.ox-invert</code> to any element to give it the opposite palette. Everything inside — buttons, inputs, badges — adapts."),
            EX(`<div class="ox-card ox-invert" style="padding:24px; max-width:360px">
  <h3 class="ox-card-title">Inverted card</h3>
  <p class="ox-card-text" style="margin-bottom:16px">Black on a light page, white on a dark one.</p>
  <div class="ox-row">
    <button class="ox-btn ox-btn-sm">Primary</button>
    <button class="ox-btn ox-btn-sm ox-btn-outline">Outline</button>
  </div>
</div>`)
          ]
        },
        {
          slug: "javascript",
          title: "JavaScript API",
          lead: "Interactive components work with data attributes alone. The same behaviors are available from code.",
          blocks: [
            H("The Onyx object"),
            CODE("js", `Onyx.modal.open("my-modal");
Onyx.modal.close("my-modal");

Onyx.toast("Saved", { duration: 3000 });
Onyx.copy("npm i onyx-ui");      // copies and shows a toast

Onyx.theme.set("dark");          // "light" | "dark"
Onyx.theme.get();                // → "dark"`),
            H("Data attributes"),
            API([
              ["<code>data-ox-modal-open=\"id\"</code>", "Opens the modal with that id."],
              ["<code>data-ox-modal-close</code>", "Closes the modal it is inside."],
              ["<code>data-ox-dropdown-toggle</code>", "Toggles the surrounding <code>.ox-dropdown</code>."],
              ["<code>data-ox-toast=\"text\"</code>", "Shows a toast with that text on click."],
              ["<code>data-ox-copy=\"text\"</code>", "Copies the text to the clipboard."],
              ["<code>data-ox-tooltip=\"text\"</code>", "Shows a tooltip on hover and focus (CSS only)."],
              ["<code>data-ox-theme-toggle</code>", "Switches between light and dark."]
            ], ["Attribute", "Behavior"]),
            H("Events"),
            API([
              ["<code>ox:change</code>", "Fired on <code>.ox-segmented</code> when the selection changes. <code>event.detail.value</code> holds the button's <code>value</code>."]
            ], ["Event", "Description"])
          ]
        }
      ]
    },

    {
      group: "Components",
      pages: [
        {
          slug: "accordion",
          title: "Accordion",
          lead: "Vertically stacked sections that expand and collapse. Built on native <details>, so it works without JavaScript.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-accordion">
  <details open>
    <summary>Is it accessible?</summary>
    <p>Yes. It uses native details and summary elements.</p>
  </details>
  <details>
    <summary>Does it need JavaScript?</summary>
    <p>No. The browser handles opening and closing.</p>
  </details>
  <details>
    <summary>Can I nest content?</summary>
    <p>Anything can go inside a details element.</p>
  </details>
</div>`, "block"),
            H("API"),
            API([
              ["<code>.ox-accordion</code>", "Wrapper that styles every <code>&lt;details&gt;</code> inside it."],
              ["<code>open</code>", "Native attribute — starts the section expanded."]
            ])
          ]
        },
        {
          slug: "alert",
          title: "Alert",
          lead: "A short, important message that doesn't interrupt the user.",
          blocks: [
            H("Default"),
            EX(`<div class="ox-alert" role="status">
  <span class="ox-alert-icon">i</span>
  <div><strong>Heads up</strong>You'll reach your storage limit in 12 days.</div>
</div>`, "block"),
            H("Solid"),
            P("Use the solid variant for messages that need more weight, like errors."),
            EX(`<div class="ox-alert ox-alert-solid" role="alert">
  <span class="ox-alert-icon">!</span>
  <div><strong>Payment failed</strong>Update your card to keep your Pro plan.</div>
</div>`, "block"),
            H("API"),
            API([
              ["<code>.ox-alert</code>", "Base alert."],
              ["<code>.ox-alert-solid</code>", "Filled, high-emphasis variant."],
              ["<code>.ox-alert-icon</code>", "Round icon slot. Put a character or an SVG inside."]
            ])
          ]
        },
        {
          slug: "avatar",
          title: "Avatar",
          lead: "Represents a person with initials or a photo. Photos are shown in grayscale.",
          blocks: [
            H("Sizes and styles"),
            EX(`<span class="ox-avatar ox-avatar-sm">AL</span>
<span class="ox-avatar">GH</span>
<span class="ox-avatar ox-avatar-lg">AT</span>
<span class="ox-avatar ox-avatar-lg ox-avatar-solid">KJ</span>`),
            H("Stack"),
            EX(`<div class="ox-avatar-stack">
  <span class="ox-avatar ox-avatar-solid">AL</span>
  <span class="ox-avatar">GH</span>
  <span class="ox-avatar">AT</span>
  <span class="ox-avatar">+9</span>
</div>`),
            H("API"),
            API([
              ["<code>.ox-avatar</code>", "Base avatar. Put initials or an <code>&lt;img&gt;</code> inside."],
              ["<code>.ox-avatar-sm</code>, <code>.ox-avatar-lg</code>", "Sizes."],
              ["<code>.ox-avatar-solid</code>", "Filled variant."],
              ["<code>.ox-avatar-stack</code>", "Overlaps avatars in a row."]
            ])
          ]
        },
        {
          slug: "badge",
          title: "Badge",
          lead: "Small labels for status, counts and categories.",
          blocks: [
            H("Variants"),
            EX(`<span class="ox-badge ox-badge-solid">Solid</span>
<span class="ox-badge">Subtle</span>
<span class="ox-badge ox-badge-outline">Outline</span>
<span class="ox-badge ox-badge-dot">Dot</span>
<span class="ox-badge ox-badge-dot ox-badge-live">Live</span>`),
            H("API"),
            API([
              ["<code>.ox-badge</code>", "Base badge (subtle)."],
              ["<code>.ox-badge-solid</code>", "Filled."],
              ["<code>.ox-badge-outline</code>", "Transparent with a border."],
              ["<code>.ox-badge-dot</code>", "Adds a status dot."],
              ["<code>.ox-badge-live</code>", "Makes the dot pulse."]
            ])
          ]
        },
        {
          slug: "button",
          title: "Button",
          lead: "Triggers an action. Use one primary button per view for the most important action.",
          blocks: [
            H("Variants"),
            EX(`<button class="ox-btn">Primary</button>
<button class="ox-btn ox-btn-outline">Outline</button>
<button class="ox-btn ox-btn-ghost">Ghost</button>
<button class="ox-btn ox-btn-link">Link</button>`),
            H("Sizes"),
            EX(`<button class="ox-btn ox-btn-sm">Small</button>
<button class="ox-btn">Default</button>
<button class="ox-btn ox-btn-lg">Large</button>`),
            H("Pill and icon"),
            EX(`<button class="ox-btn ox-btn-pill">
  Continue
  <svg class="ox-arrow" viewBox="0 0 16 16"><path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>
<button class="ox-btn ox-btn-outline ox-btn-icon" aria-label="Search">
  <svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></g></svg>
</button>`),
            H("States"),
            EX(`<button class="ox-btn" data-loading="true">Saving</button>
<button class="ox-btn" disabled>Disabled</button>`),
            H("Full width"),
            EX(`<button class="ox-btn ox-btn-block">Create account</button>`, "block"),
            H("API"),
            API([
              ["<code>.ox-btn</code>", "Base button (primary)."],
              ["<code>.ox-btn-outline</code>, <code>-ghost</code>, <code>-link</code>", "Lower-emphasis variants."],
              ["<code>.ox-btn-sm</code>, <code>.ox-btn-lg</code>", "Sizes."],
              ["<code>.ox-btn-pill</code>", "Fully rounded corners."],
              ["<code>.ox-btn-icon</code>", "Square button for a single icon. Always add <code>aria-label</code>."],
              ["<code>.ox-btn-block</code>", "Fills the width of its container."],
              ["<code>data-loading=\"true\"</code>", "Shows a spinner and blocks clicks."],
              ["<code>.ox-arrow</code>", "Icon that nudges right on hover."]
            ])
          ]
        },
        {
          slug: "card",
          title: "Card",
          lead: "A container for related content and actions.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-card">
  <div class="ox-card-body">
    <h3 class="ox-card-title">Landing page v2</h3>
    <p class="ox-card-text">14 screens · edited 2 hours ago</p>
  </div>
  <div class="ox-card-footer ox-row ox-between">
    <span class="ox-badge ox-badge-outline">Draft</span>
    <button class="ox-btn ox-btn-sm">Open</button>
  </div>
</div>`, "block"),
            H("Interactive"),
            P("Add <code>.ox-card-interactive</code> for cards that are links — they lift slightly on hover."),
            EX(`<a href="#" class="ox-card ox-card-interactive" style="text-decoration:none;color:inherit">
  <div class="ox-card-body">
    <h3 class="ox-card-title">Design tokens</h3>
    <p class="ox-card-text">Learn how theming works.</p>
  </div>
</a>`, "block"),
            H("API"),
            API([
              ["<code>.ox-card</code>", "Container with border and radius."],
              ["<code>.ox-card-header</code>, <code>-body</code>, <code>-footer</code>", "Padded sections."],
              ["<code>.ox-card-title</code>, <code>.ox-card-text</code>", "Title and muted body text."],
              ["<code>.ox-card-interactive</code>", "Hover lift for clickable cards."]
            ])
          ]
        },
        {
          slug: "checkbox-radio",
          title: "Checkbox & Radio",
          lead: "Custom-drawn, monochrome selection controls built on native inputs.",
          blocks: [
            H("Checkbox"),
            EX(`<div class="ox-stack" style="gap:12px">
  <label class="ox-checkbox"><input type="checkbox" checked> Accept terms</label>
  <label class="ox-checkbox"><input type="checkbox"> Subscribe to updates</label>
</div>`),
            H("Radio"),
            EX(`<div class="ox-row">
  <label class="ox-radio"><input type="radio" name="billing" checked> Monthly</label>
  <label class="ox-radio"><input type="radio" name="billing"> Yearly</label>
</div>`),
            H("API"),
            API([
              ["<code>.ox-checkbox</code>", "Label wrapping a checkbox input."],
              ["<code>.ox-radio</code>", "Label wrapping a radio input."]
            ])
          ]
        },
        {
          slug: "code",
          title: "Code block",
          lead: "Preformatted code on a dark surface, in both themes.",
          blocks: [
            H("Example"),
            EX(`<pre class="ox-code"><span class="c">// Show a toast</span>
<span class="t">Onyx</span>.<span class="t">toast</span>(<span class="s">"Saved"</span>);</pre>`, "wide"),
            H("API"),
            API([
              ["<code>.ox-code</code>", "Applied to <code>&lt;pre&gt;</code>."],
              ["<code>.c</code>, <code>.t</code>, <code>.a</code>, <code>.s</code>", "Comment, token, attribute and string highlights."]
            ])
          ]
        },
        {
          slug: "dropdown",
          title: "Dropdown menu",
          lead: "A list of actions revealed by a button. Closes on outside click and Escape.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-dropdown">
  <button class="ox-btn ox-btn-outline" data-ox-dropdown-toggle aria-expanded="false" aria-haspopup="menu">Options</button>
  <div class="ox-dropdown-menu" role="menu">
    <div class="ox-dropdown-label">My account</div>
    <button class="ox-dropdown-item" role="menuitem">Profile <span class="ox-kbd">⇧P</span></button>
    <button class="ox-dropdown-item" role="menuitem">Billing <span class="ox-kbd">⌘B</span></button>
    <hr class="ox-separator">
    <button class="ox-dropdown-item" role="menuitem">Log out</button>
  </div>
</div>`, "left"),
            H("API"),
            API([
              ["<code>.ox-dropdown</code>", "Wrapper. Gets <code>data-open=\"true\"</code> when open."],
              ["<code>data-ox-dropdown-toggle</code>", "On the trigger button."],
              ["<code>.ox-dropdown-menu</code>", "The floating panel."],
              ["<code>.ox-dropdown-item</code>", "A menu action."],
              ["<code>.ox-dropdown-label</code>", "A small group heading."],
              ["<code>.ox-separator</code>", "A divider line between groups."]
            ])
          ]
        },
        {
          slug: "input",
          title: "Input",
          lead: "Text fields with labels, hints and validation states.",
          blocks: [
            H("Field"),
            EX(`<div class="ox-field">
  <label class="ox-label" for="ex-email">Email</label>
  <input class="ox-input" id="ex-email" type="email" placeholder="you@studio.com">
  <span class="ox-hint">We'll never share your email.</span>
</div>`, "block"),
            H("Invalid"),
            P("Add <code>data-invalid</code> to the field. The border turns dashed and the hint becomes the error message."),
            EX(`<div class="ox-field" data-invalid>
  <label class="ox-label" for="ex-user">Username</label>
  <input class="ox-input" id="ex-user" value="ada" aria-invalid="true" aria-describedby="ex-user-hint">
  <span class="ox-hint" id="ex-user-hint">That username is taken.</span>
</div>`, "block"),
            H("With icon and shortcut"),
            EX(`<div class="ox-input-group">
  <svg class="ox-input-icon" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></g></svg>
  <input class="ox-input" placeholder="Search…" aria-label="Search">
  <span class="ox-kbd">⌘K</span>
</div>`, "block"),
            H("API"),
            API([
              ["<code>.ox-field</code>", "Stacks label, input and hint."],
              ["<code>.ox-label</code>, <code>.ox-hint</code>", "Label and helper text."],
              ["<code>.ox-input</code>", "Text input."],
              ["<code>data-invalid</code>", "Error state on <code>.ox-field</code>."],
              ["<code>.ox-input-group</code>, <code>.ox-input-icon</code>", "Input with a leading icon and optional trailing <code>.ox-kbd</code>."]
            ])
          ]
        },
        {
          slug: "kbd",
          title: "Kbd",
          lead: "Displays a keyboard key or shortcut.",
          blocks: [
            H("Example"),
            EX(`<span class="ox-muted" style="font-size:14px">Press <span class="ox-kbd">Ctrl</span> <span class="ox-kbd">K</span> to search</span>`),
            H("API"),
            API([["<code>.ox-kbd</code>", "A single key."]])
          ]
        },
        {
          slug: "modal",
          title: "Modal",
          lead: "A dialog on top of the page. Traps focus, closes on Escape and backdrop click, and returns focus to the trigger.",
          blocks: [
            H("Example"),
            EX(`<button class="ox-btn" data-ox-modal-open="example-modal">Open dialog</button>

<div class="ox-modal" id="example-modal" role="dialog" aria-modal="true" aria-labelledby="example-modal-title" aria-hidden="true">
  <div class="ox-modal-dialog">
    <div class="ox-modal-header">
      <h3 class="ox-modal-title" id="example-modal-title">Archive project?</h3>
      <button class="ox-btn ox-btn-ghost ox-btn-sm ox-btn-icon" data-ox-modal-close aria-label="Close">✕</button>
    </div>
    <div class="ox-modal-body">You can restore it any time within 30 days.</div>
    <div class="ox-modal-footer">
      <button class="ox-btn ox-btn-outline" data-ox-modal-close>Cancel</button>
      <button class="ox-btn" data-ox-modal-close data-ox-toast="Project archived">Archive</button>
    </div>
  </div>
</div>`),
            H("From JavaScript"),
            CODE("js", `Onyx.modal.open("example-modal");
Onyx.modal.close("example-modal");`),
            H("API"),
            API([
              ["<code>.ox-modal</code>", "Full-screen backdrop. Needs an <code>id</code>."],
              ["<code>.ox-modal-dialog</code>", "The dialog panel."],
              ["<code>.ox-modal-header</code>, <code>-body</code>, <code>-footer</code>", "Sections."],
              ["<code>data-ox-modal-open=\"id\"</code>", "On any button, opens the modal."],
              ["<code>data-ox-modal-close</code>", "On any element inside, closes the modal."]
            ])
          ]
        },
        {
          slug: "navbar",
          title: "Navbar",
          lead: "A sticky, translucent top bar. A border appears once the page scrolls.",
          blocks: [
            H("Example"),
            EX(`<nav class="ox-navbar" style="position:relative;border:1px solid var(--ox-border);border-radius:12px">
  <div class="ox-container ox-navbar-inner">
    <strong>Studio</strong>
    <div class="ox-navbar-links">
      <a href="#">Work</a><a href="#">About</a><a href="#">Journal</a>
    </div>
    <button class="ox-btn ox-btn-sm ox-btn-pill">Contact</button>
  </div>
</nav>`, "wide"),
            H("API"),
            API([
              ["<code>.ox-navbar</code>", "Sticky bar with blur."],
              ["<code>.ox-navbar-inner</code>", "Flex row inside a container."],
              ["<code>.ox-navbar-links</code>", "Link group. Hidden under 760px."]
            ])
          ]
        },
        {
          slug: "progress",
          title: "Progress",
          lead: "Shows how far along a task is.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-progress" role="progressbar" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
  <div class="ox-progress-bar" style="--value:68%"></div>
</div>`, "block"),
            H("API"),
            API([
              ["<code>.ox-progress</code>", "Track. Add <code>role=\"progressbar\"</code> and <code>aria-valuenow</code>."],
              ["<code>.ox-progress-bar</code>", "Fill. Set its width with <code>--value</code>."]
            ])
          ]
        },
        {
          slug: "segmented",
          title: "Segmented control",
          lead: "A small set of mutually exclusive options, like a toggle between views.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-segmented" aria-label="View">
  <button value="list" aria-pressed="true">List</button>
  <button value="board" aria-pressed="false">Board</button>
  <button value="calendar" aria-pressed="false">Calendar</button>
</div>`),
            H("Listening for changes"),
            CODE("js", `document.querySelector(".ox-segmented").addEventListener("ox:change", (e) => {
  console.log(e.detail.value); // "list" | "board" | "calendar"
});`),
            H("API"),
            API([
              ["<code>.ox-segmented</code>", "Wrapper for the buttons."],
              ["<code>aria-pressed</code>", "Marks the selected button. Updated automatically."],
              ["<code>ox:change</code>", "Event fired with <code>detail.value</code>."]
            ])
          ]
        },
        {
          slug: "select",
          title: "Select & Textarea",
          lead: "Native select and multi-line text, styled to match inputs.",
          blocks: [
            H("Select"),
            EX(`<div class="ox-field">
  <label class="ox-label" for="ex-role">Role</label>
  <select class="ox-select" id="ex-role">
    <option>Designer</option><option>Engineer</option><option>Founder</option>
  </select>
</div>`, "block"),
            H("Textarea"),
            EX(`<div class="ox-field">
  <label class="ox-label" for="ex-msg">Message</label>
  <textarea class="ox-textarea" id="ex-msg" placeholder="Tell us about your project…"></textarea>
</div>`, "block"),
            H("API"),
            API([
              ["<code>.ox-select</code>", "Native select with a custom arrow."],
              ["<code>.ox-textarea</code>", "Resizable multi-line input."]
            ])
          ]
        },
        {
          slug: "skeleton-spinner",
          title: "Skeleton & Spinner",
          lead: "Placeholders and indicators for content that is loading.",
          blocks: [
            H("Skeleton"),
            EX(`<div class="ox-row" style="flex-wrap:nowrap;width:100%;max-width:360px">
  <div class="ox-skeleton" style="width:40px;height:40px;border-radius:50%;flex-shrink:0"></div>
  <div class="ox-stack" style="gap:8px;flex:1">
    <div class="ox-skeleton" style="height:10px;width:70%"></div>
    <div class="ox-skeleton" style="height:10px;width:40%"></div>
  </div>
</div>`),
            H("Spinner"),
            EX(`<div class="ox-spinner" role="status" aria-label="Loading"></div>`),
            H("API"),
            API([
              ["<code>.ox-skeleton</code>", "Shimmering block. Size it with width and height."],
              ["<code>.ox-spinner</code>", "Rotating ring. Add <code>aria-label</code>."]
            ])
          ]
        },
        {
          slug: "switch",
          title: "Switch",
          lead: "An on/off toggle for settings that take effect immediately.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-stack" style="gap:12px">
  <label class="ox-switch"><input type="checkbox" checked><span class="ox-switch-track"></span>Email notifications</label>
  <label class="ox-switch"><input type="checkbox"><span class="ox-switch-track"></span>Weekly digest</label>
</div>`),
            H("API"),
            API([
              ["<code>.ox-switch</code>", "Label wrapping a checkbox."],
              ["<code>.ox-switch-track</code>", "The visual track. Must come right after the input."]
            ])
          ]
        },
        {
          slug: "tabs",
          title: "Tabs",
          lead: "Switch between related views. Supports arrow-key navigation.",
          blocks: [
            H("Example"),
            EX(`<div>
  <div class="ox-tabs-list" role="tablist" aria-label="Project">
    <button class="ox-tab" role="tab" aria-selected="true" aria-controls="ex-p1" id="ex-t1">Overview</button>
    <button class="ox-tab" role="tab" aria-selected="false" aria-controls="ex-p2" id="ex-t2" tabindex="-1">Activity</button>
    <button class="ox-tab" role="tab" aria-selected="false" aria-controls="ex-p3" id="ex-t3" tabindex="-1">Settings</button>
  </div>
  <div class="ox-tab-panel" role="tabpanel" id="ex-p1" aria-labelledby="ex-t1">Overview content.</div>
  <div class="ox-tab-panel" role="tabpanel" id="ex-p2" aria-labelledby="ex-t2" hidden>Activity content.</div>
  <div class="ox-tab-panel" role="tabpanel" id="ex-p3" aria-labelledby="ex-t3" hidden>Settings content.</div>
</div>`, "block"),
            H("API"),
            API([
              ["<code>.ox-tabs-list</code>", "Row of tabs. Needs <code>role=\"tablist\"</code>."],
              ["<code>.ox-tab</code>", "A tab. Link it to its panel with <code>aria-controls</code>."],
              ["<code>.ox-tab-panel</code>", "Content. Hide inactive panels with <code>hidden</code>."]
            ])
          ]
        },
        {
          slug: "toast",
          title: "Toast",
          lead: "A brief confirmation that appears in the corner and disappears by itself.",
          blocks: [
            H("Example"),
            EX(`<button class="ox-btn" data-ox-toast="Your changes have been saved">Show toast</button>`),
            H("From JavaScript"),
            CODE("js", `Onyx.toast("Saved");
Onyx.toast("Link copied", { duration: 5000 });`),
            H("API"),
            API([
              ["<code>data-ox-toast=\"text\"</code>", "Shows a toast on click."],
              ["<code>Onyx.toast(text, { duration })</code>", "Shows a toast from code. Default duration is 2800ms."]
            ])
          ]
        },
        {
          slug: "tooltip",
          title: "Tooltip",
          lead: "A short label shown on hover and focus. Pure CSS.",
          blocks: [
            H("Example"),
            EX(`<button class="ox-btn ox-btn-outline" data-ox-tooltip="Copy to clipboard">Hover me</button>`),
            H("API"),
            API([["<code>data-ox-tooltip=\"text\"</code>", "The tooltip text."]]),
            NOTE("<b>Keep it short.</b> Tooltips don't wrap. For icon-only buttons, also add <code>aria-label</code> — tooltips aren't read by screen readers.")
          ]
        }
      ]
    },

    {
      group: "Pro",
      pro: true,
      pages: [
        {
          slug: "pro",
          title: "About Onyx Pro",
          lead: "Advanced components and full page templates for real products. Included with the Pro and Team plans.",
          blocks: [
            H("What's included"),
            LIST([
              "<strong>Charts</strong> — line, area, bar and donut, with tooltips, drawn in pure SVG.",
              "<strong>Data table</strong> — sorting, search, row selection and pagination from a plain array.",
              "<strong>Command menu</strong> — a <code>Ctrl K</code> palette with fuzzy search.",
              "<strong>Stat cards</strong>, <strong>sheets</strong>, <strong>steppers</strong> and <strong>file dropzones</strong>.",
              "<strong>App shell</strong> — a responsive sidebar layout for dashboards and admin tools.",
              "<strong>Templates</strong> — complete pages you can copy and ship."
            ]),
            H("Installation"),
            P("Add the Pro files after the Onyx core files."),
            CODE("html", `<link rel="stylesheet" href="onyx.css">
<link rel="stylesheet" href="onyx-pro.css">

<script src="onyx.js"></script>
<script src="onyx-pro.js"></script>`, "index.html"),
            H("Templates"),
            { type: "cards", items: [
              ["template-dashboard", "Dashboard", "Analytics overview with charts, orders table and command menu."]
            ] },
            NOTE("<b>License.</b> Onyx Pro is covered by a commercial license. You can use it in unlimited projects for yourself or your clients, but you can't resell or redistribute the Pro source files.")
          ]
        },
        {
          slug: "charts",
          title: "Charts",
          lead: "Monochrome SVG charts. Series are told apart by line style and shade instead of color.",
          blocks: [
            H("Area"),
            EX(`<div id="demo-area" style="width:100%"></div>`, "wide", `OnyxPro.chart("#demo-area", {
  type: "area",
  height: 220,
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  series: [
    { name: "This year", data: [12, 19, 15, 24, 22, 31, 28, 36] },
    { name: "Last year", data: [10, 13, 14, 16, 19, 18, 22, 25] }
  ],
  format: (v) => v + "k",
  legend: true
});`),
            H("Bar"),
            EX(`<div id="demo-bar" style="width:100%"></div>`, "wide", `OnyxPro.chart("#demo-bar", {
  type: "bar",
  height: 220,
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  series: [
    { name: "Online", data: [182, 205, 196, 240, 288, 312, 226] },
    { name: "In-store", data: [96, 110, 104, 120, 164, 230, 190] }
  ],
  legend: true
});`),
            H("Donut"),
            EX(`<div id="demo-donut" style="width:240px"></div>`, "", `OnyxPro.chart("#demo-donut", {
  type: "donut",
  height: 240,
  labels: ["Online", "Retail", "Wholesale"],
  series: [{ name: "Revenue", data: [248, 129, 64] }],
  format: (v) => "$" + v + "k",
  centerLabel: "Revenue",
  legend: true
});`),
            H("Sparkline"),
            EX(`<div id="demo-spark"></div>`, "", `OnyxPro.sparkline("#demo-spark", [4, 6, 5, 8, 7, 11, 10, 14]);`),
            H("API"),
            API([
              ["<code>type</code>", "<code>\"line\"</code>, <code>\"area\"</code>, <code>\"bar\"</code> or <code>\"donut\"</code>."],
              ["<code>labels</code>", "X-axis labels (or slice names for donut)."],
              ["<code>series</code>", "<code>[{ name, data: [numbers] }]</code>. Up to 3 for line, 5 for bar."],
              ["<code>height</code>", "Height in pixels. Width always fills the container."],
              ["<code>format</code>", "Function that formats values in tooltips."],
              ["<code>legend</code>", "Show a legend under the chart."],
              ["<code>centerLabel</code>", "Text under the total in a donut."],
              ["<code>.update(options)</code>", "Returned method: redraw with new data."]
            ], ["Option", "Description"])
          ]
        },
        {
          slug: "data-table",
          title: "Data table",
          lead: "A table built from an array of objects, with sorting, search, selection and pagination.",
          blocks: [
            H("Example"),
            EX(`<div id="demo-table" style="width:100%"></div>`, "wide left", `const table = OnyxPro.DataTable("#demo-table", {
  selectable: true,
  pageSize: 5,
  columns: [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status",
      render: (r) => '<span class="oxp-status" data-status="' + r.status + '">' + r.status + '</span>' },
    { key: "projects", label: "Projects", align: "right" }
  ],
  rows: [
    { name: "Ada Lovelace", role: "Owner", status: "paid", projects: 14 },
    { name: "Grace Hopper", role: "Editor", status: "pending", projects: 9 },
    { name: "Alan Turing", role: "Viewer", status: "paid", projects: 3 },
    { name: "Katherine Johnson", role: "Editor", status: "failed", projects: 11 },
    { name: "Margaret Hamilton", role: "Owner", status: "paid", projects: 21 },
    { name: "Radia Perlman", role: "Viewer", status: "paid", projects: 6 },
    { name: "Barbara Liskov", role: "Editor", status: "pending", projects: 8 }
  ]
});`),
            H("API"),
            API([
              ["<code>columns</code>", "<code>[{ key, label, align, sortable, render(row), sortValue(row) }]</code>. Values are escaped unless you provide <code>render</code>."],
              ["<code>rows</code>", "Array of objects. An <code>id</code> field is used for selection when present."],
              ["<code>pageSize</code>", "Rows per page. Default 8."],
              ["<code>selectable</code>", "Adds row checkboxes and a select-all checkbox."],
              ["<code>searchable</code>, <code>searchPlaceholder</code>", "Show a search box (default on)."],
              ["<code>actions</code>", "HTML for buttons in the toolbar."],
              ["<code>onSelect(rows)</code>", "Called when the selection changes."],
              ["<code>.setRows(rows)</code>, <code>.getSelected()</code>, <code>.clearSelection()</code>", "Returned methods."]
            ], ["Option", "Description"])
          ]
        },
        {
          slug: "command-menu",
          title: "Command menu",
          lead: "A keyboard-first palette for actions and navigation, with fuzzy search.",
          blocks: [
            H("Example"),
            P("Click the button, or press <code>Ctrl K</code> while this page is open. Try typing <code>dk</code>."),
            EX(`<button class="ox-btn ox-btn-outline" id="demo-cmd">Open command menu</button>`, "", `const menu = OnyxPro.command({
  hotkey: false, // the docs already use Ctrl K for search
  items: [
    { group: "Actions", label: "Create invoice", shortcut: "N", action: () => Onyx.toast("Invoice created") },
    { group: "Actions", label: "Toggle dark mode", keywords: "theme", action: () => Onyx.theme.set(Onyx.theme.get() === "dark" ? "light" : "dark") },
    { group: "Navigate", label: "Dashboard", hint: "Overview" },
    { group: "Navigate", label: "Settings", keywords: "preferences" }
  ]
});
document.getElementById("demo-cmd").addEventListener("click", menu.open);`),
            H("API"),
            API([
              ["<code>items</code>", "<code>[{ group, label, hint, shortcut, keywords, icon, action(), href }]</code>."],
              ["<code>placeholder</code>", "Input placeholder text."],
              ["<code>hotkey</code>", "Bind <code>Ctrl/⌘ K</code> to open and close. Default <code>true</code>."],
              ["<code>.open()</code>, <code>.close()</code>, <code>.setItems(items)</code>", "Returned methods."]
            ], ["Option", "Description"])
          ]
        },
        {
          slug: "stat-card",
          title: "Stat card",
          lead: "A key number with its change and a sparkline.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-card oxp-stat" style="width:280px">
  <div class="oxp-stat-label">Revenue</div>
  <div class="oxp-stat-value">$48,210</div>
  <div class="oxp-stat-foot">
    <span class="oxp-delta" data-trend="up">12.4% <small>vs last month</small></span>
    <div id="demo-stat-spark"></div>
  </div>
</div>`, "", `OnyxPro.sparkline("#demo-stat-spark", [30, 34, 31, 40, 38, 46, 52]);`),
            H("API"),
            API([
              ["<code>.oxp-stat</code>", "Add to an <code>.ox-card</code>."],
              ["<code>.oxp-stat-label</code>, <code>-value</code>, <code>-foot</code>", "Parts."],
              ["<code>.oxp-delta[data-trend]</code>", "<code>up</code> or <code>down</code> adds an arrow."]
            ])
          ]
        },
        {
          slug: "sheet",
          title: "Sheet",
          lead: "A panel that slides in from the side. It's a modal, so it uses the same attributes.",
          blocks: [
            H("Example"),
            EX(`<button class="ox-btn" data-ox-modal-open="demo-sheet">Open sheet</button>

<div class="ox-modal oxp-sheet" id="demo-sheet" role="dialog" aria-modal="true" aria-labelledby="demo-sheet-title" aria-hidden="true">
  <div class="ox-modal-dialog">
    <div class="ox-modal-header">
      <h3 class="ox-modal-title" id="demo-sheet-title">Edit profile</h3>
      <button class="ox-btn ox-btn-ghost ox-btn-sm ox-btn-icon" data-ox-modal-close aria-label="Close">✕</button>
    </div>
    <div class="ox-modal-body ox-stack">
      <div class="ox-field"><label class="ox-label" for="sh-name">Name</label><input class="ox-input" id="sh-name" value="Ada Lovelace"></div>
      <div class="ox-field"><label class="ox-label" for="sh-mail">Email</label><input class="ox-input" id="sh-mail" value="ada@example.com"></div>
    </div>
    <div class="ox-modal-footer">
      <button class="ox-btn ox-btn-outline" data-ox-modal-close>Cancel</button>
      <button class="ox-btn" data-ox-modal-close data-ox-toast="Profile saved">Save</button>
    </div>
  </div>
</div>`),
            H("API"),
            API([
              ["<code>.ox-modal.oxp-sheet</code>", "Turns a modal into a right-side sheet."],
              ["<code>.left</code>", "Slide in from the left instead."]
            ])
          ]
        },
        {
          slug: "stepper",
          title: "Stepper",
          lead: "Shows progress through a multi-step flow.",
          blocks: [
            H("Example"),
            EX(`<ol class="oxp-steps">
  <li data-state="done"><b>Account</b></li>
  <li data-state="current"><b>Workspace</b></li>
  <li><b>Invite team</b></li>
</ol>`, "block"),
            H("API"),
            API([
              ["<code>.oxp-steps</code>", "On an <code>&lt;ol&gt;</code>. Steps are numbered automatically."],
              ["<code>data-state</code>", "<code>done</code> or <code>current</code> on an <code>&lt;li&gt;</code>."]
            ])
          ]
        },
        {
          slug: "dropzone",
          title: "Dropzone",
          lead: "A drag-and-drop file picker that lists the chosen files.",
          blocks: [
            H("Example"),
            EX(`<div>
  <label class="oxp-dropzone" data-oxp-files="#demo-files">
    <span><b>Click to upload</b> or drag and drop</span>
    <span class="ox-subtle" style="font-size:12px">PDF, PNG or JPG up to 10 MB</span>
    <input type="file" multiple>
  </label>
  <ul class="oxp-files" id="demo-files"></ul>
</div>`, "block"),
            H("Getting the files"),
            CODE("js", `document.querySelector(".oxp-dropzone").addEventListener("oxp:files", (e) => {
  console.log(e.detail.files); // FileList
});`),
            H("API"),
            API([
              ["<code>.oxp-dropzone</code>", "A <code>&lt;label&gt;</code> containing a file input."],
              ["<code>data-oxp-files</code>", "Selector of a <code>.oxp-files</code> list to show chosen files."],
              ["<code>oxp:files</code>", "Event with <code>detail.files</code>."]
            ])
          ]
        },
        {
          slug: "template-dashboard",
          title: "Dashboard template",
          lead: "A complete analytics dashboard: app shell, stat cards, charts, an orders table, a command menu and a sheet.",
          blocks: [
            H("Preview"),
            NOTE('<b>Included with Pro and Team.</b> Customers get the full template source along with the Pro components.'),
            H("What's inside"),
            LIST([
              "Responsive sidebar layout (<code>.oxp-shell</code>) that becomes a drawer on phones.",
              "Four stat cards with sparklines.",
              "Area chart with a 7 / 30 / 90-day range switch, a donut and a grouped bar chart.",
              "Orders table with search, sort, selection and CSV export of the selected rows.",
              "<code>Ctrl K</code> command menu and a “New invoice” sheet with a stepper and file upload."
            ]),
            H("Using it"),
            P("Copy <code>pro/templates/dashboard.html</code> into your project, fix the paths to the CSS and JS files, and replace the sample data with your own.")
          ]
        }
      ]
    },

    {
      group: "Utilities",
      pages: [
        {
          slug: "layout",
          title: "Layout",
          lead: "Small helpers for arranging components.",
          blocks: [
            H("Row"),
            EX(`<div class="ox-row">
  <span class="ox-badge">One</span><span class="ox-badge">Two</span><span class="ox-badge">Three</span>
</div>`),
            H("Stack"),
            EX(`<div class="ox-stack">
  <span class="ox-badge">One</span><span class="ox-badge">Two</span><span class="ox-badge">Three</span>
</div>`),
            H("Divider"),
            EX(`<div class="ox-divider">OR</div>`, "block"),
            H("API"),
            API([
              ["<code>.ox-container</code>", "Centered, max 1160px wide, with side padding."],
              ["<code>.ox-row</code>", "Horizontal flex with wrapping and gap."],
              ["<code>.ox-between</code>", "Adds <code>justify-content: space-between</code>."],
              ["<code>.ox-stack</code>", "Vertical flex with gap."],
              ["<code>.ox-grid</code>", "Responsive auto-fit grid (min 260px columns)."],
              ["<code>.ox-divider</code>", "Horizontal rule with a centered label."],
              ["<code>.ox-sr-only</code>", "Visually hidden but readable by screen readers."]
            ])
          ]
        },
        {
          slug: "typography",
          title: "Typography",
          lead: "Type styles for headings, body text and labels.",
          blocks: [
            H("Scale"),
            EX(`<div class="ox-stack" style="gap:12px">
  <div class="ox-display" style="font-size:3rem">Display</div>
  <div class="ox-h1">Heading one</div>
  <div class="ox-h2">Heading two</div>
  <p class="ox-lead" style="margin:0">Lead paragraph for introductions.</p>
  <span class="ox-eyebrow">Eyebrow label</span>
</div>`, "left"),
            H("API"),
            API([
              ["<code>.ox-display</code>", "Hero headline, 40–80px."],
              ["<code>.ox-h1</code>, <code>.ox-h2</code>", "Section headings."],
              ["<code>.ox-lead</code>", "Larger, muted introduction text."],
              ["<code>.ox-eyebrow</code>", "Small uppercase mono label."],
              ["<code>.ox-muted</code>, <code>.ox-subtle</code>", "Secondary and tertiary text colors."],
              ["<code>.ox-mono</code>", "Monospace font."]
            ])
          ]
        }
      ]
    }
  ];
})();
