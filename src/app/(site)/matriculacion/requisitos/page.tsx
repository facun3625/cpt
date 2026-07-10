import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Requisitos de matriculación | CPT Santa Fe",
  description: "Requisitos y documentación necesaria para matricularse en el Colegio Profesional de Maestros Mayores de Obras y Técnicos.",
};

const categorias = [
  {
    titulo: "Ejercicio Independiente",
    requisitos: [
      "Título original y fotocopia autenticada, o Certificado Analítico (copia autenticada)",
      "DNI (fotocopia autenticada)",
      "1 foto carnet 3×3",
      "Cuenta de correo electrónico activa",
    ],
    aranceles: [
      "Derecho de inscripción: $50.000 (pago único)",
      "Matrícula anual 2026: $300.000, en 6 cuotas bimestrales consecutivas de $50.000",
    ],
  },
  {
    titulo: "Relación de Dependencia",
    requisitos: [
      "Título original y fotocopia autenticada, o Certificado Analítico (copia autenticada)",
      "DNI (fotocopia autenticada)",
      "1 foto carnet 3×3",
      "Cuenta de correo electrónico activa",
      "Recibo de sueldo reciente (original y copia)",
      "Certificado de trabajo o alta temprana AFIP",
    ],
    aranceles: [
      "Derecho de inscripción: $50.000 (pago único)",
      "Matrícula anual 2026: $300.000, en 6 cuotas bimestrales consecutivas de $50.000",
    ],
  },
  {
    titulo: "Egresados Recientes (Ejercicio Independiente)",
    requisitos: [
      "Título/Certificado Analítico, o Constancia de Egreso Original con fecha de egreso",
      "DNI (fotocopia autenticada)",
      "1 foto carnet 3×3",
      "Cuenta de correo electrónico activa",
    ],
    aranceles: [
      "Derecho de inscripción: $50.000",
      "Exento de matrícula anual 2026",
      "Beneficio exclusivo para egresados del año 2025",
    ],
  },
];

export default function RequisitosPage() {
  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Requisitos de matriculación" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Requisitos de matriculación</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Documentación necesaria para matricularse en el Colegio Profesional de Maestros Mayores de
            Obras y Técnicos.
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
        <div className="rounded-xl border border-surface-border bg-surface p-6">
          <p className="text-sm text-ink-700">
            La inscripción se realiza de manera presencial en la Oficina Administrativa del Colegio —
            San Martín 1748, 1º piso, Santa Fe — de lunes a viernes de 8 a 13 hs, con la documentación
            correspondiente a tu situación.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {categorias.map((cat) => (
            <div
              key={cat.titulo}
              className="flex flex-col rounded-xl border border-surface-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-ink-900">{cat.titulo}</h2>

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Documentación
              </h3>
              <ul className="mt-3 space-y-2">
                {cat.requisitos.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-ink-700">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mt-0.5 shrink-0 text-primary-600"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {r}
                  </li>
                ))}
              </ul>

              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Aranceles
              </h3>
              <ul className="mt-3 space-y-2">
                {cat.aranceles.map((a) => (
                  <li key={a} className="text-sm font-medium text-primary-700">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-surface-border bg-surface p-6">
          <h3 className="text-sm font-semibold text-ink-900">Caja de Previsión Social</h3>
          <p className="mt-2 text-sm text-ink-600">
            Una vez matriculado, es obligatorio inscribirse en la Caja de Previsión Social de los
            Profesionales de la Ingeniería — San Jerónimo 3033, Santa Fe — para la jubilación
            obligatoria y la cobertura de salud opcional.
          </p>
        </div>
      </section>
    </div>
  );
}
