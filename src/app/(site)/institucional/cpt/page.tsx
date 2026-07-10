import type { Metadata } from "next";
import Image from "next/image";
import { getSedes } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "El CPT | CPT Santa Fe",
  description:
    "Historia y marco legal del Colegio Profesional de Maestros Mayores de Obras y Técnicos de la Provincia de Santa Fe.",
};

export default async function ElCptPage() {
  const sedes = await getSedes();

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="El CPT" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">El CPT</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Colegio Profesional de Maestros Mayores de Obras y Técnicos de la Provincia de Santa Fe.
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
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Quiénes somos</h2>
            <p className="mt-4 text-ink-600">
              El Colegio Profesional de Maestros Mayores de Obras y Técnicos de la Provincia de Santa Fe
              es una entidad de derecho público no estatal que ejerce funciones públicas por delegación
              del Estado provincial, en representación de los profesionales matriculados de la
              construcción en toda la provincia.
            </p>
            <p className="mt-4 text-ink-600">
              Fue creado por la <strong>Ley Provincial N° 10.946</strong>, sancionada el 26 de noviembre
              de 1992 y publicada en el Boletín Oficial de la Provincia el 2 de febrero de 1993.
            </p>
            <p className="mt-4 text-ink-600">
              Entre sus funciones se encuentran el gobierno de la matrícula profesional, el control del
              ejercicio de la profesión, la fijación de aranceles de oficina técnica, la actualización
              del valor del metro cuadrado y el desarrollo de capacitaciones y servicios para sus
              matriculados.
            </p>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface p-6">
            <h3 className="text-base font-semibold text-ink-900">Sedes</h3>
            <ul className="mt-4 space-y-4">
              {sedes.map((sede) => (
                <li key={sede.id}>
                  <p className="font-medium text-ink-900">{sede.nombre}</p>
                  <p className="text-sm text-ink-600">{sede.direccion}</p>
                  <p className="text-sm text-ink-600">{sede.telefono}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
