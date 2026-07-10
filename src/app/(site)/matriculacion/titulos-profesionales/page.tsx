import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TitulosSearch } from "@/components/titulos-search";

export const metadata: Metadata = {
  title: "Títulos profesionales | CPT Santa Fe",
  description: "Listado de títulos profesionales que matricula el Colegio Profesional de Maestros Mayores de Obras y Técnicos.",
};

export default function TitulosProfesionalesPage() {
  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Títulos profesionales" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Títulos profesionales</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Listado de títulos que matricula el Colegio Profesional de Maestros Mayores de Obras y Técnicos.
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
        <TitulosSearch />

        <div className="mt-12 rounded-xl border border-surface-border bg-surface p-6">
          <p className="text-sm text-ink-600">
            ¿Tu título no está en la lista o querés conocer la documentación necesaria para matricularte?
            Consultá los requisitos de matriculación.
          </p>
          <Link
            href="/matriculacion/requisitos"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            Ver requisitos de matriculación →
          </Link>
        </div>
      </section>
    </div>
  );
}
