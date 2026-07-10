import Link from "next/link";
import { getRepositorioArchivos } from "@/lib/site-info";
import { formatFileSize } from "@/lib/format";
import { deleteArchivo } from "./actions";
import { NuevoArchivoModal } from "@/components/admin/nuevo-archivo-modal";

export default async function RepositorioAdminPage() {
  const archivos = await getRepositorioArchivos();

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Repositorio de archivos</h1>
          <p className="mt-1 text-sm text-ink-600">
            {archivos.length} {archivos.length === 1 ? "archivo" : "archivos"} — solo se aceptan PDF o ZIP.
          </p>
        </div>
        <NuevoArchivoModal />
      </div>

      <div className="mt-6 space-y-3">
        {archivos.map((archivo) => (
          <div
            key={archivo.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-white p-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold uppercase text-primary-700">
                {archivo.extension}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{archivo.titulo}</p>
                <p className="mt-0.5 text-xs text-ink-400">{formatFileSize(archivo.tamano)}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={archivo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
              >
                Ver archivo
              </a>
              <Link
                href={`/admin/repositorio/${archivo.id}`}
                className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
              >
                Editar
              </Link>
              <form action={deleteArchivo.bind(null, archivo.id)}>
                <button
                  type="submit"
                  className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}

        {archivos.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no hay archivos cargados. Creá el primero con el botón de arriba.
          </p>
        )}
      </div>
    </div>
  );
}
