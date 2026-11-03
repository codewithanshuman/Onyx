import { useEffect, useId, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { cx, useControllableState } from "./utils";

/* =========================================================
   Breadcrumb
   ========================================================= */

export interface BreadcrumbItem {
  label: ReactNode;
  /** Leave out for the current page. */
  href?: string;
}

export function Breadcrumb({ items, className, "aria-label": label = "Breadcrumb" }: { items: BreadcrumbItem[]; className?: string; "aria-label"?: string }) {
  return (
    <nav className={cx("ox-breadcrumb", className)} aria-label={label}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !item.href ? <span aria-current={last ? "page" : undefined}>{item.label}</span> : <a href={item.href}>{item.label}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* =========================================================
   Pagination
   ========================================================= */

/** Page numbers to show: always the first and last, plus `siblings` around the current one. */
export function pageRange(page: number, pages: number, siblings = 1): Array<number | "gap"> {
  const set = new Set<number>([1, pages]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= pages) set.add(p);
  const sorted = Array.from(set).sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export interface PaginationProps {
  /** Total number of pages. */
  pages: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Pages shown either side of the current one. Default 1. */
  siblings?: number;
  /** Make the items real links (for server-rendered lists). */
  getHref?: (page: number) => string;
  className?: string;
  "aria-label"?: string;
}

export function Pagination({ pages, page, defaultPage = 1, onPageChange, siblings = 1, getHref, className, "aria-label": label = "Pagination" }: PaginationProps) {
  const [current, setPage] = useControllableState(page, defaultPage, onPageChange);
  const go = (p: number) => (e: MouseEvent) => {
    if (!getHref) e.preventDefault();
    if (p >= 1 && p <= pages && p !== current) setPage(p);
  };
  const link = (p: number, content: ReactNode, extra: Record<string, unknown> = {}) => (
    <a href={getHref ? getHref(p) : "#"} onClick={go(p)} {...extra}>{content}</a>
  );
  if (pages < 1) return null;
  return (
    <nav className={cx("ox-pagination", className)} aria-label={label}>
      <ul>
        <li>{link(current - 1, "‹", { "aria-label": "Previous page", "aria-disabled": current === 1 ? "true" : undefined })}</li>
        {pageRange(current, pages, siblings).map((p, i) =>
          p === "gap" ? (
            <li key={"gap" + i}><span className="ox-gap" aria-hidden="true">…</span></li>
          ) : (
            <li key={p}>{p === current ? <span aria-current="page">{p}</span> : link(p, p, { "aria-label": "Page " + p })}</li>
          )
        )}
        <li>{link(current + 1, "›", { "aria-label": "Next page", "aria-disabled": current === pages ? "true" : undefined })}</li>
      </ul>
    </nav>
  );
}

/* =========================================================
   Navbar with built-in mobile menu
   ========================================================= */

export interface NavLink {
  label: ReactNode;
  href: string;
  current?: boolean;
}

export interface NavbarProps {
  brand: ReactNode;
  links: NavLink[];
  /** Buttons on the right (theme toggle, sign in…). Also shown at the bottom of the mobile menu. */
  actions?: ReactNode;
  /** Switch to the menu below 1024px instead of 760px. */
  collapse?: "md" | "lg";
  className?: string;
}

export function Navbar({ brand, links, actions, collapse = "md", className }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes; the page behind can't scroll while the menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("ox-nav-locked");
    return () => { document.removeEventListener("keydown", onKey); document.body.classList.remove("ox-nav-locked"); };
  }, [open]);

  const renderLinks = (onClick?: () => void) =>
    links.map((l, i) => (
      <a key={i} href={l.href} aria-current={l.current ? "page" : undefined} onClick={onClick}>{l.label}</a>
    ));

  return (
    <nav className={cx("ox-navbar", className)} data-collapse={collapse === "lg" ? "lg" : undefined} data-open={open ? "true" : "false"} data-scrolled={scrolled ? "true" : "false"} aria-label="Main">
      <div className="ox-container ox-navbar-inner">
        {brand}
        <div className="ox-navbar-links">{renderLinks()}</div>
        <div className="ox-row" style={{ gap: "var(--ox-space-1)", flexWrap: "nowrap" }}>
          {actions}
          <button
            type="button"
            className="ox-navbar-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>
      <div className="ox-navbar-menu" id={menuId}>{renderLinks(() => setOpen(false))}</div>
    </nav>
  );
}

/* =========================================================
   Skip link
   ========================================================= */

/** First focusable element on the page; lets keyboard users jump past the navigation. */
export function SkipLink({ href = "#main", children = "Skip to content" }: { href?: string; children?: ReactNode }) {
  return <a className="ox-skip" href={href}>{children}</a>;
}
