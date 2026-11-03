# Onyx

**The interface, in black & white.**

Onyx is a zero-dependency UI component library for designers who believe restraint is a feature. Two colors, sharp typography, and every detail considered. One CSS file, one small script, light and dark themes built in.

## Quick start

```html
<link rel="stylesheet" href="onyx.css">
<body class="ox">
  <button class="ox-btn">Hello Onyx</button>
  <script src="onyx.js"></script>
</body>
```

Or via npm (once published):

```bash
npm install onyx-ui
```

## Run the showcase locally

```bash
npm run dev
```

Then open http://localhost:5173.

## What's inside

| Category   | Components |
|------------|------------|
| Actions    | Button (primary, outline, ghost, link, pill, sizes, icon, loading), Segmented control |
| Forms      | Input, Input group with icon, Select, Textarea, Checkbox, Radio, Switch, Field + hint + invalid state |
| Layout     | Container, Card, Navbar, Stack, Row, Grid, Divider, Separator |
| Display    | Badge, Avatar, Avatar stack, Alert, Kbd, Code block, Progress, Skeleton, Spinner |
| Overlays   | Modal (focus trap, Esc to close), Dropdown, Tooltip, Toast |
| Navigation | Tabs (arrow-key support), Accordion |

Full documentation with live examples lives in [docs/](docs/index.html) — run `npm run dev` and open http://localhost:5173/docs/.

## Theming

Everything is driven by CSS custom properties (`--ox-*`):

```css
:root {
  --ox-radius: 2px;
  --ox-radius-lg: 4px;
  --ox-font-sans: "Inter", sans-serif;
}
```

- Dark mode follows the OS. Force it with `<html data-theme="dark">` or `Onyx.theme.set("dark")`.
- Add `.ox-invert` to any element to flip it to the opposite theme (a black card on a white page, or the other way round).

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
