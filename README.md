# Nuvra UI

**Beautiful, accessible, zero-dependency UI components for web designers.**

Drop in one CSS file and one tiny JS file and you get buttons, forms, cards, modals, tabs, dropdowns, toasts and more — with light and dark themes built in.

## Quick start

```html
<link rel="stylesheet" href="nuvra.css">
<body class="nv">
  <button class="nv-btn">Hello Nuvra</button>
  <script src="nuvra.js"></script>
</body>
```

Or via npm (once published):

```bash
npm install nuvra-ui
```

## Run the showcase locally

```bash
npm run dev
```

Then open http://localhost:5173.

## What's inside

| Category  | Components |
|-----------|------------|
| Actions   | Button (primary, secondary, ghost, soft, danger, gradient, sizes, loading), Button group |
| Forms     | Input, Select, Textarea, Checkbox, Radio, Switch, Field + hint + validation state |
| Layout    | Container, Card, Navbar, Stack, Row, Grid |
| Display   | Badge, Avatar, Avatar stack, Alert, Progress, Skeleton, Spinner |
| Overlays  | Modal (focus trap, Esc to close), Dropdown, Tooltip, Toast |
| Navigation| Tabs (keyboard arrows) |

See [docs/getting-started.md](docs/getting-started.md) for usage.

## Theming

Everything is driven by CSS custom properties (`--nv-*`). Override them to brand the library:

```css
:root {
  --nv-primary-500: #10b981;
  --nv-primary-600: #059669;
  --nv-radius: 4px;
}
```

Dark mode follows the OS automatically. Force it with `<html data-theme="dark">` or call `Nuvra.theme.set("dark")`.

## Plans

| | Free | Pro | Team |
|---|---|---|---|
| Core components | ✓ | ✓ | ✓ |
| Pro components & templates | | ✓ | ✓ |
| Figma kit | | ✓ | ✓ |
| Seats | 1 | 1 | 10 |
| Price | $0 | $12/mo | $39/mo |

## License

Core library: MIT. Pro components: commercial license.
