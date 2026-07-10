import type { Metadata } from "next";
import Image from "next/image";
import { getEspecialidades } from "@/lib/site-info";
import { TecnicoRegistroForm } from "@/components/tecnico-registro-form";

export const metadata: Metadata = {
  title: "Registrate como técnico | CPT Santa Fe",
  description: "Publicá tu perfil en la Bolsa de Trabajo del CPT Santa Fe.",
};

export default async function RegistroTecnicoPage() {
  const especialidades = await getEspecialidades();

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-construction.jpg" alt="Registrate como técnico" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Registrate como técnico</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Publicá tu perfil en la Bolsa de Trabajo del Colegio y que las empresas te encuentren.
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

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <TecnicoRegistroForm especialidades={especialidades} />
      </section>
    </div>
  );
}
