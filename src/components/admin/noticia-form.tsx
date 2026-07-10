import { createNoticia, updateNoticia, addGaleriaImagen, deleteGaleriaImagen } from "@/lib/noticia-actions";
import type { NoticiaTipo } from "@/generated/prisma/client";

type NoticiaWithGaleria = {
  id: string;
  titulo: string;
  pretexto: string | null;
  texto: string | null;
  imagenDestacada: string | null;
  video: string | null;
  enSliderHome: boolean;
  galeria: { id: string; url: string }[];
};

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const textareaClass = `${inputClass} resize-y`;
const fileInputClass =
  "mt-2 block w-full text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900";

export function NoticiaForm({
  tipo,
  basePath,
  noticia,
}: {
  tipo: NoticiaTipo;
  basePath: string;
  noticia: NoticiaWithGaleria | null;
}) {
  const action = noticia ? updateNoticia.bind(null, noticia.id, tipo) : createNoticia.bind(null, tipo);

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">{noticia ? "Editar" : "Nueva"}</h1>

      <form action={action} className="mt-6 grid gap-5 rounded-xl border border-surface-border bg-white p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Título</label>
            <input name="titulo" defaultValue={noticia?.titulo} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Pretexto (bajada corta)</label>
            <textarea name="pretexto" defaultValue={noticia?.pretexto ?? ""} rows={2} className={textareaClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Texto completo</label>
            <textarea name="texto" defaultValue={noticia?.texto ?? ""} rows={14} className={textareaClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Video (link de YouTube o Vimeo, opcional)</label>
            <input
              name="video"
              type="url"
              defaultValue={noticia?.video ?? ""}
              placeholder="https://youtube.com/watch?v=..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-ink-500">Imagen destacada</label>
            {noticia?.imagenDestacada && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={noticia.imagenDestacada} alt="" className="mt-2 h-40 w-full rounded-lg object-cover" />
            )}
            <input name="imagenDestacada" type="file" accept="image/*" className={fileInputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="checkbox"
              name="enSliderHome"
              defaultChecked={noticia?.enSliderHome}
              className="h-4 w-4 rounded border-surface-border"
            />
            Mostrar en el slider de la home
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
          >
            Guardar
          </button>
        </div>
      </form>

      {noticia && (
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Galería</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {noticia.galeria.map((img) => (
              <div key={img.id} className="relative overflow-hidden rounded-lg border border-surface-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-32 w-full object-cover" />
                <form action={deleteGaleriaImagen.bind(null, img.id, noticia.id, tipo)} className="absolute right-2 top-2">
                  <button
                    type="submit"
                    className="rounded-full bg-ink-900/70 px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-accent-600"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            ))}
            {noticia.galeria.length === 0 && (
              <p className="col-span-full text-sm text-ink-400">Sin imágenes en la galería todavía.</p>
            )}
          </div>
          <form action={addGaleriaImagen.bind(null, noticia.id, tipo)} className="mt-4 flex flex-wrap items-center gap-3">
            <input name="imagen" type="file" accept="image/*" required className={fileInputClass} />
            <button
              type="submit"
              className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Agregar a la galería
            </button>
          </form>
        </div>
      )}

      <a href={basePath} className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
        ← Volver al listado
      </a>
    </div>
  );
}
