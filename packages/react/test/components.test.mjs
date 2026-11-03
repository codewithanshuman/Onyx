import "./setup.mjs";
import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createElement as h, useState } from "react";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import {
  Button, Field, Input, Switch, Tabs, TabList, Tab, TabPanel, Modal, DropdownMenu,
  ToastProvider, useToast, ThemeProvider, useTheme, Progress, Avatar, Badge, Alert
} from "../dist/index.js";

afterEach(cleanup);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

test("Button maps props to Onyx classes and loading state", () => {
  render(h(Button, { variant: "outline", size: "sm", pill: true, loading: true }, "Save"));
  const b = screen.getByRole("button", { name: "Save" });
  assert.equal(b.className, "ox-btn ox-btn-outline ox-btn-sm ox-btn-pill");
  assert.equal(b.dataset.loading, "true");
  assert.equal(b.getAttribute("aria-busy"), "true");
  assert.equal(b.type, "button");
});

test("Field links the label and hint, and marks errors", () => {
  const { rerender } = render(h(Field, { label: "Email", hint: "We never share it." }, h(Input, { type: "email" })));
  const input = screen.getByLabelText("Email");
  const hint = document.getElementById(input.getAttribute("aria-describedby"));
  assert.equal(hint.textContent, "We never share it.");
  assert.equal(input.getAttribute("aria-invalid"), null);

  rerender(h(Field, { label: "Email", error: "Enter a valid email." }, h(Input, { type: "email" })));
  const again = screen.getByLabelText("Email");
  assert.equal(again.getAttribute("aria-invalid"), "true");
  assert.equal(screen.getByRole("alert").textContent, "Enter a valid email.");
  assert.ok(again.closest(".ox-field").hasAttribute("data-invalid"));
});

test("Switch exposes the switch role", () => {
  render(h(Switch, { label: "Notifications", defaultChecked: true }));
  assert.equal(screen.getByRole("switch", { name: "Notifications" }).checked, true);
});

test("Tabs switch on click and with arrow keys", () => {
  render(
    h(Tabs, { defaultValue: "a" },
      h(TabList, { "aria-label": "Sections" }, h(Tab, { value: "a" }, "One"), h(Tab, { value: "b" }, "Two"), h(Tab, { value: "c" }, "Three")),
      h(TabPanel, { value: "a" }, "Panel one"), h(TabPanel, { value: "b" }, "Panel two"), h(TabPanel, { value: "c" }, "Panel three"))
  );
  assert.equal(screen.getByRole("tabpanel").textContent, "Panel one");
  fireEvent.click(screen.getByRole("tab", { name: "Two" }));
  assert.equal(screen.getByRole("tab", { name: "Two" }).getAttribute("aria-selected"), "true");
  assert.equal(screen.getByRole("tabpanel").textContent, "Panel two");

  const two = screen.getByRole("tab", { name: "Two" });
  two.focus();
  fireEvent.keyDown(two, { key: "ArrowRight" });
  assert.equal(document.activeElement.textContent, "Three");
  assert.equal(screen.getByRole("tabpanel").textContent, "Panel three");
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
  assert.equal(document.activeElement.textContent, "One", "wraps around");
});

test("Tabs can be controlled", () => {
  const seen = [];
  render(h(Tabs, { value: "a", defaultValue: "a", onValueChange: (v) => seen.push(v) },
    h(TabList, { "aria-label": "x" }, h(Tab, { value: "a" }, "A"), h(Tab, { value: "b" }, "B")),
    h(TabPanel, { value: "a" }, "A panel"), h(TabPanel, { value: "b" }, "B panel")));
  fireEvent.click(screen.getByRole("tab", { name: "B" }));
  assert.deepEqual(seen, ["b"]);
  assert.equal(screen.getByRole("tabpanel").textContent, "A panel", "parent decides");
});

