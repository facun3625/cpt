import { updateArchivo } from "@/app/admin/(panel)/repositorio/actions";
import { formatFileSize } from "@/lib/format";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const fileInputClass =
  "mt-2 block text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900";

type Archivo = {
  id: string;
  titulo: string;
  url: string;
  extension: string;
  tamano: number;
};

export function RepositorioForm({ archivo }: { archivo: Archivo }) {
  return (
    <div className="max-w-xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Editar archivo</h1>

      <form action={updateArchivo.bind(null, archivo.id)} className="mt-6 space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div>
          <label className="text-xs font-medium text-ink-500">Título</label>
          <input name="titulo" defaultValue={archivo.titulo} required className={inputClass} />
        </div>

        <div>
          <label className="text-xs font-medium text-ink-500">Reemplazar archivo (opcional)</label>
          <p className="mt-1 text-xs text-ink-400">
            Archivo actual: <span className="font-semibold uppercase">{archivo.extension}</span> ·{" "}
            {formatFileSize(archivo.tamano)}
          </p>
          <input name="archivo" type="file" accept=".pdf,.zip" className={fileInputClass} />
        </div>

        <button
          type="submit"
          className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
        >
          Guardar
        </button>
      </form>

      <a
        href="/admin/repositorio"
        className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
      >
        ← Volver al listado
      </a>
    </div>
  );
}
