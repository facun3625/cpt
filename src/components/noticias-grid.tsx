import Image from "next/image";
import Link from "next/link";

type NoticiaCard = {
  slug: string;
  titulo: string;
  pretexto: string | null;
  imagenDestacada: string | null;
  publicadoEn: Date;
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function NoticiasGrid({ items, basePath }: { items: NoticiaCard[]; basePath: string }) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
        Todavía no hay publicaciones cargadas.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`${basePath}/${item.slug}`}
          className="group overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-xl"
        >
          {item.imagenDestacada ? (
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={item.imagenDestacada}
                alt={item.titulo}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="h-3 bg-primary-900" />
          )}
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              {dateFormatter.format(item.publicadoEn)}
            </p>
            <h3 className="mt-1 text-base font-semibold text-ink-900 transition-colors group-hover:text-primary-700">
              {item.titulo}
            </h3>
            {item.pretexto && <p className="mt-2 text-sm text-ink-600 line-clamp-3">{item.pretexto}</p>}
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
              Ingresar
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
