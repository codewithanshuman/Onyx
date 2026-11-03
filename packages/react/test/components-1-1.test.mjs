import "./setup.mjs";
import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createElement as h, useState } from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import {
  Breadcrumb, Pagination, pageRange, Navbar, SkipLink, RangeSlider, NumberStepper, ChipGroup,
  Table, EmptyState, Timeline, Banner, Avatar, Button
} from "../dist/index.js";

afterEach(() => { cleanup(); localStorage.clear(); document.body.className = ""; });

test("Breadcrumb links ancestors and marks the current page", () => {
  render(h(Breadcrumb, { items: [{ label: "Home", href: "/" }, { label: "Projects", href: "/p" }, { label: "Landing v2" }] }));
  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  assert.equal(nav.querySelectorAll("a").length, 2);
  assert.equal(screen.getByText("Landing v2").getAttribute("aria-current"), "page");
});

test("pageRange keeps first, last and neighbours, with gaps", () => {
  assert.deepEqual(pageRange(1, 3), [1, 2, 3]);
  assert.deepEqual(pageRange(5, 12), [1, "gap", 4, 5, 6, "gap", 12]);
  assert.deepEqual(pageRange(12, 12), [1, "gap", 11, 12]);
  assert.deepEqual(pageRange(2, 12), [1, 2, 3, "gap", 12]);
});

test("Pagination moves pages and disables the ends", () => {
  const seen = [];
  render(h(Pagination, { pages: 12, defaultPage: 1, onPageChange: (p) => seen.push(p) }));
  assert.equal(screen.getByLabelText("Previous page").getAttribute("aria-disabled"), "true");
  assert.equal(screen.getByText("1").getAttribute("aria-current"), "page");
  fireEvent.click(screen.getByLabelText("Next page"));
  fireEvent.click(screen.getByLabelText("Page 12"));
  assert.deepEqual(seen, [2, 12]);
  assert.equal(screen.getByLabelText("Next page").getAttribute("aria-disabled"), "true");
  fireEvent.click(screen.getByLabelText("Next page"));
  assert.deepEqual(seen, [2, 12], "no change past the last page");
});

test("Pagination can render real links", () => {
  render(h(Pagination, { pages: 3, page: 2, getHref: (p) => "/blog?page=" + p }));
  assert.equal(screen.getByLabelText("Page 3").getAttribute("href"), "/blog?page=3");
});

test("Navbar opens and closes its mobile menu", () => {
  render(h(Navbar, { brand: h("a", { href: "/" }, "Acme"), links: [{ label: "Work", href: "#work", current: true }, { label: "About", href: "#about" }], actions: h(Button, { size: "sm" }, "Contact") }));
  const toggle = screen.getByRole("button", { name: "Open menu" });
  const nav = toggle.closest(".ox-navbar");
  assert.equal(nav.dataset.open, "false");
  fireEvent.click(toggle);
  assert.equal(nav.dataset.open, "true");
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  assert.equal(toggle.getAttribute("aria-label"), "Close menu");
  assert.ok(document.body.classList.contains("ox-nav-locked"), "page scroll locked");
  fireEvent.keyDown(document, { key: "Escape" });
  assert.equal(nav.dataset.open, "false");
  assert.ok(!document.body.classList.contains("ox-nav-locked"));
  fireEvent.click(toggle);
  fireEvent.click(document.getElementById(toggle.getAttribute("aria-controls")).querySelector('a[href="#about"]'));
  assert.equal(nav.dataset.open, "false", "tapping a menu link closes the menu");
  assert.equal(screen.getAllByText("Work")[0].getAttribute("aria-current"), "page");
});

test("SkipLink points at the main content", () => {
  render(h(SkipLink));
  assert.equal(screen.getByText("Skip to content").getAttribute("href"), "#main");
});

