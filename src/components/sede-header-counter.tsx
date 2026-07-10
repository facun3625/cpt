"use client";

import { useSedeHeader } from "./sede-header-context";

export function SedeHeaderCounter() {
  const { checked, warning } = useSedeHeader();

  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-xs font-medium text-accent-600 transition-opacity duration-300 ${
          warning ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        Ya hay 2 sedes en el header — destildá una primero
      </span>
      <span className="text-xs font-medium text-ink-500">{checked.size}/2 en el header</span>
    </div>
  );
}
