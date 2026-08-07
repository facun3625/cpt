import { createNoticia, updateNoticia } from "@/lib/noticia-actions";
import { ImagenDestacadaInput } from "@/components/admin/imagen-destacada-input";
import { NoticiaBloquesInput } from "@/components/admin/noticia-bloques-input";
import type { NoticiaTipo } from "@/generated/prisma/client";

type NoticiaWithBloques = {
  id: string;
  titulo: string;
  pretexto: string | null;
  imagenDestacada: string | null;
  mostrarImagenDestacadaEnCuerpo: boolean;
  video: string | null;
  enSliderHome: boolean;
  bloques: {
    tipo: "TEXTO" | "IMAGEN" | "ARCHIVO";
    texto: string | null;
    imagenUrl: string | null;
    archivoUrl: string | null;
    archivoNombre: string | null;
  }[];
};

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const textareaClass = `${inputClass} resize-y`;

export function NoticiaForm({
  tipo,
  basePath,
  noticia,
}: {
  tipo: NoticiaTipo;
  basePath: string;
  noticia: NoticiaWithBloques | null;
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
          <NoticiaBloquesInput initialBloques={noticia?.bloques ?? []} />
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
          <ImagenDestacadaInput name="imagenDestacada" initialUrl={noticia?.imagenDestacada ?? null} />
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="checkbox"
              name="mostrarImagenDestacadaEnCuerpo"
              defaultChecked={noticia?.mostrarImagenDestacadaEnCuerpo ?? true}
              className="h-4 w-4 rounded border-surface-border"
            />
            Mostrar esta imagen también en el cuerpo de la publicación
          </label>
          <p className="-mt-3 text-xs text-ink-400">
            Desmarcá esto si ya vas a agregar la misma imagen (u otra) como bloque en el cuerpo, para no repetirla.
          </p>
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

      <a href={basePath} className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
        ← Volver al listado
      </a>
    </div>
  );
}
