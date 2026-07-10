import type { Metadata } from "next";
import Image from "next/image";
import { directorio, tribunalEtica } from "@/lib/directorio";
import { DirectivoCard } from "@/components/directivo-card";

export const metadata: Metadata = {
  title: "Directorio | CPT Santa Fe",
  description: "Autoridades del Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe.",
};

export default function DirectorioPage() {
  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Directorio del CPT Santa Fe" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Directorio</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Autoridades electas del Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe.
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {directorio.map((d) => (
            <DirectivoCard key={d.nombre} {...d} />
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-ink-900 sm:text-3xl">Tribunal de Disciplina y Ética</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tribunalEtica.map((d) => (
            <DirectivoCard key={d.nombre} {...d} />
          ))}
        </div>
      </section>
    </div>
  );
}
