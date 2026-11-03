import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

type DivProps = HTMLAttributes<HTMLDivElement>;

/* ---------- Layout ---------- */

export const Container = forwardRef<HTMLDivElement, DivProps>(function Container({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("ox-container", className)} {...rest} />;
});

export const Stack = forwardRef<HTMLDivElement, DivProps & { gap?: number }>(function Stack({ className, gap, style, ...rest }, ref) {
  return <div ref={ref} className={cx("ox-stack", className)} style={gap != null ? { gap: `var(--ox-space-${gap})`, ...style } : style} {...rest} />;
});

export const Row = forwardRef<HTMLDivElement, DivProps & { between?: boolean }>(function Row({ className, between, ...rest }, ref) {
  return <div ref={ref} className={cx("ox-row", between && "ox-between", className)} {...rest} />;
});

export function Divider({ children, className }: { children?: ReactNode; className?: string }) {
  return children ? (
    <div className={cx("ox-divider", className)} role="separator">
      {children}
    </div>
  ) : (
    <hr className={cx("ox-separator", className)} />
  );
}

/* ---------- Card ---------- */

export const Card = forwardRef<HTMLDivElement, DivProps & { interactive?: boolean; invert?: boolean }>(function Card(
  { className, interactive, invert, ...rest },
  ref
) {
  return <div ref={ref} className={cx("ox-card", interactive && "ox-card-interactive", invert && "ox-invert", className)} {...rest} />;
});

export const CardHeader = ({ className, ...rest }: DivProps) => <div className={cx("ox-card-header", className)} {...rest} />;
export const CardBody = ({ className, ...rest }: DivProps) => <div className={cx("ox-card-body", className)} {...rest} />;
export const CardFooter = ({ className, ...rest }: DivProps) => <div className={cx("ox-card-footer", className)} {...rest} />;
export const CardTitle = ({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) => <h3 className={cx("ox-card-title", className)} {...rest} />;
export const CardText = ({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) => <p className={cx("ox-card-text", className)} {...rest} />;

/* ---------- Badge, avatar, kbd ---------- */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "subtle" | "solid" | "outline";
  dot?: boolean;
  /** Pulse the dot, for live status. */
  live?: boolean;
}

export function Badge({ variant = "subtle", dot, live, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cx("ox-badge", variant !== "subtle" && `ox-badge-${variant}`, (dot || live) && "ox-badge-dot", live && "ox-badge-live", className)}
      {...rest}
    />
  );
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Shown when there is no image. Two letters work best. */
  initials?: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  solid?: boolean;
  /** Adds a presence dot. */
  status?: "online" | "away" | "offline";
}

export function Avatar({ initials, src, alt = "", size = "md", solid, status, className, ...rest }: AvatarProps) {
  return (
    <span className={cx("ox-avatar", size !== "md" && `ox-avatar-${size}`, solid && "ox-avatar-solid", className)} data-status={status} {...rest}>
      {src ? <img src={src} alt={alt} /> : initials}
    </span>
  );
}

export const AvatarStack = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => <div className={cx("ox-avatar-stack", className)} {...rest} />;

export const Kbd = ({ className, ...rest }: HTMLAttributes<HTMLElement>) => <kbd className={cx("ox-kbd", className)} {...rest} />;

/* ---------- Feedback ---------- */

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  /** Filled, high-emphasis style for errors and warnings. */
  solid?: boolean;
  /** Character or element in the round icon slot. */
  icon?: ReactNode;
}

export function Alert({ title, solid, icon = "i", className, children, role, ...rest }: AlertProps) {
  return (
    <div className={cx("ox-alert", solid && "ox-alert-solid", className)} role={role ?? (solid ? "alert" : "status")} {...rest}>
      {icon !== null && (
        <span className="ox-alert-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div>
        {title && <strong>{title}</strong>}
        {children}
      </div>
    </div>
  );
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0 to `max`. */
  value: number;
  max?: number;
  label?: string;
}

export function Progress({ value, max = 100, label, className, ...rest }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx("ox-progress", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label} {...rest}>
      <div className="ox-progress-bar" style={{ "--value": `${pct}%` } as CSSProperties} />
    </div>
  );
}

export function Spinner({ label = "Loading", className }: { label?: string; className?: string }) {
  return <div className={cx("ox-spinner", className)} role="status" aria-label={label} />;
}

export function Skeleton({ width, height = 12, radius, className, style }: { width?: number | string; height?: number | string; radius?: number | string; className?: string; style?: CSSProperties }) {
  return <div className={cx("ox-skeleton", className)} aria-hidden="true" style={{ width, height, borderRadius: radius, ...style }} />;
}
