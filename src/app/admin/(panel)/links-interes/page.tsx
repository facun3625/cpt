import { getLinksInteres } from "@/lib/site-info";
import { createLink, updateLink, deleteLink } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

export default async function LinksInteresAdminPage() {
  const links = await getLinksInteres();

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Links de interés</h1>
      <p className="mt-1 text-sm text-ink-600">
        Aparecen dentro del menú &ldquo;Serv. a Matriculados&rdquo; del sitio y se abren en una pestaña nueva.
      </p>

      <div className="mt-6 space-y-4">
        {links.map((link) => (
          <form
            key={link.id}
            action={updateLink.bind(null, link.id)}
            className="flex flex-wrap items-end gap-4 rounded-xl border border-surface-border bg-white p-5"
          >
            <div className="min-w-[220px] flex-1">
              <label className="text-xs font-medium text-ink-500">Título</label>
              <input name="titulo" defaultValue={link.titulo} required className={inputClass} />
            </div>
            <div className="min-w-[220px] flex-1">
              <label className="text-xs font-medium text-ink-500">Link</label>
              <input name="url" defaultValue={link.url} required placeholder="https://..." className={inputClass} />
            </div>
            <button
              type="submit"
              className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
            >
              Guardar
            </button>
            <button
              type="submit"
              formAction={deleteLink.bind(null, link.id)}
              className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
            >
              Eliminar
            </button>
          </form>
        ))}

        {links.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no hay links de interés cargados.
          </p>
        )}

        <form action={createLink} className="flex flex-wrap items-end gap-4 rounded-xl border border-dashed border-surface-border bg-surface p-5">
          <div className="min-w-[220px] flex-1">
            <label className="text-xs font-medium text-ink-500">Título</label>
            <input name="titulo" placeholder="Ej: Caja de Previsión Social" required className={inputClass} />
          </div>
          <div className="min-w-[220px] flex-1">
            <label className="text-xs font-medium text-ink-500">Link</label>
            <input name="url" placeholder="https://..." required className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Agregar link
          </button>
        </form>
      </div>
    </div>
  );
}
