import Image from "next/image";
import { getVideoEmbedUrl } from "@/lib/video";

type NoticiaDetalleProps = {
  titulo: string;
  pretexto: string | null;
  texto: string | null;
  imagenDestacada: string | null;
  video: string | null;
  publicadoEn: Date;
  galeria: { id: string; url: string }[];
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function NoticiaDetalle({ titulo, pretexto, texto, imagenDestacada, video, publicadoEn, galeria }: NoticiaDetalleProps) {
  const embedUrl = video ? getVideoEmbedUrl(video) : null;
  const parrafos = texto?.replace(/\r\n/g, "\n").split(/\n{2,}/).filter(Boolean) ?? [];

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {imagenDestacada ? (
            <Image src={imagenDestacada} alt={titulo} fill sizes="100vw" className="object-cover" />
          ) : (
            <div className="h-full w-full bg-ink-900" />
          )}
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
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

        {parrafos.length > 0 ? (
          <div className="space-y-4 text-ink-700">
            {parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="text-ink-500">Todavía no se cargó el contenido completo de esta publicación.</p>
        )}

        {galeria.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Galería</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {galeria.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border border-surface-border">
                  <Image src={img.url} alt="" fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
