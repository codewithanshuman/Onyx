import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactElement, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx, FOCUSABLE } from "./utils";

/* =========================================================
   Modal
   ========================================================= */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Buttons for the footer. */
  footer?: ReactNode;
  children?: ReactNode;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean;
  className?: string;
}

export function Modal({ open, onClose, title, description, footer, children, closeOnBackdrop = true, className }: ModalProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  // Stay mounted for the closing animation, then unmount
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      // Show on the next frame so the opening transition runs. The timeout covers
      // browsers that pause animation frames (background tabs).
      const raf = requestAnimationFrame(() => setVisible(true));
      const fallback = setTimeout(() => setVisible(true), 50);
      return () => { cancelAnimationFrame(raf); clearTimeout(fallback); };
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 220);
    returnTo.current?.focus?.();
    return () => clearTimeout(t);
  }, [open]);

  // Hidden elements can't take focus, so wait until the modal is visible
  useEffect(() => {
    if (!open || !visible) return;
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialogRef.current)?.focus();
  }, [open, visible]);

  if (!mounted || typeof document === "undefined") return null;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  return createPortal(
    <div
      className={cx("ox-modal", className)}
      data-open={visible ? "true" : "false"}
      onMouseDown={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose(); }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={dialogRef}
        className="ox-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-desc` : undefined}
        tabIndex={-1}
      >
        <div className="ox-modal-header">
          <h3 className="ox-modal-title" id={`${id}-title`}>{title}</h3>
          <button type="button" className="ox-btn ox-btn-ghost ox-btn-sm ox-btn-icon" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="ox-modal-body">
          {description && <p id={`${id}-desc`} style={{ margin: children ? "0 0 var(--ox-space-4)" : 0 }}>{description}</p>}
          {children}
        </div>
        {footer && <div className="ox-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

/* =========================================================
   Dropdown menu
   ========================================================= */

export interface MenuItem {
  label: ReactNode;
  onSelect?: () => void;
  shortcut?: string;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  /** A single button element; it gets the open/close behavior and aria attributes. */
  trigger: ReactElement;
  items: Array<MenuItem | "separator">;
  label?: string;
  className?: string;
}

export function DropdownMenu({ trigger, items, label, className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')?.focus();
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function focusItem(step: number) {
    const all = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []);
    const at = all.indexOf(document.activeElement as HTMLElement);
    all[(at + step + all.length) % all.length]?.focus();
  }

  function onMenuKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") { e.preventDefault(); focusItem(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); focusItem(-1); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
    else if (e.key === "Tab") setOpen(false);
  }

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        ref: (el: HTMLElement | null) => { triggerRef.current = el; },
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? id : undefined,
        onClick: () => setOpen((o) => !o),
        onKeyDown: (e: KeyboardEvent) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); } }
      })
    : trigger;

  return (
    <div ref={rootRef} className={cx("ox-dropdown", className)} data-open={open ? "true" : "false"}>
      {triggerEl}
      <div ref={menuRef} className="ox-dropdown-menu" role="menu" id={id} aria-label={label} onKeyDown={onMenuKey} style={{ visibility: open ? "visible" : "hidden" }}>
        {items.map((item, i) =>
          item === "separator" ? (
            <hr key={i} className="ox-separator" />
          ) : (
            <button
              key={i}
              type="button"
              role="menuitem"
              className="ox-dropdown-item"
              disabled={item.disabled}
              tabIndex={-1}
              onClick={() => { setOpen(false); triggerRef.current?.focus(); item.onSelect?.(); }}
            >
              {item.label}
              {item.shortcut && <kbd className="ox-kbd">{item.shortcut}</kbd>}
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   Tooltip
   ========================================================= */

/** Adds a CSS tooltip to its single child. For icon buttons, also give the child an aria-label. */
export function Tooltip({ content, children }: { content: string; children: ReactElement }) {
  return isValidElement(children) ? cloneElement(children as ReactElement<Record<string, unknown>>, { "data-ox-tooltip": content }) : children;
}
