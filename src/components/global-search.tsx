"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buscarContenido, type SearchResult } from "@/lib/search-actions";

const TIPO_LABEL: Record<string, string> = {
  NOTICIA: "Noticia",
  CAPACITACION: "Capacitación",
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      const r = await buscarContenido(query);
      setResults(r);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar en el sitio"
        className="flex items-center text-white/75 transition-colors hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink-900/50 p-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-surface-border bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-surface-border px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-ink-400">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar noticias y capacitaciones..."
                className="w-full text-sm text-ink-900 outline-none placeholder:text-ink-400"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="shrink-0 text-ink-400 transition-colors hover:text-ink-700"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6 18 18M6 18 18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {loading && <p className="px-3 py-4 text-center text-sm text-ink-400">Buscando…</p>}

              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-ink-400">No encontramos resultados para &ldquo;{query}&rdquo;.</p>
              )}

              {!loading && query.trim().length < 2 && (
                <p className="px-3 py-4 text-center text-sm text-ink-400">Escribí al menos 2 letras para buscar.</p>
              )}

              {!loading &&
                results.map((r) => (
                  <Link
                    key={r.id}
                    href={r.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{r.titulo}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {TIPO_LABEL[r.tipo]} ·{" "}
                        <span className={r.reciente ? "font-semibold text-primary-700" : "text-ink-400"}>
                          {r.publicadoEnText}
                        </span>
                      </p>
                    </div>
                    {r.reciente && (
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                        Reciente
                      </span>
                    )}
                  </Link>
                ))}
            </div>

            <div className="border-t border-surface-border px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new Event("cpt:abrir-chat"));
                }}
                className="flex w-full items-center gap-2 text-xs text-ink-500 transition-colors hover:text-primary-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                  <path d="M4 4h16v12H8l-4 4V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                ¿No encontrás lo que buscás? Consultale al asistente virtual
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
