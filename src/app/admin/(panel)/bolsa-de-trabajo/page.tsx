import Link from "next/link";
import { getTecnicosBolsa } from "@/lib/site-info";
import { toggleActivo, toggleDestacado, deleteTecnico } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function BolsaDeTrabajoAdminPage() {
  const tecnicos = await getTecnicosBolsa();

  return (
    <div className="px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Bolsa de Trabajo — Técnicos</h1>
          <p className="mt-1 text-sm text-ink-600">{tecnicos.length} técnicos registrados.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/bolsa-de-trabajo/busquedas"
            className="rounded-full border border-surface-border px-5 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
          >
            Búsquedas laborales
          </Link>
          <Link
            href="/admin/bolsa-de-trabajo/especialidades"
            className="rounded-full border border-surface-border px-5 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
          >
            Especialidades
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {tecnicos.map((t) => (
          <div key={t.id} className="rounded-xl border border-surface-border bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                  {t.nombre}
                  {t.destacado && (
                    <span className="rounded-full bg-accent-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-600">
                      Destacado
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      t.activo ? "bg-emerald-100 text-emerald-700" : "bg-ink-900/10 text-ink-500"
                    }`}
                  >
                    {t.activo ? "Activo" : "Inactivo"}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-ink-400">
                  Matrícula {t.numeroMatricula} · {t.especialidad.nombre} · {t.localidad} · {dateFormatter.format(t.createdAt)}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-ink-600">{t.descripcion}</p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={`/admin/bolsa-de-trabajo/${t.id}`}
                  className="rounded-full border border-surface-border px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
                >
                  Editar
                </Link>
                <form action={toggleActivo.bind(null, t.id, t.activo)}>
                  <button
                    type="submit"
                    className="rounded-full border border-surface-border px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
                  >
                    {t.activo ? "Desactivar" : "Activar"}
                  </button>
                </form>
                <form action={toggleDestacado.bind(null, t.id, t.destacado)}>
                  <button
                    type="submit"
                    className="rounded-full border border-surface-border px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
                  >
                    {t.destacado ? "Quitar destaque" : "Destacar"}
                  </button>
                </form>
                <form action={deleteTecnico.bind(null, t.id)}>
                  <button
                    type="submit"
                    className="rounded-full border border-surface-border px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {tecnicos.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no hay técnicos registrados.
          </p>
        )}
      </div>
    </div>
  );
}
