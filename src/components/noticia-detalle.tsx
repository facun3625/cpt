import { getVideoEmbedUrl } from "@/lib/video";
import { NoticiaImagenLightbox } from "@/components/noticia-imagen-lightbox";

type Bloque = {
  id: string;
  tipo: "TEXTO" | "IMAGEN";
  texto: string | null;
  imagenUrl: string | null;
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
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{dateFormatter.format(publicadoEn)}</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{titulo}</h1>
          {pretexto && <p className="mt-3 max-w-2xl text-white/80">{pretexto}</p>}
        </div>
        <svg
          className="absolute inset-x-0 bottom-0 block h-16 w-full text-ink-900"
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
            {bloques.map((bloque) =>
              bloque.tipo === "TEXTO" ? (
                <div key={bloque.id} className="space-y-4 text-ink-700">
                  {(bloque.texto ?? "")
                    .replace(/\r\n/g, "\n")
                    .split(/\n{2,}/)
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                </div>
              ) : (
                bloque.imagenUrl && <NoticiaImagenLightbox key={bloque.id} src={bloque.imagenUrl} alt="" />
              ),
            )}
          </div>
        ) : (
          <p className="text-ink-500">Todavía no se cargó el contenido completo de esta publicación.</p>
        )}
      </section>
    </div>
  );
}
