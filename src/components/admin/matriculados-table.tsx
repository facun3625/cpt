"use client";

import { useMemo, useState } from "react";
import { updateFechaMatriculacion } from "@/app/admin/(panel)/matriculados/actions";

type Matriculado = {
  id: string;
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  numeroMatricula: string;
  fechaMatriculacion: Date | null;
  email: string | null;
};

function toDateInputValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function MatriculadosTable({ matriculados }: { matriculados: Matriculado[] }) {
  const [query, setQuery] = useState("");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return matriculados;
    return matriculados.filter((m) =>
      `${m.apellido} ${m.nombre} ${m.numeroDocumento} ${m.numeroMatricula} ${m.email ?? ""}`.toLowerCase().includes(q),
    );
  }, [matriculados, query]);

  return (
    <div className="mt-6">
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
          placeholder="Buscar por nombre, DNI o matrícula..."
          className="w-full rounded-full border border-surface-border py-2.5 pl-10 pr-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <p className="mt-3 text-xs text-ink-400">
        {filtrados.length} de {matriculados.length} matriculados
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-surface-border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-3 font-semibold">Apellido y nombre</th>
              <th className="px-4 py-3 font-semibold">N° documento</th>
              <th className="px-4 py-3 font-semibold">N° matrícula</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Fecha de matriculación</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m) => (
              <tr key={m.id} className="border-b border-surface-border last:border-0">
                <td className="px-4 py-2.5 text-ink-900">
                  {m.apellido}, {m.nombre}
                </td>
                <td className="px-4 py-2.5 text-ink-600">{m.numeroDocumento}</td>
                <td className="px-4 py-2.5 font-semibold text-primary-700">{m.numeroMatricula}</td>
                <td className="px-4 py-2.5 text-ink-600">{m.email || <span className="text-ink-300">—</span>}</td>
                <td className="px-4 py-2.5">
                  <form action={updateFechaMatriculacion.bind(null, m.id)} className="flex items-center gap-2">
                    <input
                      type="date"
                      name="fechaMatriculacion"
                      defaultValue={toDateInputValue(m.fechaMatriculacion)}
                      className="rounded-lg border border-surface-border px-2 py-1 text-xs outline-none focus:border-primary-400"
                    />
                    <button
                      type="submit"
                      title="Guardar fecha"
                      className="rounded-full border border-surface-border p-1.5 text-ink-500 transition-colors hover:border-primary-400 hover:text-primary-700"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-400">
            {matriculados.length === 0
              ? "Todavía no se cargó ninguna lista."
              : "No encontramos matriculados que coincidan con tu búsqueda."}
          </p>
        )}
      </div>
    </div>
  );
}
