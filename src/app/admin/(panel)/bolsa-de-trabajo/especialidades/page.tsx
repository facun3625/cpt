import { getEspecialidades } from "@/lib/site-info";
import { createEspecialidad, updateEspecialidad, deleteEspecialidad } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

export default async function EspecialidadesAdminPage() {
  const especialidades = await getEspecialidades();

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Especialidades / tecnicaturas</h1>
      <p className="mt-1 text-sm text-ink-600">
        Opciones que los técnicos eligen al registrarse en la Bolsa de Trabajo y que se usan como filtro público.
      </p>

      <div className="mt-6 space-y-4">
        {especialidades.map((especialidad) => (
          <form
            key={especialidad.id}
            action={updateEspecialidad.bind(null, especialidad.id)}
            className="flex flex-wrap items-end gap-4 rounded-xl border border-surface-border bg-white p-5"
          >
            <div className="min-w-[220px] flex-1">
              <label className="text-xs font-medium text-ink-500">Nombre</label>
              <input name="nombre" defaultValue={especialidad.nombre} required className={inputClass} />
            </div>
            <button
              type="submit"
              className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
            >
              Guardar
            </button>
            <button
              type="submit"
              formAction={deleteEspecialidad.bind(null, especialidad.id)}
              className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
            >
              Eliminar
            </button>
          </form>
        ))}

        {especialidades.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no hay especialidades cargadas.
          </p>
        )}

        <form action={createEspecialidad} className="flex flex-wrap items-end gap-4 rounded-xl border border-dashed border-surface-border bg-surface p-5">
          <div className="min-w-[220px] flex-1">
            <label className="text-xs font-medium text-ink-500">Nombre</label>
            <input name="nombre" placeholder="Ej: Instalaciones eléctricas" required className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Agregar especialidad
          </button>
        </form>
      </div>

      <a
        href="/admin/bolsa-de-trabajo"
        className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
      >
        ← Volver a técnicos
      </a>
    </div>
  );
}