test("RangeSlider paints its fill and reports numbers", () => {
  const seen = [];
  render(h(RangeSlider, { defaultValue: 25, min: 0, max: 200, onValueChange: (v) => seen.push(v), "aria-label": "Volume" }));
  const r = screen.getByRole("slider", { name: "Volume" });
  assert.equal(r.style.getPropertyValue("--_pct"), "12.5%");
  fireEvent.change(r, { target: { value: "100" } });
  assert.deepEqual(seen, [100]);
  assert.equal(r.style.getPropertyValue("--_pct"), "50%");
});

test("NumberStepper clamps to its limits and disables the ends", () => {
  function Demo() {
    const [n, setN] = useState(7);
    return h(NumberStepper, { label: "Guests", value: n, onValueChange: setN, min: 1, max: 8 });
  }
  render(h(Demo));
  const input = screen.getByRole("spinbutton", { name: "Guests" });
  const plus = screen.getByRole("button", { name: "Increase guests" });
  const minus = screen.getByRole("button", { name: "Decrease guests" });
  fireEvent.click(plus);
  assert.equal(input.value, "8");
  assert.equal(plus.disabled, true);
  fireEvent.change(input, { target: { value: "50" } });
  assert.equal(input.value, "8", "typed values are clamped");
  fireEvent.change(input, { target: { value: "1" } });
  assert.equal(minus.disabled, true);
});

test("ChipGroup toggles several, or exactly one with multiple={false}", () => {
  const many = [], one = [];
  const options = [{ value: "a", label: "Design" }, { value: "b", label: "Code" }, { value: "c", label: "Ops" }];
  render(h("div", null,
    h(ChipGroup, { "aria-label": "Teams", options, defaultValue: ["a"], onValueChange: (v) => many.push(v) }),
    h(ChipGroup, { "aria-label": "Sort", multiple: false, options, defaultValue: "a", onValueChange: (v) => one.push(v) })));
  const teams = screen.getByRole("group", { name: "Teams" });
  fireEvent.click(teams.querySelectorAll(".ox-chip")[1]);
  fireEvent.click(teams.querySelectorAll(".ox-chip")[0]);
  assert.deepEqual(many, [["a", "b"], ["b"]]);
  const sort = screen.getByRole("group", { name: "Sort" });
  fireEvent.click(sort.querySelectorAll(".ox-chip")[2]);
  assert.deepEqual(one, ["c"]);
  assert.deepEqual([...sort.querySelectorAll(".ox-chip")].map((c) => c.getAttribute("aria-pressed")), ["false", "false", "true"]);
});

test("Table, EmptyState and Timeline render accessible markup", () => {
  render(h("div", null,
    h(Table, { striped: true, caption: "Invoices" }, h("tbody", null, h("tr", null, h("td", null, "INV-1")))),
    h(EmptyState, { title: "No projects yet", description: "Create one to get started.", action: h(Button, null, "Create") }),
    h(Timeline, { events: [{ title: "Kickoff", time: "Nov 1", dateTime: "2026-11-01", state: "done" }, { title: "Launch", state: "upcoming" }] }),
    h(Avatar, { initials: "AL", status: "online" })));
  assert.equal(screen.getByRole("table", { name: "Invoices" }).className, "ox-table ox-table-striped");
  assert.equal(screen.getByRole("heading", { name: "No projects yet" }).className, "ox-empty-title");
  const time = screen.getByText("Nov 1");
  assert.equal(time.tagName, "TIME");
  assert.equal(time.getAttribute("datetime"), "2026-11-01");
  assert.equal(time.closest("li").dataset.state, "done");
  assert.equal(screen.getByText("AL").dataset.status, "online");
});

test("Banner dismisses and remembers it", () => {
  const { unmount } = render(h(Banner, { storageKey: "launch" }, "Onyx 1.1 is here"));
  fireEvent.click(screen.getByRole("button", { name: "Dismiss announcement" }));
  assert.equal(screen.queryByText("Onyx 1.1 is here"), null);
  assert.equal(localStorage.getItem("ox-banner-launch"), "1");
  unmount();
  render(h(Banner, { storageKey: "launch" }, "Onyx 1.1 is here"));
  assert.equal(screen.queryByText("Onyx 1.1 is here"), null, "stays hidden on the next visit");
});
