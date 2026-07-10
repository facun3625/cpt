import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTecnicosBolsaPublicos, getEspecialidades, getBusquedasLaboralesActivas } from "@/lib/site-info";
import { BolsaTecnicosList } from "@/components/bolsa-tecnicos-list";

export const metadata: Metadata = {
  title: "Bolsa de Trabajo | CPT Santa Fe",
  description: "Técnicos matriculados disponibles y búsquedas laborales del CPT Santa Fe.",
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

const MODALIDAD_LABEL: Record<string, string> = {
  PRESENCIAL: "Presencial",
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
};

export default async function BolsaDeTrabajoPage() {
  const [tecnicos, especialidades, busquedas] = await Promise.all([
    getTecnicosBolsaPublicos(),
    getEspecialidades(),
    getBusquedasLaboralesActivas(),
  ]);

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-construction.jpg" alt="Bolsa de Trabajo" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Bolsa de Trabajo</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Técnicos matriculados disponibles y búsquedas laborales publicadas por el Colegio.
          </p>
          <Link
            href="/bolsa-de-trabajo/registro"
            className="mt-6 inline-block rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Registrate como técnico
          </Link>
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

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-xl font-semibold text-ink-900">Búsquedas laborales</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {busquedas.map((b) => (
            <div key={b.id} className="rounded-xl border border-surface-border bg-white p-5">
              <p className="text-sm font-semibold text-ink-900">{b.titulo}</p>
              <p className="mt-0.5 text-xs font-semibold text-primary-700">{b.empresa}</p>
              <p className="mt-2 text-sm text-ink-600">{b.descripcion}</p>
              <p className="mt-3 text-xs text-ink-400">
                {b.localidad} · {MODALIDAD_LABEL[b.modalidad]}
                {b.especialidad && ` · ${b.especialidad.nombre}`}
              </p>
              <p className="mt-2 text-xs font-medium text-ink-600">Contacto: {b.contacto}</p>
              {b.fechaCierre && <p className="mt-1 text-xs text-ink-400">Cierra el {dateFormatter.format(b.fechaCierre)}</p>}
            </div>
          ))}
        </div>
        {busquedas.length === 0 && (
          <p className="mt-6 text-sm text-ink-400">No hay búsquedas laborales activas por el momento.</p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <h2 className="text-xl font-semibold text-ink-900">Técnicos disponibles</h2>
        <div className="mt-6">
          <BolsaTecnicosList tecnicos={tecnicos} especialidades={especialidades} />
        </div>
      </section>
    </div>
  );
}
