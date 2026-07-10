import Link from "next/link";
import { getCredencialSolicitudes } from "@/lib/site-info";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const ESTADO_STYLE: Record<string, string> = {
  PENDIENTE: "bg-accent-500/10 text-accent-600",
  APROBADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-ink-900/10 text-ink-600",
  REVOCADO: "bg-ink-900/10 text-ink-500 line-through",
};

export default async function CredencialesAdminPage() {
  const solicitudes = await getCredencialSolicitudes();
  const pendientes = solicitudes.filter((s) => s.estado === "PENDIENTE").length;

  return (
    <div className="px-8 py-8">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Credenciales digitales</h1>
        <p className="mt-1 text-sm text-ink-600">
          {solicitudes.length} solicitudes — {pendientes} pendiente{pendientes === 1 ? "" : "s"} de revisión.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {solicitudes.map((s) => (
          <Link
            key={s.id}
            href={`/admin/credenciales/${s.id}`}
            className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-white p-4 transition-colors hover:border-primary-400"
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.fotoUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full border border-surface-border object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {s.apellido}, {s.nombre} <span className="font-normal text-ink-400">— Matrícula {s.numeroMatricula}</span>
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-400">{dateFormatter.format(s.createdAt)}</p>
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_STYLE[s.estado]}`}>
              {s.estado}
            </span>
          </Link>
        ))}

        {solicitudes.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no hay solicitudes de credenciales.
          </p>
        )}
      </div>
    </div>
  );
}
