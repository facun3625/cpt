"use client";

import { useMemo, useState } from "react";

type Tecnico = {
  id: string;
  nombre: string;
  localidad: string;
  descripcion: string;
  disponibilidad: string | null;
  telefono: string;
  email: string;
  mostrarTelefono: boolean;
  mostrarEmail: boolean;
  destacado: boolean;
  especialidad: { id: string; nombre: string };
};

type Especialidad = { id: string; nombre: string };

export function BolsaTecnicosList({ tecnicos, especialidades }: { tecnicos: Tecnico[]; especialidades: Especialidad[] }) {
  const [query, setQuery] = useState("");
  const [especialidadId, setEspecialidadId] = useState("");
  const [localidad, setLocalidad] = useState("");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    const loc = localidad.trim().toLowerCase();
    return tecnicos.filter((t) => {
      if (especialidadId && t.especialidad.id !== especialidadId) return false;
      if (loc && !t.localidad.toLowerCase().includes(loc)) return false;
      if (q && !`${t.nombre} ${t.descripcion}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tecnicos, query, especialidadId, localidad]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o servicio..."
          className="w-full rounded-full border border-surface-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <select
          value={especialidadId}
          onChange={(e) => setEspecialidadId(e.target.value)}
          className="w-full rounded-full border border-surface-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
          placeholder="Localidad"
          className="w-full rounded-full border border-surface-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <p className="mt-4 text-sm text-ink-400">
        {filtrados.length} de {tecnicos.length} técnicos disponibles
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {filtrados.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border bg-white p-5 ${t.destacado ? "border-accent-500/40 ring-1 ring-accent-500/20" : "border-surface-border"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-ink-900">{t.nombre}</p>
              {t.destacado && (
                <span className="shrink-0 rounded-full bg-accent-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-600">
                  Destacado
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-semibold text-primary-700">{t.especialidad.nombre}</p>
            <p className="mt-0.5 text-xs text-ink-400">{t.localidad}</p>
            <p className="mt-3 text-sm text-ink-600">{t.descripcion}</p>
            {t.disponibilidad && <p className="mt-2 text-xs text-ink-500">Disponibilidad: {t.disponibilidad}</p>}
            {(t.mostrarTelefono || t.mostrarEmail) && (
              <div className="mt-3 space-y-1 border-t border-surface-border pt-3 text-xs text-ink-600">
                {t.mostrarTelefono && <p>Tel: {t.telefono}</p>}
                {t.mostrarEmail && <p>Email: {t.email}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtrados.length === 0 && (
        <p className="mt-8 text-center text-sm text-ink-400">
          {tecnicos.length === 0 ? "Todavía no hay técnicos registrados." : "No encontramos técnicos que coincidan con tu búsqueda."}
        </p>
      )}
    </div>
  );
}
