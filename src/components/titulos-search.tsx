"use client";

import { useMemo, useState } from "react";
import { titulosProfesionales } from "@/lib/titulos-profesionales";

export function TitulosSearch() {
  const [query, setQuery] = useState("");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return titulosProfesionales;
    return titulosProfesionales.filter((t) => t.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div className="relative max-w-md">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar título profesional..."
          className="w-full rounded-full border border-surface-border py-2.5 pl-10 pr-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <p className="mt-4 text-sm text-ink-400">
        {filtrados.length} de {titulosProfesionales.length} títulos
      </p>

      <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((titulo) => (
          <li key={titulo} className="flex items-start gap-2 text-sm text-ink-700">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 shrink-0 text-primary-600"
              aria-hidden="true"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {titulo}
          </li>
        ))}
      </ul>

      {filtrados.length === 0 && (
        <p className="mt-8 text-sm text-ink-400">No encontramos títulos que coincidan con tu búsqueda.</p>
      )}
    </div>
  );
}
