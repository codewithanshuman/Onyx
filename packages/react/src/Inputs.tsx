import { forwardRef } from "react";
import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";
import { cx, useControllableState } from "./utils";

/* =========================================================
   Range slider
   ========================================================= */

export interface RangeSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(function RangeSlider(
  { value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, className, style, ...rest },
  ref
) {
  const [current, setValue] = useControllableState(value, defaultValue, onValueChange);
  const pct = ((current - min) / (max - min || 1)) * 100;
  return (
    <input
      ref={ref}
      type="range"
      className={cx("ox-range", className)}
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(e) => setValue(Number(e.target.value))}
      style={{ "--_pct": pct + "%", ...style } as CSSProperties}
      {...rest}
    />
  );
});

/* =========================================================
   Number stepper
   ========================================================= */

export interface NumberStepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Accessible name, e.g. "Guests". */
  label: string;
  id?: string;
  className?: string;
}

export function NumberStepper({ value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, label, id, className }: NumberStepperProps) {
  const [current, setValue] = useControllableState(value, defaultValue, onValueChange);
  const clamp = (n: number) => Math.min(max, Math.max(min, +n.toFixed(6)));
  return (
    <div className={cx("ox-stepper", className)}>
      <button type="button" aria-label={"Decrease " + label.toLowerCase()} disabled={current <= min} onClick={() => setValue((prev) => clamp(prev - step))}>−</button>
      <input
        id={id}
        type="number"
        aria-label={label}
        value={current}
        min={Number.isFinite(min) ? min : undefined}
        max={Number.isFinite(max) ? max : undefined}
        step={step}
        onChange={(e) => { if (e.target.value !== "") setValue(clamp(Number(e.target.value))); }}
      />
      <button type="button" aria-label={"Increase " + label.toLowerCase()} disabled={current >= max} onClick={() => setValue((prev) => clamp(prev + step))}>+</button>
    </div>
  );
}

/* =========================================================
   Chips (toggleable filters)
   ========================================================= */

export interface ChipOption {
  value: string;
  label: ReactNode;
}

interface ChipGroupBase {
  options: ChipOption[];
  "aria-label": string;
  className?: string;
}
export interface ChipGroupMultipleProps extends ChipGroupBase {
  multiple?: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}
export interface ChipGroupSingleProps extends ChipGroupBase {
  multiple: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
export type ChipGroupProps = ChipGroupMultipleProps | ChipGroupSingleProps;

/** Several chips can be on at once by default; pass multiple={false} for a single choice. */
export function ChipGroup(props: ChipGroupProps) {
  const single = props.multiple === false;
  const [current, setValue] = useControllableState<string[]>(
    props.value === undefined ? undefined : single ? [props.value as string] : (props.value as string[]),
    single ? (props.defaultValue ? [props.defaultValue as string] : []) : ((props.defaultValue as string[]) ?? []),
    (next) => {
      if (single) (props.onValueChange as ((v: string) => void) | undefined)?.(next[0]);
      else (props.onValueChange as ((v: string[]) => void) | undefined)?.(next);
    }
  );

  function toggle(v: string) {
    if (single) setValue([v]);
    else setValue((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  return (
    <div className={cx("ox-chips", props.className)} role="group" aria-label={props["aria-label"]}>
      {props.options.map((o) => (
        <button key={o.value} type="button" className="ox-chip" aria-pressed={current.includes(o.value)} onClick={() => toggle(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
