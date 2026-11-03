# Getting started with Nuvra UI

## 1. Install

Copy `src/nuvra.css` and `src/nuvra.js` into your project, or `npm install nuvra-ui`.

Add the `nv` class to `<body>` (or any wrapper) to apply base typography and colors.

## 2. Components

### Buttons
```html
<button class="nv-btn">Primary</button>
<button class="nv-btn nv-btn-secondary">Secondary</button>
<button class="nv-btn nv-btn-gradient nv-btn-lg">Large gradient</button>
<button class="nv-btn" data-loading="true">Saving</button>
```
Modifiers: `nv-btn-secondary`, `-ghost`, `-soft`, `-danger`, `-gradient`, `-sm`, `-lg`, `-block`, `-icon`.

### Form field
```html
<div class="nv-field">
  <label class="nv-label" for="email">Email</label>
  <input class="nv-input" id="email" type="email">
  <span class="nv-hint">We'll never share it.</span>
</div>
```
Add `data-invalid` to `.nv-field` to show the error state.

### Switch
```html
<label class="nv-switch">
  <input type="checkbox"><span class="nv-switch-track"></span> Notifications
</label>
```

### Modal
```html
<button class="nv-btn" data-nv-modal-open="my-modal">Open</button>

<div class="nv-modal" id="my-modal" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="nv-modal-dialog">
    <div class="nv-modal-header"><h3 class="nv-modal-title">Title</h3></div>
    <div class="nv-modal-body">Content</div>
    <div class="nv-modal-footer">
      <button class="nv-btn" data-nv-modal-close>Close</button>
    </div>
  </div>
</div>
```
Focus is trapped while open; `Esc` or clicking the backdrop closes it.

### Tabs
```html
<div class="nv-tabs-list" role="tablist">
  <button class="nv-tab" role="tab" aria-selected="true" aria-controls="p1">One</button>
  <button class="nv-tab" role="tab" aria-selected="false" aria-controls="p2" tabindex="-1">Two</button>
</div>
<div class="nv-tab-panel" role="tabpanel" id="p1">…</div>
<div class="nv-tab-panel" role="tabpanel" id="p2" hidden>…</div>
```

### Dropdown
```html
<div class="nv-dropdown">
  <button class="nv-btn" data-nv-dropdown-toggle aria-expanded="false">Menu</button>
  <div class="nv-dropdown-menu" role="menu">
    <button class="nv-dropdown-item" role="menuitem">Edit</button>
  </div>
</div>
```

### Tooltip & Toast
```html
<button class="nv-btn" data-nv-tooltip="Hello!">Hover</button>
<button class="nv-btn" data-nv-toast="Saved!" data-nv-toast-variant="success">Toast</button>
```

## 3. JavaScript API

```js
Nuvra.modal.open("my-modal");
Nuvra.modal.close("my-modal");
Nuvra.toast("Saved", { variant: "success", duration: 3000 });
Nuvra.theme.set("dark"); // "light" | "dark"
Nuvra.theme.get();
```

## 4. Theming

Override any `--nv-*` token in your own stylesheet. See the top of `nuvra.css` for the full list.
