import type { Metadata } from "next";
import { getCertificadoSolicitudByCodigo } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Verificación de certificado | CPT Santa Fe",
  description: "Verificá la autenticidad de un certificado de matriculación emitido por el CPT Santa Fe.",
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export default async function VerificarCertificadoPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const solicitud = await getCertificadoSolicitudByCodigo(codigo);
  const valido = solicitud?.estado === "APROBADO";

  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }} className="bg-surface">
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-2xl border border-surface-border bg-white p-8 text-center shadow-sm">
          {valido && solicitud ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="mt-4 text-xl font-semibold text-ink-900">Certificado válido</h1>
              <p className="mt-1 text-sm text-ink-600">
                Este certificado fue emitido por el Colegio Profesional de Maestros Mayores de Obras y Técnicos de
                Santa Fe.
              </p>

              <dl className="mt-6 space-y-3 rounded-xl bg-surface p-5 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Nombre</dt>
                  <dd className="font-semibold text-ink-900">
                    {solicitud.nombre} {solicitud.apellido}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Matrícula</dt>
                  <dd className="font-semibold text-primary-700">{solicitud.numeroMatricula}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Estado</dt>
                  <dd className="font-semibold text-emerald-700">HABILITADO</dd>
                </div>
                {solicitud.revisadoEn && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Fecha de emisión</dt>
                    <dd className="font-semibold text-ink-900">{dateFormatter.format(solicitud.revisadoEn)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Identificador único</dt>
                  <dd className="font-mono text-xs font-semibold text-ink-700">{solicitud.codigoVerificacion}</dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/10 text-accent-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M6 18 18 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="mt-4 text-xl font-semibold text-ink-900">Certificado no válido</h1>
              <p className="mt-2 text-sm text-ink-600">
                No encontramos un certificado emitido con este identificador. Si creés que esto es un error,
                contactate con la secretaría del Colegio.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
