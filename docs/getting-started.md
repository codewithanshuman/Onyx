# Getting started with Onyx

## 1. Install

Copy `src/onyx.css` and `src/onyx.js` into your project, or `npm install onyx-ui`.

Add the `ox` class to `<body>` (or any wrapper) to apply base typography and colors. Onyx is designed for the [Geist](https://fonts.google.com/specimen/Geist) font, and falls back to your system font.

## 2. Components

### Buttons
```html
<button class="ox-btn">Primary</button>
<button class="ox-btn ox-btn-outline">Outline</button>
<button class="ox-btn ox-btn-ghost">Ghost</button>
<button class="ox-btn ox-btn-link">Link</button>
<button class="ox-btn ox-btn-lg ox-btn-pill">Large pill</button>
<button class="ox-btn" data-loading="true">Saving</button>
```
Modifiers: `ox-btn-outline`, `-ghost`, `-link`, `-pill`, `-sm`, `-lg`, `-block`, `-icon`.

### Segmented control
```html
<div class="ox-segmented" id="period">
  <button value="monthly" aria-pressed="true">Monthly</button>
  <button value="yearly" aria-pressed="false">Yearly</button>
</div>
<script>
  document.getElementById("period").addEventListener("ox:change", e => console.log(e.detail.value));
</script>
```

### Form field
```html
<div class="ox-field">
  <label class="ox-label" for="email">Email</label>
  <input class="ox-input" id="email" type="email">
  <span class="ox-hint">We'll never share it.</span>
</div>
```
Add `data-invalid` to `.ox-field` to show the error state.

### Checkbox, radio, switch
```html
<label class="ox-checkbox"><input type="checkbox"> Accept terms</label>
<label class="ox-radio"><input type="radio" name="plan"> Monthly</label>
<label class="ox-switch"><input type="checkbox"><span class="ox-switch-track"></span> Notifications</label>
```

### Modal
```html
<button class="ox-btn" data-ox-modal-open="my-modal">Open</button>

<div class="ox-modal" id="my-modal" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="ox-modal-dialog">
    <div class="ox-modal-header"><h3 class="ox-modal-title">Title</h3></div>
    <div class="ox-modal-body">Content</div>
    <div class="ox-modal-footer">
      <button class="ox-btn" data-ox-modal-close>Close</button>
    </div>
  </div>
</div>
```
Focus is trapped while open; `Esc` or clicking the backdrop closes it.

### Tabs
```html
<div class="ox-tabs-list" role="tablist">
  <button class="ox-tab" role="tab" aria-selected="true" aria-controls="p1">One</button>
  <button class="ox-tab" role="tab" aria-selected="false" aria-controls="p2" tabindex="-1">Two</button>
</div>
<div class="ox-tab-panel" role="tabpanel" id="p1">…</div>
<div class="ox-tab-panel" role="tabpanel" id="p2" hidden>…</div>
```

### Accordion
```html
<div class="ox-accordion">
  <details><summary>Question</summary><p>Answer</p></details>
</div>
```

### Dropdown
```html
<div class="ox-dropdown">
  <button class="ox-btn" data-ox-dropdown-toggle aria-expanded="false">Menu</button>
  <div class="ox-dropdown-menu" role="menu">
    <button class="ox-dropdown-item" role="menuitem">Edit <span class="ox-kbd">⌘E</span></button>
  </div>
</div>
```

### Tooltip, toast, copy
```html
<button class="ox-btn" data-ox-tooltip="Hello!">Hover</button>
<button class="ox-btn" data-ox-toast="Saved!">Toast</button>
<button class="ox-btn" data-ox-copy="npm i onyx-ui">Copy</button>
```

### Invert a region
```html
<div class="ox-card ox-invert">Black card on a white page (and white on black in dark mode).</div>
```

## 3. JavaScript API

```js
Onyx.modal.open("my-modal");
Onyx.modal.close("my-modal");
Onyx.toast("Saved", { duration: 3000 });
Onyx.copy("some text");
Onyx.theme.set("dark"); // "light" | "dark"
Onyx.theme.get();
```

## 4. Theming

Override any `--ox-*` token in your own stylesheet. See the top of `onyx.css` for the full list.
