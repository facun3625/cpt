"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = {
  checked: Set<string>;
  warning: boolean;
  toggle: (id: string) => void;
};

const SedeHeaderContext = createContext<Ctx | null>(null);

export function SedeHeaderProvider({
  initialChecked,
  children,
}: {
  initialChecked: string[];
  children: ReactNode;
}) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set(initialChecked));
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (!warning) return;
    const id = setTimeout(() => setWarning(false), 2600);
    return () => clearTimeout(id);
  }, [warning]);

  function toggle(id: string) {
    setChecked((prev) => {
      if (prev.has(id)) {
        const next = new Set(prev);
        next.delete(id);
        setWarning(false);
        return next;
      }
      if (prev.size >= 2) {
        setWarning(true);
        return prev;
      }
      setWarning(false);
      return new Set(prev).add(id);
    });
  }

  return <SedeHeaderContext.Provider value={{ checked, warning, toggle }}>{children}</SedeHeaderContext.Provider>;
}

export function useSedeHeader() {
  const ctx = useContext(SedeHeaderContext);
  if (!ctx) throw new Error("useSedeHeader must be used within SedeHeaderProvider");
  return ctx;
}
