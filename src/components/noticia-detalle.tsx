import { getVideoEmbedUrl } from "@/lib/video";
import { NoticiaImagenLightbox } from "@/components/noticia-imagen-lightbox";
import { textoBloqueAHtml } from "@/lib/sanitize-html";

type Bloque = {
  id: string;
  tipo: "TEXTO" | "IMAGEN" | "ARCHIVO";
  texto: string | null;
  imagenUrl: string | null;
  archivoUrl: string | null;
  archivoNombre: string | null;
};

type NoticiaDetalleProps = {
  titulo: string;
  pretexto: string | null;
  imagenDestacada: string | null;
  mostrarImagenDestacadaEnCuerpo: boolean;
  video: string | null;
  publicadoEn: Date;
  bloques: Bloque[];
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function NoticiaDetalle({
  titulo,
  pretexto,
  imagenDestacada,
  mostrarImagenDestacadaEnCuerpo,
  video,
  publicadoEn,
  bloques,
}: NoticiaDetalleProps) {
  const embedUrl = video ? getVideoEmbedUrl(video) : null;

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-ink-900" />
        <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{dateFormatter.format(publicadoEn)}</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{titulo}</h1>
          {pretexto && <p className="mt-3 max-w-2xl text-white/80">{pretexto}</p>}
        </div>
        <svg
          className="absolute inset-x-0 bottom-0 block h-10 w-full text-ink-900"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,20 C320,20 460,85 720,85 C980,85 1120,20 1440,20 L1440,100 L0,100 Z" fill="currentColor" />
        </svg>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {imagenDestacada && mostrarImagenDestacadaEnCuerpo && (
          <div className="mb-10">
            <NoticiaImagenLightbox src={imagenDestacada} alt={titulo} />
          </div>
        )}

        {embedUrl && (
          <div className="mb-10 aspect-video overflow-hidden rounded-xl border border-surface-border">
            <iframe
              src={embedUrl}
              title={titulo}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {bloques.length > 0 ? (
          <div className="space-y-6">
            {bloques.map((bloque) => {
              if (bloque.tipo === "TEXTO") {
                return (
                  <div
                    key={bloque.id}
                    className="noticia-cuerpo text-ink-700"
                    dangerouslySetInnerHTML={{ __html: textoBloqueAHtml(bloque.texto ?? "") }}
                  />
                );
              }
              if (bloque.tipo === "IMAGEN") {
                return bloque.imagenUrl && <NoticiaImagenLightbox key={bloque.id} src={bloque.imagenUrl} alt="" />;
              }
              return (
                bloque.archivoUrl && (
                  <a
                    key={bloque.id}
                    href={bloque.archivoUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-surface-border bg-surface px-4 py-3 text-sm font-semibold text-primary-700 transition-colors hover:border-primary-400 hover:bg-primary-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {bloque.archivoNombre || "Descargar documento"}
                  </a>
                )
              );
            })}
          </div>
        ) : (
          <p className="text-ink-500">Todavía no se cargó el contenido completo de esta publicación.</p>
        )}
      </section>
    </div>
  );
}
