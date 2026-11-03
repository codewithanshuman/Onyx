import { useEffect, useState } from "react";
import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from "react";
import { cx } from "./utils";

/* =========================================================
   Table
   ========================================================= */

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  /** Visible caption under the table; also names it for screen readers. */
  caption?: ReactNode;
}

/** A styled <table> inside a bordered wrapper that scrolls sideways on small screens. Use normal thead/tbody/tr/th/td inside. */
export function Table({ striped, caption, className, children, ...rest }: TableProps) {
  return (
    <div className="ox-table-wrap">
      <table className={cx("ox-table", striped && "ox-table-striped", className)} {...rest}>
        {caption && <caption>{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

/* =========================================================
   Empty state
   ========================================================= */

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** A button or link for the next step. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon = "◌", action, className }: EmptyStateProps) {
  return (
    <div className={cx("ox-empty", className)}>
      {icon !== null && <span className="ox-empty-icon" aria-hidden="true">{icon}</span>}
      <h3 className="ox-empty-title">{title}</h3>
      {description && <p className="ox-empty-text">{description}</p>}
      {action}
    </div>
  );
}

/* =========================================================
   Timeline
   ========================================================= */

export interface TimelineEvent {
  title: ReactNode;
  /** Shown above the title; pass a machine-readable `dateTime` for screen readers and search. */
  time?: ReactNode;
  dateTime?: string;
  description?: ReactNode;
  state?: "done" | "upcoming";
}

export function Timeline({ events, className }: { events: TimelineEvent[]; className?: string }) {
  return (
    <ol className={cx("ox-timeline", className)}>
      {events.map((e, i) => (
        <li key={i} data-state={e.state}>
          {e.time && <time dateTime={e.dateTime}>{e.time}</time>}
          <b>{e.title}</b>
          {e.description && <p>{e.description}</p>}
        </li>
      ))}
    </ol>
  );
}

/* =========================================================
   Banner
   ========================================================= */

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Remember dismissal in this browser under this key. */
  storageKey?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Banner({ storageKey, dismissible = true, onDismiss, className, children, ...rest }: BannerProps) {
  const [hidden, setHidden] = useState(false);
  // Read storage after mount so server and client render the same markup
  useEffect(() => {
    if (!storageKey) return;
    try { if (localStorage.getItem("ox-banner-" + storageKey)) setHidden(true); } catch { /* storage unavailable */ }
  }, [storageKey]);

  if (hidden) return null;
  return (
    <div className={cx("ox-banner", className)} role="region" aria-label="Announcement" {...rest}>
      {/* One wrapper, so text, bold words and links flow as a single line instead of separate flex items */}
      <span>{children}</span>
      {dismissible && (
        <button
          type="button"
          className="ox-banner-close"
          aria-label="Dismiss announcement"
          onClick={() => {
            setHidden(true);
            if (storageKey) { try { localStorage.setItem("ox-banner-" + storageKey, "1"); } catch { /* storage unavailable */ } }
            onDismiss?.();
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
