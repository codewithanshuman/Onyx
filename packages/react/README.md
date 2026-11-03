# @onyx-ui/react

Onyx's black & white components for React 18 and 19. Typed, accessible, and only ~22 KB.

## Install

```bash
npm install @onyx-ui/react
```

Import the styles once, at the root of your app:

```tsx
import "@onyx-ui/react/styles.css";
```

## Use

```tsx
import { Button, Field, Input, Modal, ToastProvider, useToast } from "@onyx-ui/react";

function Invite() {
  const toast = useToast();
  return (
    <form onSubmit={(e) => { e.preventDefault(); toast("Invite sent"); }}>
      <Field label="Email" hint="They'll get a link to join.">
        <Input type="email" required />
      </Field>
      <Button type="submit">Send invite</Button>
    </form>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Invite />
    </ToastProvider>
  );
}
```

Add `className="ox"` to `<body>` (or a wrapper) for Onyx's base typography and colors.

## Components

| Group | Components |
|---|---|
| Actions | `Button`, `SegmentedControl` |
| Forms | `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch` |
| Layout | `Container`, `Stack`, `Row`, `Divider`, `Card`, `CardHeader`, `CardBody`, `CardFooter`, `CardTitle`, `CardText` |
| Display | `Badge`, `Avatar`, `AvatarStack`, `Kbd`, `Alert`, `Progress`, `Spinner`, `Skeleton` |
| Overlays | `Modal`, `DropdownMenu`, `Tooltip` |
| Navigation | `Tabs`, `TabList`, `Tab`, `TabPanel`, `Accordion`, `AccordionItem` |
| Providers | `ToastProvider` + `useToast`, `ThemeProvider` + `useTheme` |

Behavior lives in the components, so you don't need `onyx.js`. Modals trap focus and return it, menus and tabs work with the keyboard, and `Field` connects labels, hints and errors for screen readers.

## Theme

```tsx
import { ThemeProvider, useTheme } from "@onyx-ui/react";

function ThemeButton() {
  const { resolved, toggle } = useTheme();
  return <Button variant="ghost" onClick={toggle}>{resolved === "dark" ? "Light" : "Dark"}</Button>;
}

<ThemeProvider defaultTheme="system">…</ThemeProvider>
```

## Development

```bash
npm install
npm test        # builds, then runs the component tests
npm run demo    # bundles demo/ — open demo/index.html through a local server
```

## License

MIT