test("Modal is labelled, focuses inside, and closes on Escape and backdrop", async () => {
  let closes = 0;
  function Demo() {
    const [open, setOpen] = useState(false);
    return h("div", null,
      h("button", { onClick: () => setOpen(true) }, "Open"),
      h(Modal, { open, onClose: () => { closes++; setOpen(false); }, title: "Delete project?", description: "This can't be undone.", footer: h(Button, null, "Delete") }));
  }
  render(h(Demo));
  const opener = screen.getByRole("button", { name: "Open" });
  opener.focus();
  fireEvent.click(opener);
  await act(() => wait(80));
  assert.equal(document.querySelector(".ox-modal").dataset.open, "true", "becomes visible");
  const dialog = screen.getByRole("dialog", { name: "Delete project?" });
  assert.equal(dialog.getAttribute("aria-modal"), "true");
  assert.equal(document.getElementById(dialog.getAttribute("aria-describedby")).textContent, "This can't be undone.");
  assert.ok(dialog.contains(document.activeElement), "focus moved into the dialog");

  fireEvent.keyDown(dialog, { key: "Escape" });
  assert.equal(closes, 1);
  await act(() => wait(260));
  assert.equal(screen.queryByRole("dialog"), null, "unmounted after the close animation");
  assert.equal(document.activeElement, opener, "focus returned to the opener");

  fireEvent.click(opener);
  await act(() => wait(30));
  fireEvent.mouseDown(document.querySelector(".ox-modal"));
  assert.equal(closes, 2, "backdrop click closes");
});

test("DropdownMenu opens, moves with arrows, and runs the chosen item", async () => {
  const picked = [];
  render(h(DropdownMenu, {
    label: "Account",
    trigger: h(Button, { variant: "outline" }, "Menu"),
    items: [{ label: "Profile", onSelect: () => picked.push("profile") }, "separator", { label: "Log out", onSelect: () => picked.push("logout") }]
  }));
  const trigger = screen.getByRole("button", { name: "Menu" });
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(trigger);
  await act(() => wait(10));
  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.equal(document.activeElement.textContent, "Profile");
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
  assert.equal(document.activeElement.textContent, "Log out");
  fireEvent.click(document.activeElement);
  assert.deepEqual(picked, ["logout"]);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);
});

test("useToast shows a message and removes it after the duration", async () => {
  function Demo() {
    const toast = useToast();
    return h(Button, { onClick: () => toast("Saved", { duration: 50 }) }, "Go");
  }
  render(h(ToastProvider, null, h(Demo)));
  fireEvent.click(screen.getByRole("button", { name: "Go" }));
  assert.equal(screen.getByRole("status").textContent, "Saved");
  await act(() => wait(320));
  assert.equal(screen.queryByRole("status"), null);
});

test("ThemeProvider sets data-theme and remembers it", () => {
  function Demo() {
    const { resolved, toggle } = useTheme();
    return h(Button, { onClick: toggle }, resolved);
  }
  localStorage.clear();
  render(h(ThemeProvider, { defaultTheme: "light" }, h(Demo)));
  assert.equal(document.documentElement.dataset.theme, "light");
  fireEvent.click(screen.getByRole("button"));
  assert.equal(document.documentElement.dataset.theme, "dark");
  assert.equal(localStorage.getItem("onyx-theme"), "dark");
  assert.equal(screen.getByRole("button").textContent, "dark");
});

test("Display components render the right markup", () => {
  render(h("div", null,
    h(Progress, { value: 30, max: 60, label: "Upload" }),
    h(Avatar, { initials: "AL", solid: true, size: "lg" }),
    h(Badge, { variant: "solid", live: true }, "Live"),
    h(Alert, { title: "Heads up", solid: true }, "Payment failed")));
  const bar = screen.getByRole("progressbar", { name: "Upload" });
  assert.equal(bar.getAttribute("aria-valuenow"), "30");
  assert.equal(bar.firstChild.style.getPropertyValue("--value"), "50%");
  assert.equal(screen.getByText("AL").className, "ox-avatar ox-avatar-lg ox-avatar-solid");
  assert.equal(screen.getByText("Live").className, "ox-badge ox-badge-solid ox-badge-dot ox-badge-live");
  assert.match(screen.getByRole("alert").textContent, /Heads upPayment failed/);
});
