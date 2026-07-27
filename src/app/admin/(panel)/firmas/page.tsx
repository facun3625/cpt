import { getFirmas } from "@/lib/site-info";
import { createFirma, updateFirma, deleteFirma } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const fileInputClass =
  "mt-2 block text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900";

export default async function FirmasAdminPage() {
  const firmas = await getFirmas();

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Firmas de autoridades</h1>
      <p className="mt-1 text-sm text-ink-600">
        Firmas institucionales reutilizables. Al aprobar un certificado o una credencial, el administrador elige
        cuáles de estas firmas incluir. Subí la imagen en cualquier formato — se convierte automáticamente.
      </p>

      <div className="mt-6 space-y-4">
        {firmas.map((firma) => (
          <form
            key={firma.id}
            action={updateFirma.bind(null, firma.id)}
            className="flex flex-wrap items-end gap-4 rounded-xl border border-surface-border bg-white p-5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={firma.firmaUrl} alt="" className="h-16 w-32 rounded border border-surface-border object-contain p-1" />
            <div className="min-w-[180px] flex-1">
              <label className="text-xs font-medium text-ink-500">Nombre</label>
              <input name="nombre" defaultValue={firma.nombre} required className={inputClass} />
            </div>
            <div className="min-w-[180px] flex-1">
              <label className="text-xs font-medium text-ink-500">Título / cargo</label>
              <input name="titulo" defaultValue={firma.titulo} required className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-500">Reemplazar firma (opcional)</label>
              <input name="firma" type="file" accept="image/*" className={fileInputClass} />
            </div>
            <button
              type="submit"
              className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
            >
              Guardar
            </button>
            <button
              type="submit"
              formAction={deleteFirma.bind(null, firma.id)}
              className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
            >
              Eliminar
            </button>
          </form>
        ))}

        {firmas.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no hay firmas cargadas.
          </p>
        )}

        <form action={createFirma} className="flex flex-wrap items-end gap-4 rounded-xl border border-dashed border-surface-border bg-surface p-5">
          <div className="min-w-[180px] flex-1">
            <label className="text-xs font-medium text-ink-500">Nombre</label>
            <input name="nombre" placeholder="Ej: M.M.O. Sergio Ismael Romero" required className={inputClass} />
          </div>
          <div className="min-w-[180px] flex-1">
            <label className="text-xs font-medium text-ink-500">Título / cargo</label>
            <input name="titulo" placeholder="Ej: Presidente" required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Firma (imagen)</label>
            <input name="firma" type="file" accept="image/*" required className={fileInputClass} />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Agregar firma
          </button>
        </form>
      </div>
    </div>
  );
}
