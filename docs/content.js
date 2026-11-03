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
            CODE("bash", `npm install @onyxdesign/core`, "Terminal"),
            P("Then import it once at the entry point of your app:"),
            CODE("js", `import "@onyxdesign/core/src/onyx.css";
import "@onyxdesign/core/src/onyx.js";`, "main.js"),
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
Onyx.copy("npm i @onyxdesign/core");      // copies and shows a toast

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
      ,
        {
          slug: "react",
          title: "React",
          lead: "Onyx as typed React components. Behavior lives in the components, so there's no script to add.",
          blocks: [
            H("Install"),
            CODE("bash", `npm install @onyxdesign/react`, "Terminal"),
            P("Import the styles once at the root of your app, and add the <code>ox</code> class to <code>&lt;body&gt;</code>."),
            CODE("js", `import "@onyxdesign/react/styles.css";`, "main.tsx"),
            H("Example"),
            CODE("js", `import { Button, Field, Input, Modal, ToastProvider, useToast } from "@onyxdesign/react";
import { useState } from "react";

function Invite() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite teammate</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite a teammate"
        footer={<Button onClick={() => { setOpen(false); toast("Invite sent"); }}>Send</Button>}
      >
        <Field label="Email" hint="They'll get a link to join.">
          <Input type="email" />
        </Field>
      </Modal>
    </>
  );
}

export default function App() {
  return <ToastProvider><Invite /></ToastProvider>;
}`, "App.tsx"),
            H("Components"),
            API([
              ["Actions", "<code>Button</code>, <code>SegmentedControl</code>"],
              ["Forms", "<code>Field</code>, <code>Input</code>, <code>Textarea</code>, <code>Select</code>, <code>Checkbox</code>, <code>Radio</code>, <code>Switch</code>"],
              ["Layout", "<code>Container</code>, <code>Stack</code>, <code>Row</code>, <code>Divider</code>, <code>Card</code> and its parts"],
              ["Display", "<code>Badge</code>, <code>Avatar</code>, <code>AvatarStack</code>, <code>Kbd</code>, <code>Alert</code>, <code>Progress</code>, <code>Spinner</code>, <code>Skeleton</code>"],
              ["Overlays", "<code>Modal</code>, <code>DropdownMenu</code>, <code>Tooltip</code>"],
              ["Navigation", "<code>Tabs</code>, <code>TabList</code>, <code>Tab</code>, <code>TabPanel</code>, <code>Accordion</code>, <code>AccordionItem</code>"],
              ["Providers", "<code>ToastProvider</code> + <code>useToast</code>, <code>ThemeProvider</code> + <code>useTheme</code>"]
            ], ["Group", "Components"]),
            H("Accessibility built in"),
            LIST([
              "<code>Field</code> links the label, hint and error to the control and marks it invalid.",
              "<code>Modal</code> traps focus, closes on Escape and returns focus to what opened it.",
              "<code>Tabs</code> and <code>DropdownMenu</code> work with arrow keys, Home and End.",
              "<code>Switch</code> uses the switch role, and <code>Progress</code> reports its value."
            ]),
            H("Theme"),
            CODE("js", `import { ThemeProvider, useTheme, Button } from "@onyxdesign/react";

function ThemeButton() {
  const { resolved, toggle } = useTheme();
  return <Button variant="ghost" onClick={toggle}>{resolved === "dark" ? "Light" : "Dark"}</Button>;
}

// "system" follows the OS; the choice is remembered
<ThemeProvider defaultTheme="system">{/* app */}</ThemeProvider>`, "Theme.tsx")
          ]
        }
      ]
    },

    {
      group: "Foundations",
      pages: [
        {
          slug: "color",
          title: "Color",
          lead: "Ten color tokens, two palettes. Values below are read live from the stylesheet, so switch the theme and they change. Click a swatch to copy it.",
          blocks: [
            H("Tokens"),
            EX(`<div id="fd-colors" class="fd-swatches"></div>`, "wide", `const tokens = [
  ["bg", "Page background"], ["bg-subtle", "Slightly raised areas"], ["bg-muted", "Hover and pressed fills"],
  ["surface", "Cards, inputs, menus"], ["border", "Hairlines"], ["border-strong", "Hover borders, dividers"],
  ["fg", "Text and solid fills"], ["fg-muted", "Secondary text"], ["fg-subtle", "Tertiary text, placeholders"],
  ["inverse", "Text on solid fills"]
];
const root = document.getElementById("fd-colors");
const css = getComputedStyle(root);
root.innerHTML = tokens.map(([t, use]) =>
  '<button class="fd-swatch" data-copy-token="var(--ox-' + t + ')">' +
    '<span class="fd-chip" style="background:var(--ox-' + t + ')"></span>' +
    '<b>--ox-' + t + '</b><span>' + css.getPropertyValue("--ox-" + t).trim() + '</span><small>' + use + '</small>' +
  '</button>').join("");`),
            H("Inverting"),
            P("Add <code>.ox-invert</code> to any element and these tokens flip to the other palette inside it."),
            NOTE("<b>Want color?</b> Change <code>--ox-fg</code> to tint every button, link and focus ring at once, or build a full theme in the <a href=\"/studio/\">Theme Studio</a>.")
          ]
        },
        {
          slug: "typography-scale",
          title: "Type scale",
          lead: "Eight text sizes on a calm scale, set in Geist and Geist Mono.",
          blocks: [
            H("Scale"),
            EX(`<div id="fd-type" class="fd-list"></div>`, "wide", `const sizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];
const root = document.getElementById("fd-type");
const css = getComputedStyle(root);
root.innerHTML = sizes.map(s => {
  const v = css.getPropertyValue("--ox-text-" + s).trim();
  return '<button class="fd-row" data-copy-token="var(--ox-text-' + s + ')"><code>--ox-text-' + s + '</code><span class="fd-meta">' + v + ' · ' + Math.round(parseFloat(v) * 16) + 'px</span>' +
    '<span style="font-size:var(--ox-text-' + s + ');letter-spacing:-0.02em;font-weight:500">The quick brown fox</span></button>';
}).join("");`),
            H("Families"),
            API([
              ["<code>--ox-font-sans</code>", "Geist, falling back to the system font. All interface text."],
              ["<code>--ox-font-mono</code>", "Geist Mono. Code, keyboard keys, numbers in tables."]
            ], ["Token", "Use"])
          ]
        },
        {
          slug: "spacing",
          title: "Spacing",
          lead: "A 4px grid. Every gap and padding in Onyx is one of these steps.",
          blocks: [
            H("Scale"),
            EX(`<div id="fd-space" class="fd-list"></div>`, "wide", `const steps = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
const root = document.getElementById("fd-space");
const css = getComputedStyle(root);
root.innerHTML = steps.map(n => {
  const v = css.getPropertyValue("--ox-space-" + n).trim();
  return '<button class="fd-row" data-copy-token="var(--ox-space-' + n + ')"><code>--ox-space-' + n + '</code><span class="fd-meta">' + v + ' · ' + Math.round(parseFloat(v) * 16) + 'px</span>' +
    '<span class="fd-bar" style="width:var(--ox-space-' + n + ')"></span></button>';
}).join("");`)
          ]
        },
        {
          slug: "radius-elevation",
          title: "Radius & elevation",
          lead: "Four corner radii and three shadows. Together they set how soft or crisp Onyx feels.",
          blocks: [
            H("Radius"),
            EX(`<div id="fd-radius" class="fd-tiles"></div>`, "wide", `const r = [["sm", "Small buttons, menu items"], ["", "Buttons, inputs"], ["lg", "Cards, alerts"], ["xl", "Modals, large panels"], ["full", "Pills, avatars"]];
const root = document.getElementById("fd-radius");
const css = getComputedStyle(root);
root.innerHTML = r.map(([k, use]) => {
  const name = "--ox-radius" + (k ? "-" + k : "");
  return '<button class="fd-tile" data-copy-token="var(' + name + ')"><span class="fd-shape" style="border-radius:var(' + name + ')"></span><b>' + name + '</b><span>' + css.getPropertyValue(name).trim() + '</span><small>' + use + '</small></button>';
}).join("");`),
            H("Elevation"),
            EX(`<div id="fd-shadow" class="fd-tiles"></div>`, "wide", `const s = [["sm", "Resting cards"], ["", "Hover, dropdowns"], ["lg", "Modals, popovers"]];
document.getElementById("fd-shadow").innerHTML = s.map(([k, use]) => {
  const name = "--ox-shadow" + (k ? "-" + k : "");
  return '<button class="fd-tile" data-copy-token="var(' + name + ')"><span class="fd-shape" style="box-shadow:var(' + name + ');border-color:transparent"></span><b>' + name + '</b><small>' + use + '</small></button>';
}).join("");`)
          ]
        },
        {
          slug: "motion",
          title: "Motion",
          lead: "One easing curve and one base duration keep every transition consistent. Motion turns off for people who ask for reduced motion.",
          blocks: [
            H("Try it"),
            EX(`<div class="fd-motion">
  <div class="fd-track"><span class="fd-dot" id="fd-dot"></span></div>
  <button class="ox-btn ox-btn-outline ox-btn-sm" id="fd-play">Play</button>
</div>`, "wide", `const dot = document.getElementById("fd-dot");
document.getElementById("fd-play").addEventListener("click", () => dot.classList.toggle("go"));`),
            H("Tokens"),
            API([
              ["<code>--ox-ease</code>", "<code>cubic-bezier(0.2, 0.8, 0.2, 1)</code>. Starts quick, settles gently."],
              ["<code>--ox-duration</code>", "160ms. Hovers and small state changes. Larger movements use 220–360ms."],
              ["<code>prefers-reduced-motion</code>", "Onyx shortens every animation to almost nothing when this is on."]
            ], ["Token", "Value"])
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
            H("Status"),
            EX(`<span class="ox-avatar ox-avatar-solid" data-status="online">AL</span>
<span class="ox-avatar" data-status="away">GH</span>
<span class="ox-avatar" data-status="offline">AT</span>`),
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
              ["<code>.ox-avatar-stack</code>", "Overlaps avatars in a row."],
              ["<code>data-status</code>", "<code>online</code>, <code>away</code> or <code>offline</code> adds a presence dot."]
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
            H("Mobile menu"),
            P("Add a toggle and a menu. Below 760px the links hide and the toggle opens the menu."),
            CODE("html", `<nav class="ox-navbar">
  <div class="ox-container ox-navbar-inner">
    <a href="/">Studio</a>
    <div class="ox-navbar-links"><a href="/work">Work</a><a href="/about">About</a></div>
    <button class="ox-navbar-toggle" data-ox-nav-toggle aria-expanded="false" aria-label="Open menu"><span></span><span></span></button>
  </div>
  <div class="ox-navbar-menu">
    <a href="/work">Work</a><a href="/about">About</a>
  </div>
</nav>`, "index.html"),
            H("API"),
            API([
              ["<code>.ox-navbar</code>", "Sticky bar with blur."],
              ["<code>.ox-navbar-inner</code>", "Flex row inside a container."],
              ["<code>.ox-navbar-links</code>", "Link group. Hidden on small screens, where the menu takes over."],
              ["<code>.ox-navbar-toggle</code> + <code>data-ox-nav-toggle</code>", "Menu button (two lines that turn into an X). Contains two empty <code>&lt;span&gt;</code>s."],
              ["<code>.ox-navbar-menu</code>", "Full-screen menu for small screens. Closes on Escape, on a link tap, or when the window grows."],
              ["<code>data-collapse=\"lg\"</code>", "On <code>.ox-navbar</code>: switch to the menu below 1024px instead of 760px."]
            ])
          ]
        },
        {
          slug: "progress",
          title: "Progress",
          lead: "Shows how far along a task is.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-progress" role="progressbar" aria-label="Upload progress" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
  <div class="ox-progress-bar" style="--value:68%"></div>
</div>`, "block"),
            H("API"),
            API([
              ["<code>.ox-progress</code>", "Track. Add <code>role=\"progressbar\"</code>, <code>aria-valuenow</code> and an <code>aria-label</code> that says what is progressing."],
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
      ,
        {
          slug: "banner",
          title: "Banner",
          lead: "A full-width announcement bar. Dismissing it is remembered when it has a name.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-banner" style="width:100%;border-radius:8px">
  <span><b>Onyx 1.1</b> is here.</span>
  <a href="#">See what's new</a>
  <button class="ox-banner-close" data-ox-dismiss aria-label="Dismiss">✕</button>
</div>`, "wide"),
            H("API"),
            API([
              ["<code>.ox-banner</code>", "The bar. Put it first in <code>&lt;body&gt;</code>."],
              ["<code>data-ox-dismiss</code>", "On a button inside, hides the banner."],
              ["<code>data-ox-banner=\"name\"</code>", "Remembers the dismissal in this browser, so it stays hidden."]
            ])
          ]
        },
        {
          slug: "breadcrumb",
          title: "Breadcrumb",
          lead: "Shows where the current page sits in the hierarchy.",
          blocks: [
            H("Example"),
            EX(`<nav class="ox-breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="#">Workspace</a></li>
    <li><a href="#">Projects</a></li>
    <li><span aria-current="page">Landing v2</span></li>
  </ol>
</nav>`),
            H("API"),
            API([
              ["<code>.ox-breadcrumb</code>", "On a <code>&lt;nav aria-label=\"Breadcrumb\"&gt;</code> with an <code>&lt;ol&gt;</code> inside."],
              ["<code>aria-current=\"page\"</code>", "Marks the current page."]
            ])
          ]
        },
        {
          slug: "chips",
          title: "Chips",
          lead: "Toggleable filters. Several can be on at once, or just one with data-single.",
          blocks: [
            H("Multiple"),
            EX(`<div class="ox-chips" aria-label="Filter by team">
  <button class="ox-chip" aria-pressed="true">Design</button>
  <button class="ox-chip" aria-pressed="false">Engineering</button>
  <button class="ox-chip" aria-pressed="false">Marketing</button>
</div>`),
            H("Single choice"),
            EX(`<div class="ox-chips" data-single aria-label="Sort by">
  <button class="ox-chip" aria-pressed="true">Newest</button>
  <button class="ox-chip" aria-pressed="false">Popular</button>
  <button class="ox-chip" aria-pressed="false">A–Z</button>
</div>`),
            H("API"),
            API([
              ["<code>.ox-chips</code>", "Group. Fires <code>ox:change</code> with <code>detail.value</code>, the selected labels (or <code>value</code> attributes)."],
              ["<code>.ox-chip</code>", "A button. <code>aria-pressed</code> holds its state."],
              ["<code>data-single</code>", "Only one chip can be on."]
            ])
          ]
        },
        {
          slug: "empty-state",
          title: "Empty state",
          lead: "What to show when there's nothing yet, with a clear next step.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-empty" style="width:100%">
  <span class="ox-empty-icon" aria-hidden="true">◌</span>
  <h3 class="ox-empty-title">No projects yet</h3>
  <p class="ox-empty-text">Projects you create or are invited to will show up here.</p>
  <button class="ox-btn ox-btn-pill">Create project</button>
</div>`, "wide"),
            H("API"),
            API([
              ["<code>.ox-empty</code>", "Dashed container."],
              ["<code>.ox-empty-icon</code>, <code>-title</code>, <code>-text</code>", "Parts."]
            ])
          ]
        },
        {
          slug: "number-stepper",
          title: "Number stepper",
          lead: "A number input with minus and plus buttons. Respects min, max and step.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-stepper">
  <button type="button" data-step="-1" aria-label="Decrease">−</button>
  <input type="number" value="2" min="1" max="8" aria-label="Guests">
  <button type="button" data-step="1" aria-label="Increase">+</button>
</div>`),
            H("API"),
            API([
              ["<code>.ox-stepper</code>", "Wrapper around the buttons and input."],
              ["<code>data-step=\"-1\"</code> / <code>\"1\"</code>", "Decrease and increase buttons. Disabled automatically at the limits."],
              ["<code>min</code>, <code>max</code>, <code>step</code>", "Standard input attributes. Fires <code>input</code> and <code>change</code> on each step."]
            ])
          ]
        },
        {
          slug: "pagination",
          title: "Pagination",
          lead: "Moves between pages of results.",
          blocks: [
            H("Example"),
            EX(`<nav class="ox-pagination" aria-label="Pagination">
  <ul>
    <li><a href="#" aria-label="Previous page">‹</a></li>
    <li><a href="#">1</a></li>
    <li><span class="ox-gap" aria-hidden="true">…</span></li>
    <li><a href="#">4</a></li>
    <li><span aria-current="page">5</span></li>
    <li><a href="#">6</a></li>
    <li><span class="ox-gap" aria-hidden="true">…</span></li>
    <li><a href="#">12</a></li>
    <li><a href="#" aria-label="Next page">›</a></li>
  </ul>
</nav>`),
            H("API"),
            API([
              ["<code>.ox-pagination</code>", "On a <code>&lt;nav&gt;</code> with a list of links."],
              ["<code>aria-current=\"page\"</code>", "The current page, filled solid."],
              ["<code>aria-disabled=\"true\"</code>", "Dims a link, for Previous on page 1."],
              ["<code>.ox-gap</code>", "An ellipsis between page ranges."]
            ])
          ]
        },
        {
          slug: "range",
          title: "Range slider",
          lead: "A styled native slider. The filled track follows the value.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-field" style="width:280px">
  <label class="ox-label" for="r-demo">Volume</label>
  <input class="ox-range" id="r-demo" type="range" min="0" max="100" value="64">
</div>`),
            H("API"),
            API([
              ["<code>.ox-range</code>", "On <code>&lt;input type=\"range\"&gt;</code>. Keyboard and screen reader support come from the browser."],
              ["<code>Onyx.init()</code>", "Call after adding sliders with JavaScript, to paint their fill."]
            ])
          ]
        },
        {
          slug: "table",
          title: "Table",
          lead: "A clean data table that scrolls sideways on small screens. For sorting and selection, see the Pro data table.",
          blocks: [
            H("Example"),
            EX(`<div class="ox-table-wrap" style="width:100%">
  <table class="ox-table">
    <thead><tr><th scope="col">Invoice</th><th scope="col">Customer</th><th scope="col" class="num">Amount</th></tr></thead>
    <tbody>
      <tr><td>INV-2041</td><td>Grace Hopper</td><td class="num">$1,250.00</td></tr>
      <tr><td>INV-2040</td><td>Alan Turing</td><td class="num">$480.00</td></tr>
      <tr><td>INV-2039</td><td>Katherine Johnson</td><td class="num">$2,100.00</td></tr>
    </tbody>
  </table>
</div>`, "wide"),
            H("API"),
            API([
              ["<code>.ox-table-wrap</code>", "Bordered container that scrolls on narrow screens."],
              ["<code>.ox-table</code>", "The table."],
              ["<code>.num</code>", "Right-aligns numbers."],
              ["<code>.ox-table-striped</code>", "Shades every other row."]
            ])
          ]
        },
        {
          slug: "timeline",
          title: "Timeline",
          lead: "A vertical list of events, with done and upcoming states.",
          blocks: [
            H("Example"),
            EX(`<ol class="ox-timeline">
  <li data-state="done"><time>Nov 1</time><b>Kickoff</b><p>Scope and goals agreed.</p></li>
  <li data-state="done"><time>Nov 3</time><b>Design review</b></li>
  <li data-state="upcoming"><time>Nov 12</time><b>Launch</b></li>
</ol>`, "left"),
            H("API"),
            API([
              ["<code>.ox-timeline</code>", "On an <code>&lt;ol&gt;</code>."],
              ["<code>data-state</code>", "<code>done</code> fills the dot, <code>upcoming</code> makes it dashed."]
            ])
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
              "<strong>Date picker</strong> — single dates and ranges, with full keyboard support.",
              "<strong>Combobox</strong> — searchable select, multi-select and tag input in one component.",
              "<strong>Code input</strong>, <strong>task board</strong> with drag and drop, and <strong>rich toasts</strong> with actions.",
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
              ["template-landing", "Landing page", "Marketing page with product preview, features and testimonials."],
              ["template-pricing", "Pricing", "Plans, a comparison table and a billing FAQ."],
              ["template-auth", "Sign in & sign up", "Sign in, create account and reset password, with validation."],
              ["template-dashboard", "Dashboard", "Analytics overview with charts, orders table and command menu."],
              ["template-settings", "Settings", "Profile, billing and team settings with an unsaved-changes bar."]
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
          slug: "date-picker",
          title: "Date picker",
          lead: "A calendar for picking a date or a range. Arrow keys move by day and week, Page Up and Page Down by month.",
          blocks: [
            H("Single date"),
            EX(`<div class="ox-field" style="width:260px">
  <label class="ox-label" for="dp-one">Due date</label>
  <input class="ox-input" id="dp-one">
</div>`, "", `OnyxPro.datepicker("#dp-one", {
  value: "2026-11-14",
  onChange: (v) => Onyx.toast("Picked " + v)
});`),
            H("Date range"),
            EX(`<div class="ox-field" style="width:300px">
  <label class="ox-label" for="dp-range">Trip dates</label>
  <input class="ox-input" id="dp-range">
</div>`, "", `OnyxPro.datepicker("#dp-range", {
  range: true,
  min: "2026-11-01",
  weekStart: 1 // Monday
});`),
            H("Inline calendar"),
            EX(`<div class="ox-card" id="dp-inline" style="padding:8px"></div>`, "", `OnyxPro.calendar("#dp-inline", {
  // Weekends are unavailable
  disabled: (d) => d.getDay() === 0 || d.getDay() === 6
});`),
            H("API"),
            API([
              ["<code>OnyxPro.datepicker(input, options)</code>", "Turns a text input into a date field with a calendar popover."],
              ["<code>OnyxPro.calendar(element, options)</code>", "An always-visible calendar."],
              ["<code>value</code>", "An ISO date like <code>2026-11-14</code>, or <code>[start, end]</code> with <code>range</code>."],
              ["<code>range</code>", "Pick a start and an end date."],
              ["<code>min</code>, <code>max</code>, <code>disabled(date)</code>", "Limit which days can be chosen."],
              ["<code>weekStart</code>", "0 for Sunday (default), 1 for Monday."],
              ["<code>locale</code>", "Any locale, for example <code>hi-IN</code>. Defaults to the browser's."],
              ["<code>onChange(value)</code>", "Called with ISO date strings. The input's <code>data-value</code> holds the same."],
              ["<code>.getValue()</code>, <code>.setValue(v)</code>, <code>.open()</code>, <code>.close()</code>", "Returned methods."]
            ], ["Option", "Description"])
          ]
        },
        {
          slug: "combobox",
          title: "Combobox",
          lead: "A select you can type into. The same component does searchable select, multi-select and free-form tags.",
          blocks: [
            H("Searchable select"),
            EX(`<div style="width:280px" id="cb-one"></div>`, "", `OnyxPro.combobox("#cb-one", {
  label: "Country",
  placeholder: "Choose a country…",
  options: [
    { value: "in", label: "India", hint: "+91" },
    { value: "us", label: "United States", hint: "+1" },
    { value: "gb", label: "United Kingdom", hint: "+44" },
    { value: "de", label: "Germany", hint: "+49" },
    { value: "jp", label: "Japan", hint: "+81" },
    { value: "br", label: "Brazil", hint: "+55" }
  ]
});`),
            H("Multi-select"),
            EX(`<div style="width:340px" id="cb-multi"></div>`, "", `OnyxPro.combobox("#cb-multi", {
  label: "Assignees",
  multiple: true,
  placeholder: "Add people…",
  value: ["ada"],
  options: [
    { value: "ada", label: "Ada Lovelace" },
    { value: "grace", label: "Grace Hopper" },
    { value: "alan", label: "Alan Turing" },
    { value: "katherine", label: "Katherine Johnson" }
  ]
});`),
            H("Tag input"),
            P("With <code>creatable</code>, people can add their own values. Press Enter or comma to add, Backspace to remove the last one."),
            EX(`<div style="width:340px" id="cb-tags"></div>`, "", `OnyxPro.combobox("#cb-tags", {
  label: "Tags",
  multiple: true,
  creatable: true,
  placeholder: "Add tags…",
  value: ["design", "launch"],
  options: ["design", "launch", "bug", "research", "marketing"]
});`),
            H("API"),
            API([
              ["<code>options</code>", "Strings, or <code>{ value, label, hint }</code> objects."],
              ["<code>multiple</code>", "Select several values, shown as removable tags."],
              ["<code>creatable</code>", "Allow values that aren't in the list."],
              ["<code>value</code>, <code>placeholder</code>, <code>label</code>, <code>max</code>", "Initial value, placeholder, accessible name and the most tags allowed."],
              ["<code>onChange(value)</code> / <code>oxp:change</code>", "Called (and fired) when the value changes."],
              ["<code>.getValue()</code>, <code>.setValue(v)</code>, <code>.setOptions(list)</code>", "Returned methods."]
            ], ["Option", "Description"])
          ]
        },
        {
          slug: "code-input",
          title: "Code input",
          lead: "Boxes for one-time passcodes. Typing moves forward, Backspace moves back, and pasting or SMS autofill fills every box.",
          blocks: [
            H("Example"),
            P("The demo accepts <code>123456</code>. Anything else shakes."),
            EX(`<div id="otp-demo"></div>`, "", `const code = OnyxPro.otp("#otp-demo", {
  length: 6,
  onComplete: (value) => {
    if (value === "123456") {
      code.setState("success");
      Onyx.toast("Verified");
    } else {
      code.setState("error");
      setTimeout(code.clear, 700);
    }
  }
});`),
            H("API"),
            API([
              ["<code>length</code>", "Number of boxes. Default 6."],
              ["<code>separator</code>", "Show a dash before this box (default 3). Use 0 for none."],
              ["<code>numeric</code>", "Digits only (default). Set it to false to allow letters."],
              ["<code>onComplete(code)</code> / <code>oxp:complete</code>", "Called when every box is filled."],
              ["<code>.setState(state)</code>", "<code>error</code> shakes, <code>success</code> fills solid, an empty string resets."],
              ["<code>.getValue()</code>, <code>.clear()</code>, <code>.focus()</code>", "Returned methods."]
            ], ["Option", "Description"])
          ]
        },
        {
          slug: "task-board",
          title: "Task board",
          lead: "A kanban board with drag and drop that works with a mouse, touch, and the keyboard.",
          blocks: [
            H("Example"),
            P("Drag cards between columns. With the keyboard: focus a card, press Space to pick it up, arrow keys to move, Space to drop."),
            EX(`<div id="kb-demo" style="width:100%"></div>`, "wide", `OnyxPro.kanban("#kb-demo", {
  columns: [
    { id: "todo", title: "To do", cards: [
      { id: "1", title: "Write launch post", tag: "Marketing", assignee: "AL" },
      { id: "2", title: "Fix date picker focus", tag: "Bug", assignee: "GH" }
    ]},
    { id: "doing", title: "In progress", cards: [
      { id: "3", title: "Pricing page copy", tag: "Design", assignee: "KJ" }
    ]},
    { id: "done", title: "Done", cards: [
      { id: "4", title: "Set up analytics", tag: "Ops", assignee: "AT" }
    ]}
  ],
  onMove: ({ card, to }) => Onyx.toast(card.title + " → " + to)
});`),
            H("API"),
            API([
              ["<code>columns</code>", "<code>[{ id, title, cards: [{ id, title, tag, assignee }] }]</code>."],
              ["<code>renderCard(card)</code>", "Return your own HTML for a card."],
              ["<code>onMove({ card, from, to, index })</code> / <code>oxp:move</code>", "Called after a card is dropped somewhere new. Save the change here."],
              ["<code>.getColumns()</code>", "Current order of every column."]
            ], ["Option", "Description"])
          ]
        },
        {
          slug: "rich-toast",
          title: "Rich toast",
          lead: "Toasts with a title, a description, actions, and a loading state that turns into success or failure.",
          blocks: [
            H("With an action"),
            EX(`<button class="ox-btn ox-btn-outline" id="rt-undo">Archive project</button>`, "", `document.getElementById("rt-undo").addEventListener("click", () => {
  OnyxPro.toast({
    title: "Project archived",
    description: "Landing v2 moved to the archive.",
    action: { label: "Undo", onClick: () => Onyx.toast("Restored") }
  });
});`),
            H("Loading to done"),
            EX(`<button class="ox-btn ox-btn-outline" id="rt-ok">Upload (succeeds)</button>
<button class="ox-btn ox-btn-outline" id="rt-fail">Upload (fails)</button>`, "", `const upload = (ok) => new Promise((resolve, reject) =>
  setTimeout(() => (ok ? resolve(3) : reject(new Error("Network"))), 1500));

document.getElementById("rt-ok").addEventListener("click", () =>
  OnyxPro.toast.promise(upload(true), {
    loading: "Uploading 3 files…",
    success: (n) => ({ title: n + " files uploaded", description: "They're ready to share." }),
    error: "Upload failed"
  }));

document.getElementById("rt-fail").addEventListener("click", () =>
  OnyxPro.toast.promise(upload(false), {
    loading: "Uploading 3 files…",
    success: "Uploaded",
    error: (e) => ({ title: "Upload failed", description: e.message + " error. Try again." })
  }).catch(() => {}));`),
            H("API"),
            API([
              ["<code>OnyxPro.toast(options)</code>", "Shows a toast and returns <code>{ update, dismiss }</code>."],
              ["<code>title</code>, <code>description</code>", "The text."],
              ["<code>variant</code>", "<code>success</code> (default), <code>error</code>, <code>info</code>, <code>loading</code>, or <code>plain</code> for no icon."],
              ["<code>action</code>, <code>cancel</code>", "<code>{ label, onClick }</code> buttons."],
              ["<code>duration</code>", "Milliseconds before it closes. Hovering pauses it. Loading toasts stay until updated."],
              ["<code>OnyxPro.toast.promise(promise, messages)</code>", "Loading toast that turns into success or error. <code>loading</code>, <code>success</code> and <code>error</code> can be strings or functions."]
            ], ["Option", "Description"])
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
        },
        {
          slug: "building-blocks",
          title: "Page building blocks",
          lead: "Smaller pieces the templates are made of, available to use on their own.",
          blocks: [
            H("Password strength"),
            P("Set <code>data-score</code> from 0 to 4 as the user types."),
            EX(`<div class="ox-field" style="width:280px">
  <label class="ox-label" for="bb-pw">Password</label>
  <input class="ox-input" id="bb-pw" type="password" value="Onyx2026">
  <div class="oxp-strength" data-score="3"><i></i><i></i><i></i><i></i></div>
</div>`),
            H("Save bar"),
            P("A floating bar for unsaved changes. Add <code>data-show</code> to slide it up."),
            EX(`<button class="ox-btn ox-btn-outline" id="bb-toggle">Toggle save bar</button>
<div class="oxp-savebar" id="bb-savebar">
  <span>You have unsaved changes</span>
  <button class="ox-btn ox-btn-ghost ox-btn-sm ox-btn-pill">Discard</button>
  <button class="ox-btn ox-btn-sm ox-btn-pill">Save</button>
</div>`, "", `document.getElementById("bb-toggle").addEventListener("click", () => {
  document.getElementById("bb-savebar").toggleAttribute("data-show");
});`),
            H("Comparison table"),
            EX(`<table class="oxp-compare">
  <thead><tr><th>Feature</th><th>Free</th><th class="hl">Pro</th></tr></thead>
  <tbody>
    <tr><td>Projects</td><td>3</td><td class="hl">Unlimited</td></tr>
    <tr><td>Version history</td><td class="no"></td><td class="yes hl"></td></tr>
  </tbody>
</table>`, "wide"),
            H("API"),
            API([
              ["<code>.oxp-mark</code>", "Neutral placeholder logo used in the templates."],
              ["<code>.oxp-auth</code>, <code>-form</code>, <code>-body</code>, <code>-side</code>", "Split sign-in layout. The side panel hides on small screens."],
              ["<code>.oxp-strength[data-score]</code>", "Four-segment strength meter."],
              ["<code>.oxp-savebar[data-show]</code>", "Floating unsaved-changes bar."],
              ["<code>.oxp-compare</code>, <code>.yes</code>, <code>.no</code>, <code>.hl</code>", "Comparison table with check marks and a highlighted column."],
              ["<code>.oxp-subnav</code>, <code>.oxp-setting</code>", "Sticky section navigation and two-column setting rows."]
            ])
          ]
        },
        {
          slug: "template-landing",
          title: "Landing page template",
          lead: "A complete marketing page for a software product.",
          blocks: [
            NOTE('<b>Included with Pro and Team.</b> Customers get the full template source along with the Pro components.'),
            H("What's inside"),
            LIST([
              "Hero with an animated product window (a kanban board built from Onyx components).",
              "Logo strip, a features grid, three-step how-it-works and numbers that count up on scroll.",
              "Testimonial wall in a masonry layout and an email capture call to action."
            ]),
            H("Using it"),
            P("Copy <code>pro/templates/landing.html</code> into your project, fix the paths to the CSS and JS files, and replace the sample content with your own.")
          ]
        },
        {
          slug: "template-pricing",
          title: "Pricing template",
          lead: "Plans, a full comparison table and a billing FAQ.",
          blocks: [
            NOTE('<b>Included with Pro and Team.</b> Customers get the full template source along with the Pro components.'),
            H("What's inside"),
            LIST([
              "Four plans with a monthly / yearly switch that recalculates prices.",
              "Plans and features live in one data object, so you edit them in one place.",
              "Sticky-header comparison table with check marks and a highlighted plan."
            ]),
            H("Using it"),
            P("Copy <code>pro/templates/pricing.html</code> into your project, fix the paths to the CSS and JS files, and replace the sample content with your own.")
          ]
        },
        {
          slug: "template-auth",
          title: "Sign in & sign up template",
          lead: "Sign in, create account and reset password in one file.",
          blocks: [
            NOTE('<b>Included with Pro and Team.</b> Customers get the full template source along with the Pro components.'),
            H("What's inside"),
            LIST([
              "Three views switched by URL: <code>#signin</code>, <code>#signup</code> and <code>#forgot</code>.",
              "Field validation with clear error messages, show / hide password and a strength meter.",
              "Loading states, social sign-in buttons and a “check your inbox” confirmation."
            ]),
            H("Using it"),
            P("Copy <code>pro/templates/auth.html</code> into your project, fix the paths to the CSS and JS files, and replace the sample content with your own.")
          ]
        },
        {
          slug: "template-settings",
          title: "Settings template",
          lead: "Profile, account, notifications, billing and team settings.",
          blocks: [
            NOTE('<b>Included with Pro and Team.</b> Customers get the full template source along with the Pro components.'),
            H("What's inside"),
            LIST([
              "A save bar slides up when anything changes, with Discard and Save.",
              "Avatar upload with preview, username with prefix and a bio character counter.",
              "Invoices table, team table with role changes and an invite dialog that adds people live.",
              "Danger zone with a type-the-name-to-confirm delete."
            ]),
            H("Using it"),
            P("Copy <code>pro/templates/settings.html</code> into your project, fix the paths to the CSS and JS files, and replace the sample content with your own.")
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

// Keep the component list alphabetical, wherever new pages were added above
window.ONYX_DOCS.forEach(function (g) {
  if (g.group === "Components") g.pages.sort(function (a, b) { return a.title.localeCompare(b.title); });
});
