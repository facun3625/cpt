import type { Metadata } from "next";
import Image from "next/image";
import { getNoticias } from "@/lib/site-info";
import { NoticiasGrid } from "@/components/noticias-grid";

export const metadata: Metadata = {
  title: "Capacitaciones | CPT Santa Fe",
  description: "Capacitaciones y jornadas para matriculados del Colegio Profesional de Maestros Mayores de Obras y Técnicos.",
};

export default async function CapacitacionesPage() {
  const capacitaciones = await getNoticias("CAPACITACION");

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Capacitaciones" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Capacitaciones</h1>
          <p className="mt-3 max-w-2xl text-white/80">Jornadas y capacitaciones para matriculados.</p>
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
        <NoticiasGrid items={capacitaciones} basePath="/de-interes/capacitaciones" />
      </section>
    </div>
  );
}
