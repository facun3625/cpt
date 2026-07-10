import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pagos por transferencia bancaria | CPT Santa Fe",
  description: "Cuentas bancarias del Colegio Profesional de Maestros Mayores de Obras y Técnicos para pagar aportes y matrícula por transferencia.",
};

const cuentas = [
  {
    titulo: "Aportes de honorarios profesionales (5%)",
    cbu: "3300500125000080690103",
  },
  {
    titulo: "Matrícula e inscripción profesional",
    cbu: "3300500125000080684050",
  },
];

export default function PagosTransferenciaPage() {
  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Pagos por transferencia bancaria" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Pagos por transferencia bancaria</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Cuentas habilitadas para el pago de aportes de honorarios y matrícula profesional.
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
        <div className="grid gap-6 lg:grid-cols-2">
          {cuentas.map((cuenta) => (
            <div
              key={cuenta.cbu}
              className="rounded-xl border border-surface-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg"
            >
              <h2 className="text-base font-semibold text-ink-900">{cuenta.titulo}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Banco</dt>
                  <dd className="mt-0.5 text-ink-700">Nuevo Banco Santa Fe SA</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Titular</dt>
                  <dd className="mt-0.5 text-ink-700">
                    Colegio Profesional de Maestros Mayores de Obras y Técnicos
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Tipo de cuenta</dt>
                  <dd className="mt-0.5 text-ink-700">Cuenta Corriente Especial para Personas Jurídicas</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">CBU</dt>
                  <dd className="mt-0.5 font-mono text-primary-700">{cuenta.cbu}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">CUIT</dt>
                  <dd className="mt-0.5 font-mono text-primary-700">30-67460944-9</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-surface-border bg-surface p-6">
          <h3 className="text-sm font-semibold text-ink-900">Una vez realizada la transferencia</h3>
          <p className="mt-2 text-sm text-ink-600">
            Enviá el comprobante de pago a{" "}
            <a
              href="mailto:contaduria@cptsantafe.org"
              className="font-semibold text-primary-700 hover:text-primary-900"
            >
              contaduria@cptsantafe.org
            </a>{" "}
            para que sea acreditado en tu cuenta.
          </p>
        </div>
      </section>
    </div>
  );
}
