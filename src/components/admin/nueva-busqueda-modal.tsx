"use client";

import { useState } from "react";
import { createBusqueda } from "@/app/admin/(panel)/bolsa-de-trabajo/busquedas/actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const textareaClass = `${inputClass} resize-y`;

type Especialidad = { id: string; nombre: string };

export function NuevaBusquedaModal({ especialidades }: { especialidades: Especialidad[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
      >
        + Nueva búsqueda
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4" onClick={() => setOpen(false)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-surface-border bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink-900">Nueva búsqueda laboral</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="text-ink-400 transition-colors hover:text-ink-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6 18 18M6 18 18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form action={createBusqueda} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-ink-500">Título del puesto</label>
                <input name="titulo" required autoFocus className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">Empresa</label>
                <input name="empresa" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">Descripción</label>
                <textarea name="descripcion" required rows={3} className={textareaClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-ink-500">Localidad</label>
                  <input name="localidad" required className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-500">Modalidad</label>
                  <select name="modalidad" defaultValue="PRESENCIAL" className={inputClass}>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">Especialidad requerida</label>
                <select name="especialidadId" defaultValue="" className={inputClass}>
                  <option value="">Sin especificar</option>
                  {especialidades.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">Contacto</label>
                <input name="contacto" required placeholder="Email o teléfono para postularse" className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">Fecha de cierre (opcional)</label>
                <input name="fechaCierre" type="date" className={inputClass} />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
              >
                Publicar búsqueda
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
