"use client";

import { useMemo, useState } from "react";
import { formatFileSize } from "@/lib/format";

type Archivo = {
  id: string;
  titulo: string;
  url: string;
  extension: string;
  tamano: number;
};

const ICON_STYLE: Record<string, { bg: string; ring: string; text: string }> = {
  pdf: { bg: "bg-accent-500", ring: "ring-accent-500/15", text: "text-white" },
  zip: { bg: "bg-primary-700", ring: "ring-primary-700/15", text: "text-white" },
};

function FileIcon({ extension }: { extension: string }) {
  const style = ICON_STYLE[extension] ?? { bg: "bg-ink-600", ring: "ring-ink-600/15", text: "text-white" };
  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-8 transition-transform duration-300 group-hover:scale-110 ${style.bg} ${style.ring}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={style.text}>
        <path
          d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function RepositorioSearch({ archivos }: { archivos: Archivo[] }) {
  const [query, setQuery] = useState("");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return archivos;
    return archivos.filter((a) => a.titulo.toLowerCase().includes(q));
  }, [archivos, query]);

  return (
    <div>
      <div className="relative w-full">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar archivo..."
          className="w-full rounded-full border border-surface-border bg-white py-3 pl-11 pr-4 text-sm text-ink-900 shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <p className="mt-4 text-sm text-ink-400">
        {query ? `${filtrados.length} de ${archivos.length} archivos` : `${archivos.length} archivo${archivos.length === 1 ? "" : "s"} disponible${archivos.length === 1 ? "" : "s"}`}
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {filtrados.map((archivo) => (
          <li key={archivo.id}>
            <a
              href={archivo.url}
              download
              className="group flex items-center gap-6 rounded-xl border border-surface-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg"
            >
              <FileIcon extension={archivo.extension} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900 group-hover:text-primary-700">
                  {archivo.titulo}
                </p>
                <p className="mt-1.5 text-xs text-ink-400">{formatFileSize(archivo.tamano)}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
                  Descargar
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {filtrados.length === 0 && (
        <p className="mt-8 text-center text-sm text-ink-400">
          {archivos.length === 0
            ? "Todavía no hay archivos cargados en el repositorio."
            : "No encontramos archivos que coincidan con tu búsqueda."}
        </p>
      )}
    </div>
  );
}
