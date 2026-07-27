"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { eliminarSolicitudes } from "@/app/admin/(panel)/certificados/actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type Solicitud = {
  id: string;
  nombre: string;
  apellido: string;
  numeroMatricula: string;
  lugarPresentacion: string;
  estado: string;
  createdAt: Date;
};

const ESTADO_STYLE: Record<string, string> = {
  PENDIENTE: "bg-accent-500/10 text-accent-600",
  APROBADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-ink-900/10 text-ink-600",
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function normalizar(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function CertificadosList({ solicitudes }: { solicitudes: Solicitud[] }) {
  const [query, setQuery] = useState("");
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [confirmando, setConfirmando] = useState(false);

  const filtradas = useMemo(() => {
    const q = normalizar(query.trim());
    if (!q) return solicitudes;
    return solicitudes.filter((s) => normalizar(`${s.apellido} ${s.nombre} ${s.numeroMatricula}`).includes(q));
  }, [solicitudes, query]);

  const todasSeleccionadas = filtradas.length > 0 && filtradas.every((s) => seleccionadas.has(s.id));

  function toggleUna(id: string) {
    setSeleccionadas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleTodas() {
    setSeleccionadas((prev) => {
      if (todasSeleccionadas) return new Set();
      return new Set(filtradas.map((s) => s.id));
    });
  }

  function confirmarEliminar() {
    startTransition(async () => {
      await eliminarSolicitudes(Array.from(seleccionadas));
      setSeleccionadas(new Set());
      setConfirmando(false);
    });
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1">
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
            placeholder="Buscar por nombre o matrícula..."
            className="w-full rounded-full border border-surface-border py-2.5 pl-10 pr-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {seleccionadas.size > 0 && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setConfirmando(true)}
            className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
          >
            {isPending ? "Eliminando…" : `Eliminar (${seleccionadas.size})`}
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-ink-400">
          {filtradas.length} de {solicitudes.length} solicitudes
        </p>
        {filtradas.length > 0 && (
          <label className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
            <input
              type="checkbox"
              checked={todasSeleccionadas}
              onChange={toggleTodas}
              className="h-3.5 w-3.5 rounded border-surface-border"
            />
            Seleccionar todas
          </label>
        )}
      </div>

      <div className="mt-2 space-y-3">
        {filtradas.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-surface-border bg-white p-4 transition-colors hover:border-primary-400"
          >
            <input
              type="checkbox"
              checked={seleccionadas.has(s.id)}
              onChange={() => toggleUna(s.id)}
              className="h-4 w-4 shrink-0 rounded border-surface-border"
            />
            <Link href={`/admin/certificados/${s.id}`} className="flex min-w-0 flex-1 items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {s.apellido}, {s.nombre} <span className="font-normal text-ink-400">— Matrícula {s.numeroMatricula}</span>
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-400">
                  {s.lugarPresentacion} · {dateFormatter.format(s.createdAt)}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_STYLE[s.estado]}`}>
                {s.estado}
              </span>
            </Link>
          </div>
        ))}

        {filtradas.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-center text-sm text-ink-500">
            {solicitudes.length === 0
              ? "Todavía no hay solicitudes de certificados."
              : "No encontramos solicitudes que coincidan con tu búsqueda."}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirmando}
        title="Eliminar solicitudes"
        description={`¿Eliminar ${seleccionadas.size} solicitud${seleccionadas.size === 1 ? "" : "es"} de certificado? Esta acción no se puede deshacer.`}
        pending={isPending}
        onConfirm={confirmarEliminar}
        onCancel={() => setConfirmando(false)}
      />
    </div>
  );
}
