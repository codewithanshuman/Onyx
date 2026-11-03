import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cx } from "./utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fully rounded corners. */
  pill?: boolean;
  /** Square button for a single icon. Remember an aria-label. */
  icon?: boolean;
  /** Stretch to the container's width. */
  block?: boolean;
  /** Show a spinner and block clicks. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", pill, icon, block, loading, className, type = "button", disabled, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        "ox-btn",
        variant !== "primary" && `ox-btn-${variant}`,
        size !== "md" && `ox-btn-${size}`,
        pill && "ox-btn-pill",
        icon && "ox-btn-icon",
        block && "ox-btn-block",
        className
      )}
      data-loading={loading ? "true" : undefined}
      aria-busy={loading || undefined}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});

export interface SegmentedControlProps<T extends string> {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, className, ...rest }: SegmentedControlProps<T>) {
  return (
    <div className={cx("ox-segmented", className)} role="group" aria-label={rest["aria-label"]}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
