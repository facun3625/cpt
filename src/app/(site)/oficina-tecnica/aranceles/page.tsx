import type { Metadata } from "next";
import Image from "next/image";
import { getArancelesInfo, getArancelGrupos, getValorM2Status } from "@/lib/site-info";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Aranceles de Oficina Técnica | CPT Santa Fe",
  description: "Aranceles profesionales de la Oficina Técnica del Colegio Profesional de Maestros Mayores de Obras y Técnicos.",
};

const ADICIONAL_LEY_4889_PCT = 0.1;

export default async function ArancelesPage() {
  const [info, grupos, valorM2Status] = await Promise.all([
    getArancelesInfo(),
    getArancelGrupos(),
    getValorM2Status(),
  ]);
  const numeroBase = valorM2Status.current?.valor ?? 0;
  const gruposComunes = grupos.filter((g) => !g.esHonorarioMinimo);
  const honorarioMinimo = grupos.find((g) => g.esHonorarioMinimo);

  const subtotal = honorarioMinimo?.items.reduce((sum, item) => sum + item.valor, 0) ?? 0;
  const adicional = Math.round(subtotal * ADICIONAL_LEY_4889_PCT);
  const total = subtotal + adicional;

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Aranceles de Oficina Técnica" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Aranceles de Oficina Técnica</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Montos del arancel profesional según Resolución N° 150.
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
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent-500/20 bg-accent-500/5 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
              Valores vigentes desde el {info.vigenciaFecha}
            </p>
            <p className="mt-1 text-sm text-ink-600">Número base de tareas concurrentes</p>
          </div>
          <p className="text-2xl font-semibold text-ink-900">{formatCurrency(numeroBase)}</p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-ink-900 sm:text-3xl">Montos del arancel profesional</h2>
        <p className="mt-2 text-sm text-ink-400">Resolución N° 150, Art. 1°</p>

        <div className="mt-8 space-y-6">
          {gruposComunes.map((grupo) => (
            <div key={grupo.id} className="rounded-xl border border-surface-border bg-white p-6">
              <h3 className="text-base font-semibold text-ink-900">{grupo.titulo}</h3>
              <dl className="mt-4 divide-y divide-surface-border">
                {grupo.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-6 py-2.5 text-sm">
                    <dt className="text-ink-600">{item.label}</dt>
                    <dd className="shrink-0 font-semibold text-primary-700">{formatCurrency(item.valor)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {honorarioMinimo && (
          <>
            <h2 className="mt-16 text-2xl font-semibold text-ink-900 sm:text-3xl">Honorario mínimo</h2>
            <p className="mt-2 text-sm text-ink-400">Art. 12°</p>

            <div className="mt-8 rounded-xl border border-primary-900/10 bg-primary-900 p-6">
              <dl className="divide-y divide-white/10">
                {honorarioMinimo.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-6 py-2.5 text-sm">
                    <dt className="text-white/75">{item.label}</dt>
                    <dd className="shrink-0 font-semibold text-white">{formatCurrency(item.valor)}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-6 py-2.5 text-sm">
                  <dt className="text-white/75">Subtotal</dt>
                  <dd className="shrink-0 font-semibold text-white">{formatCurrency(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between gap-6 py-2.5 text-sm">
                  <dt className="text-white/75">Adicional 10% Ley 4889</dt>
                  <dd className="shrink-0 font-semibold text-white">{formatCurrency(adicional)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
                <p className="text-base font-semibold text-white">TOTAL</p>
                <p className="text-2xl font-semibold text-accent-500">{formatCurrency(total)}</p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
