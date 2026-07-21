"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { reenviarEnlaceDesdeListado } from "@/app/admin/(panel)/credenciales/actions";

type Solicitud = {
  id: string;
  nombre: string;
  apellido: string;
  numeroMatricula: string;
  fotoUrl: string;
  estado: string;
  createdAt: Date;
};

const ESTADO_STYLE: Record<string, string> = {
  PENDIENTE: "bg-accent-500/10 text-accent-600",
  APROBADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-ink-900/10 text-ink-600",
  REVOCADO: "bg-ink-900/10 text-ink-500 line-through",
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

export function CredencialesList({ solicitudes }: { solicitudes: Solicitud[] }) {
  const [query, setQuery] = useState("");
  const [estadoEnvio, setEstadoEnvio] = useState<Record<string, "ok" | "error">>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleReenviar(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const { enviado } = await reenviarEnlaceDesdeListado(id);
      setEstadoEnvio((prev) => ({ ...prev, [id]: enviado ? "ok" : "error" }));
      setPendingId(null);
    });
  }

  const filtradas = useMemo(() => {
    const q = normalizar(query.trim());
    if (!q) return solicitudes;
    return solicitudes.filter((s) => normalizar(`${s.apellido} ${s.nombre} ${s.numeroMatricula}`).includes(q));
  }, [solicitudes, query]);

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
          placeholder="Buscar por nombre o matrícula..."
          className="w-full rounded-full border border-surface-border py-2.5 pl-10 pr-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <p className="mt-3 text-xs text-ink-400">
        {filtradas.length} de {solicitudes.length} solicitudes
      </p>

      <div className="mt-4 space-y-3">
        {filtradas.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-white p-4 transition-colors hover:border-primary-400"
          >
            <Link href={`/admin/credenciales/${s.id}`} className="flex min-w-0 flex-1 items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.fotoUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full border border-surface-border object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {s.apellido}, {s.nombre}{" "}
                  <span className="font-normal text-ink-400">— Matrícula {s.numeroMatricula}</span>
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-400">{dateFormatter.format(s.createdAt)}</p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              {s.estado === "APROBADO" && (
                <button
                  type="button"
                  disabled={isPending && pendingId === s.id}
                  onClick={() => handleReenviar(s.id)}
                  title="Reenviar el enlace de descarga por email"
                  className="rounded-full border border-surface-border px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:opacity-60"
                >
                  {pendingId === s.id
                    ? "Enviando..."
                    : estadoEnvio[s.id] === "ok"
                      ? "Enviado ✓"
                      : estadoEnvio[s.id] === "error"
                        ? "Error, reintentar"
                        : "Reenviar"}
                </button>
              )}
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_STYLE[s.estado]}`}>
                {s.estado}
              </span>
            </div>
          </div>
        ))}

        {filtradas.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-center text-sm text-ink-500">
            {solicitudes.length === 0
              ? "Todavía no hay solicitudes de credenciales."
              : "No encontramos solicitudes que coincidan con tu búsqueda."}
          </p>
        )}
      </div>
    </div>
  );
}
