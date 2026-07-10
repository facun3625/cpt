import type { Metadata } from "next";
import Image from "next/image";
import { ValorM2Widget } from "@/components/valor-m2-widget";
import { getValorM2Status, getValorM2DisplayProps } from "@/lib/site-info";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Valor del m² | CPT Santa Fe",
  description: "Consultá el valor vigente del metro cuadrado y calculá tus honorarios al instante.",
};

export default async function ValorM2Page() {
  const status = await getValorM2Status();
  const valorM2 = getValorM2DisplayProps(status);

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Valor del metro cuadrado" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Valor del m²</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Consultá el valor vigente y calculá tus honorarios al instante.
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

      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ValorM2Widget
            valorVigente={valorM2.valorVigente}
            vigenteHasta={valorM2.vigenteHasta}
            valorProximo={valorM2.valorProximo}
            proximoDesde={valorM2.proximoDesde}
          />

          {status.history.length > 0 && (
            <div className="mt-8 rounded-2xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-sm font-semibold text-ink-900">Historial de valores</h3>
              <dl className="mt-3 divide-y divide-surface-border">
                {status.history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between gap-6 py-2.5 text-sm">
                    <dt className="text-ink-500">Desde el {formatDate(entry.vigenteDesde)}</dt>
                    <dd className="font-semibold text-ink-600">{formatCurrency(entry.valor)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
