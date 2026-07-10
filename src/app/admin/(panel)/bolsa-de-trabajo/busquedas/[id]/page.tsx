import { notFound } from "next/navigation";
import { getBusquedaLaboralById, getEspecialidades } from "@/lib/site-info";
import { updateBusqueda, deleteBusqueda } from "../actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const textareaClass = `${inputClass} resize-y`;

function toDateInputValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function BusquedaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [busqueda, especialidades] = await Promise.all([getBusquedaLaboralById(id), getEspecialidades()]);
  if (!busqueda) notFound();

  return (
    <div className="max-w-2xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Editar búsqueda laboral</h1>

      <form action={updateBusqueda.bind(null, busqueda.id)} className="mt-6 space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div>
          <label className="text-xs font-medium text-ink-500">Título del puesto</label>
          <input name="titulo" defaultValue={busqueda.titulo} required className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Empresa</label>
          <input name="empresa" defaultValue={busqueda.empresa} required className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Descripción</label>
          <textarea name="descripcion" defaultValue={busqueda.descripcion} required rows={3} className={textareaClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Localidad</label>
            <input name="localidad" defaultValue={busqueda.localidad} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Modalidad</label>
            <select name="modalidad" defaultValue={busqueda.modalidad} className={inputClass}>
              <option value="PRESENCIAL">Presencial</option>
              <option value="REMOTO">Remoto</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Especialidad requerida</label>
            <select name="especialidadId" defaultValue={busqueda.especialidadId ?? ""} className={inputClass}>
              <option value="">Sin especificar</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Estado</label>
            <select name="estado" defaultValue={busqueda.estado} className={inputClass}>
              <option value="ACTIVA">Activa</option>
              <option value="CERRADA">Cerrada</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Contacto</label>
            <input name="contacto" defaultValue={busqueda.contacto} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Fecha de cierre (opcional)</label>
            <input name="fechaCierre" type="date" defaultValue={toDateInputValue(busqueda.fechaCierre)} className={inputClass} />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
        >
          Guardar cambios
        </button>
      </form>

      <form action={deleteBusqueda.bind(null, busqueda.id)} className="mt-4">
        <button
          type="submit"
          className="rounded-full border border-surface-border px-5 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
        >
          Eliminar búsqueda
        </button>
      </form>

      <a href="/admin/bolsa-de-trabajo/busquedas" className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
        ← Volver al listado
      </a>
    </div>
  );
}
