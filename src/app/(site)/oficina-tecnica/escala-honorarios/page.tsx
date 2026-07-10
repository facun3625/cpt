import type { Metadata } from "next";
import Image from "next/image";
import { arquitectura, ingenieria, disposicionesGenerales, type Categoria } from "@/lib/escala-honorarios";

export const metadata: Metadata = {
  title: "Escala de Honorarios | CPT Santa Fe",
  description: "Escala acumulativa de honorarios profesionales de Arquitectura e Ingeniería de la Oficina Técnica del Colegio.",
};

function CategoriaCard({ categoria }: { categoria: Categoria }) {
  return (
    <div className="rounded-xl border border-surface-border bg-white p-6">
      <h3 className="text-base font-semibold text-ink-900">{categoria.nombre}</h3>
      <dl className="mt-4 divide-y divide-surface-border">
        {categoria.tramos.map((tramo, i) => (
          <div key={i} className="flex items-center justify-between gap-6 py-2 text-sm">
            <dt className="text-ink-600">
              <span className="font-semibold text-primary-700">{tramo.pct}</span> de {tramo.base}
            </dt>
            <dd className="shrink-0 font-medium text-ink-900">{tramo.monto}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-2 flex items-center justify-between gap-6 border-t border-ink-900/10 pt-2 text-sm font-semibold">
        <dt className="text-ink-900">{categoria.totalBase}</dt>
        <dd className="text-primary-700">{categoria.totalMonto}</dd>
      </div>
      <p className="mt-3 text-sm font-semibold text-accent-600">+ {categoria.saldo} sobre el excedente</p>
    </div>
  );
}

export default function EscalaHonorariosPage() {
  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Escala de Honorarios" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Escala de Honorarios</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Escala acumulativa de honorarios profesionales según monto de obra, por categoría y profesión.
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

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-xl border border-accent-500/20 bg-accent-500/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
            Valores acumulativos vigentes desde el 09/03/2026
          </p>
          <p className="mt-2 text-sm text-ink-600">
            Cada categoría aplica un porcentaje decreciente sobre tramos acumulativos del monto de obra.
            Superado el último tramo, se aplica el porcentaje del saldo sobre el excedente.
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-ink-900 sm:text-3xl">Arquitectura</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {arquitectura.map((cat) => (
            <CategoriaCard key={cat.nombre} categoria={cat} />
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-ink-900 sm:text-3xl">Ingeniería</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {ingenieria.map((cat) => (
            <CategoriaCard key={cat.nombre} categoria={cat} />
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-ink-900 sm:text-3xl">Disposiciones generales</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {disposicionesGenerales.map((cat) => (
            <CategoriaCard key={cat.nombre} categoria={cat} />
          ))}
        </div>
      </section>
    </div>
  );
}
