import Link from "next/link";
import { getNoticias } from "@/lib/site-info";
import { deleteNoticia, toggleEnSlider } from "@/lib/noticia-actions";
import type { NoticiaTipo } from "@/generated/prisma/client";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export async function NoticiasList({
  tipo,
  basePath,
  titulo,
}: {
  tipo: NoticiaTipo;
  basePath: string;
  titulo: string;
}) {
  const noticias = await getNoticias(tipo);

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">{titulo}</h1>
          <p className="mt-1 text-sm text-ink-600">
            {noticias.length} {noticias.length === 1 ? "publicada" : "publicadas"}
          </p>
        </div>
        <Link
          href={`${basePath}/nueva`}
          className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          + Nueva
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {noticias.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-white p-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              {n.imagenDestacada && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={n.imagenDestacada} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{n.titulo}</p>
                <p className="mt-0.5 text-xs text-ink-400">{dateFormatter.format(n.publicadoEn)}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <form action={toggleEnSlider.bind(null, n.id, tipo, n.enSliderHome)}>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                    n.enSliderHome
                      ? "bg-accent-500/10 text-accent-600 hover:bg-accent-500/20"
                      : "border border-surface-border text-ink-400 hover:border-primary-400 hover:text-primary-700"
                  }`}
                  title={n.enSliderHome ? "Quitar del slider" : "Agregar al slider"}
                >
                  {n.enSliderHome && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  En slider
                </button>
              </form>
              <Link
                href={`${basePath}/${n.id}`}
                className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
              >
                Editar
              </Link>
              <form action={deleteNoticia.bind(null, n.id, tipo)}>
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

        {noticias.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no hay ninguna. Creá la primera con el botón de arriba.
          </p>
        )}
      </div>
    </div>
  );
}
