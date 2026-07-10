"use client";

import { useState } from "react";
import { createArchivo } from "@/app/admin/(panel)/repositorio/actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const fileInputClass =
  "mt-2 block text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900";

export function NuevoArchivoModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
      >
        + Nuevo
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink-900">Nuevo archivo</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="text-ink-400 transition-colors hover:text-ink-700"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6 18 18M6 18 18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form action={createArchivo} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-ink-500">Título</label>
                <input name="titulo" required autoFocus className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">Archivo (PDF o ZIP)</label>
                <input name="archivo" type="file" accept=".pdf,.zip" required className={fileInputClass} />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
              >
                Agregar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
