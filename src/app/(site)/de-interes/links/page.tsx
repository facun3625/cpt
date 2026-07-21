import type { Metadata } from "next";
import Image from "next/image";
import { getLinksInteres } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Links de interés | CPT Santa Fe",
  description: "Enlaces de interés para matriculados del Colegio Profesional de Maestros Mayores de Obras y Técnicos.",
};

export default async function LinksInteresPage() {
  const links = await getLinksInteres();

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Links de interés" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Links de interés</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Enlaces útiles para matriculados del Colegio.
          </p>
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

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-surface-border bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-700/10 text-primary-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900 group-hover:text-primary-700">{link.titulo}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
                  Visitar
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>

        {links.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-center text-sm text-ink-500">
            Todavía no hay links de interés cargados.
          </p>
        )}
      </section>
    </div>
  );
}
