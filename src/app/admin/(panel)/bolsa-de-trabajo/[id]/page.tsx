import { notFound } from "next/navigation";
import { getTecnicoBolsaById, getEspecialidades } from "@/lib/site-info";
import { updateTecnico } from "../actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const textareaClass = `${inputClass} resize-y`;

export default async function TecnicoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tecnico, especialidades] = await Promise.all([getTecnicoBolsaById(id), getEspecialidades()]);
  if (!tecnico) notFound();

  return (
    <div className="max-w-2xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Editar técnico</h1>
      <p className="mt-1 text-sm text-ink-600">Matrícula {tecnico.numeroMatricula}</p>

      <form action={updateTecnico.bind(null, tecnico.id)} className="mt-6 space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Nombre</label>
            <input name="nombre" defaultValue={tecnico.nombre} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Especialidad</label>
            <select name="especialidadId" defaultValue={tecnico.especialidadId} required className={inputClass}>
              {especialidades.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Teléfono</label>
            <input name="telefono" defaultValue={tecnico.telefono} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Email</label>
            <input name="email" type="email" defaultValue={tecnico.email} required className={inputClass} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Localidad</label>
            <input name="localidad" defaultValue={tecnico.localidad} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Disponibilidad</label>
            <input name="disponibilidad" defaultValue={tecnico.disponibilidad ?? ""} placeholder="Ej: Tiempo completo" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Descripción del servicio</label>
          <textarea name="descripcion" defaultValue={tecnico.descripcion} required rows={3} className={textareaClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Observaciones</label>
          <textarea name="observaciones" defaultValue={tecnico.observaciones ?? ""} rows={2} className={textareaClass} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="mostrarTelefono" defaultChecked={tecnico.mostrarTelefono} className="h-4 w-4 rounded border-surface-border" />
            Mostrar teléfono públicamente
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="mostrarEmail" defaultChecked={tecnico.mostrarEmail} className="h-4 w-4 rounded border-surface-border" />
            Mostrar email públicamente
          </label>
        </div>

        <button
          type="submit"
          className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
        >
          Guardar cambios
        </button>
      </form>

      <a href="/admin/bolsa-de-trabajo" className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
        ← Volver al listado
      </a>
    </div>
  );
}
