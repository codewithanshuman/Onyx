import { cloneElement, createContext, forwardRef, isValidElement, useContext, useId } from "react";
import type { InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cx } from "./utils";

interface FieldContextValue {
  id: string;
  hintId: string;
  invalid: boolean;
  hasHint: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps {
  label: ReactNode;
  /** Helper text, replaced by `error` when there is one. */
  hint?: ReactNode;
  /** Error message. Marks the control invalid and announces the message. */
  error?: ReactNode;
  /** Use your own id for the control; one is generated otherwise. */
  id?: string;
  className?: string;
  children: ReactElement;
}

/** Wraps one control with a label and hint, wiring up ids and aria attributes. */
export function Field({ label, hint, error, id, className, children }: FieldProps) {
  const auto = useId();
  const controlId = id ?? (children.props as { id?: string }).id ?? `ox-${auto}`;
  const hintId = `${controlId}-hint`;
  const message = error ?? hint;
  const ctx: FieldContextValue = { id: controlId, hintId, invalid: Boolean(error), hasHint: Boolean(message) };

  return (
    <FieldContext.Provider value={ctx}>
      <div className={cx("ox-field", className)} data-invalid={error ? "" : undefined}>
        <label className="ox-label" htmlFor={controlId}>
          {label}
        </label>
        {isValidElement(children) ? cloneElement(children as ReactElement<Record<string, unknown>>, { id: controlId }) : children}
        {message ? (
          <span className="ox-hint" id={hintId} role={error ? "alert" : undefined}>
            {message}
          </span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

function useFieldProps<T extends { id?: string; "aria-describedby"?: string; "aria-invalid"?: InputHTMLAttributes<HTMLInputElement>["aria-invalid"] }>(props: T) {
  const field = useContext(FieldContext);
  if (!field) return props;
  return {
    ...props,
    id: props.id ?? field.id,
    "aria-describedby": cx(props["aria-describedby"], field.hasHint && field.hintId) || undefined,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined)
  };
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cx("ox-input", className)} {...useFieldProps(props)} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cx("ox-textarea", className)} {...useFieldProps(props)} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, ...props }, ref) {
  return <select ref={ref} className={cx("ox-select", className)} {...useFieldProps(props)} />;
});

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: ReactNode };

export const Checkbox = forwardRef<HTMLInputElement, ToggleProps>(function Checkbox({ label, className, ...props }, ref) {
  return (
    <label className={cx("ox-checkbox", className)}>
      <input ref={ref} type="checkbox" {...props} /> {label}
    </label>
  );
});

export const Radio = forwardRef<HTMLInputElement, ToggleProps>(function Radio({ label, className, ...props }, ref) {
  return (
    <label className={cx("ox-radio", className)}>
      <input ref={ref} type="radio" {...props} /> {label}
    </label>
  );
});

export const Switch = forwardRef<HTMLInputElement, ToggleProps>(function Switch({ label, className, ...props }, ref) {
  return (
    <label className={cx("ox-switch", className)}>
      <input ref={ref} type="checkbox" role="switch" {...props} />
      <span className="ox-switch-track" />
      {label}
    </label>
  );
});
