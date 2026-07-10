import Link from "next/link";
import { getBusquedasLaborales, getEspecialidades } from "@/lib/site-info";
import { NuevaBusquedaModal } from "@/components/admin/nueva-busqueda-modal";

const dateFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

const MODALIDAD_LABEL: Record<string, string> = {
  PRESENCIAL: "Presencial",
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
};

const ESTADO_STYLE: Record<string, string> = {
  ACTIVA: "bg-emerald-100 text-emerald-700",
  CERRADA: "bg-ink-900/10 text-ink-500",
};

export default async function BusquedasLaboralesAdminPage() {
  const [busquedas, especialidades] = await Promise.all([getBusquedasLaborales(), getEspecialidades()]);

  return (
    <div className="px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Búsquedas laborales</h1>
          <p className="mt-1 text-sm text-ink-600">{busquedas.length} publicaciones.</p>
        </div>
        <NuevaBusquedaModal especialidades={especialidades} />
      </div>

      <div className="mt-6 space-y-3">
        {busquedas.map((b) => (
          <Link
            key={b.id}
            href={`/admin/bolsa-de-trabajo/busquedas/${b.id}`}
            className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-white p-4 transition-colors hover:border-primary-400"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">
                {b.titulo} <span className="font-normal text-ink-400">— {b.empresa}</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-400">
                {b.localidad} · {MODALIDAD_LABEL[b.modalidad]} · {b.especialidad?.nombre ?? "Sin especialidad"} ·{" "}
                {dateFormatter.format(b.createdAt)}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_STYLE[b.estado]}`}>
              {b.estado}
            </span>
          </Link>
        ))}

        {busquedas.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no hay búsquedas laborales publicadas.
          </p>
        )}
      </div>

      <a href="/admin/bolsa-de-trabajo" className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
        ← Volver a técnicos
      </a>
    </div>
  );
}
