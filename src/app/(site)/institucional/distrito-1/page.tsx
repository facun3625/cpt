import type { Metadata } from "next";
import Image from "next/image";
import { DistritoMap } from "@/components/distrito-map";

export const metadata: Metadata = {
  title: "Distrito 1 | CPT Santa Fe",
  description: "Departamentos que integran el Distrito 1 del Colegio Profesional de Maestros Mayores de Obras y Técnicos.",
};

const departamentos = [
  "9 de Julio",
  "Vera",
  "General Obligado",
  "San Javier",
  "La Capital",
  "San Jerónimo",
  "San Cristóbal",
  "San Justo",
  "Las Colonias",
  "Garay",
  "Castellanos",
  "San Martín",
];

export default function Distrito1Page() {
  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Distrito 1" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Distrito 1</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Competencia territorial del Colegio Profesional de Maestros Mayores de Obras y Técnicos.
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

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Departamentos que lo integran</h2>
            <p className="mt-3 max-w-md text-ink-600">
              El Distrito 1 abarca los siguientes 12 departamentos de la provincia de Santa Fe. Pasá el
              mouse sobre cada punto para identificarlo.
            </p>
            <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-2">
              {departamentos.map((nombre, i) => (
                <li key={nombre} className="flex items-center gap-2 text-sm text-ink-700">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      nombre === "La Capital" ? "bg-accent-500" : "bg-primary-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {nombre}
                </li>
              ))}
            </ol>
          </div>

          <DistritoMap />
        </div>
      </section>
    </div>
  );
}
