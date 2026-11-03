import { createContext, useContext, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cx, useControllableState } from "./utils";

/* =========================================================
   Tabs
   ========================================================= */

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used inside <Tabs>.");
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, defaultValue, onValueChange, children, className }: TabsProps) {
  const [current, setValue] = useControllableState(value, defaultValue, onValueChange);
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ value: current, setValue, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, "aria-label": label, className }: { children: ReactNode; "aria-label": string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { setValue } = useTabs();

  // Arrow keys, Home and End move between tabs and select them
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const tabs = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []);
    const at = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (at === -1) return;
    let next = -1;
    if (e.key === "ArrowRight") next = (at + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (at - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === -1) return;
    e.preventDefault();
    tabs[next].focus();
    setValue(tabs[next].dataset.value as string);
  }

  return (
    <div ref={ref} className={cx("ox-tabs-list", className)} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      {children}
    </div>
  );
}

export function Tab({ value, children, disabled }: { value: string; children: ReactNode; disabled?: boolean }) {
  const { value: current, setValue, baseId } = useTabs();
  const selected = current === value;
  return (
    <button
      type="button"
      role="tab"
      className="ox-tab"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-value={value}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { value: current, baseId } = useTabs();
  return (
    <div
      role="tabpanel"
      className={cx("ox-tab-panel", className)}
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={current !== value}
      tabIndex={0}
    >
      {current === value ? children : null}
    </div>
  );
}

/* =========================================================
   Accordion (native <details>)
   ========================================================= */

export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("ox-accordion", className)}>{children}</div>;
}

export function AccordionItem({ title, children, defaultOpen }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen}>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}
