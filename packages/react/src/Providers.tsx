import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

/* =========================================================
   Toasts
   ========================================================= */

interface ToastItem {
  id: number;
  message: ReactNode;
  leaving: boolean;
}

type ToastFn = (message: ReactNode, options?: { duration?: number }) => void;

const ToastContext = createContext<ToastFn | null>(null);

/** Renders toasts for everything inside it. Use `useToast()` to show one. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const toast = useCallback<ToastFn>((message, options) => {
    const id = nextId.current++;
    const duration = options?.duration ?? 2800;
    setItems((list) => [...list, { id, message, leaving: false }]);
    const later = (ms: number, fn: () => void) => {
      const t = setTimeout(() => { timers.current.delete(t); fn(); }, ms);
      timers.current.add(t);
    };
    later(duration, () => setItems((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t))));
    later(duration + 220, () => setItems((list) => list.filter((t) => t.id !== id)));
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="ox-toast-region ox" aria-live="polite">
            {items.map((t) => (
              <div key={t.id} className="ox-toast" role="status" data-leaving={t.leaving ? "" : undefined}>
                {t.message}
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>.");
  return ctx;
}

/* =========================================================
   Theme
   ========================================================= */

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  /** What the user picked. */
  theme: Theme;
  /** What is actually showing. */
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "onyx-theme";

function systemTheme(): "light" | "dark" {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Applies the theme to <html data-theme>, remembers the choice and follows the OS when set to "system". */
export function ThemeProvider({ children, defaultTheme = "system" }: { children: ReactNode; defaultTheme?: Theme }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try { return (localStorage.getItem(STORAGE_KEY) as Theme) || defaultTheme; } catch { return defaultTheme; }
  });
  const [system, setSystem] = useState<"light" | "dark">(systemTheme);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => setSystem(mq.matches ? "dark" : "light");
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const resolved = theme === "system" ? system : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => {
    const setTheme = (t: Theme) => {
      setThemeState(t);
      try { localStorage.setItem(STORAGE_KEY, t); } catch { /* storage unavailable */ }
    };
    return { theme, resolved, setTheme, toggle: () => setTheme(resolved === "dark" ? "light" : "dark") };
  }, [theme, resolved]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>.");
  return ctx;
}
