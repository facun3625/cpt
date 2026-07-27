import { getCertificadoSolicitudes } from "@/lib/site-info";
import { CertificadosList } from "@/components/admin/certificados-list";

export default async function CertificadosAdminPage() {
  const solicitudes = await getCertificadoSolicitudes();
  const pendientes = solicitudes.filter((s) => s.estado === "PENDIENTE").length;

  return (
    <div className="px-8 py-8">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Certificados de matriculación</h1>
        <p className="mt-1 text-sm text-ink-600">
          {solicitudes.length} solicitudes — {pendientes} pendiente{pendientes === 1 ? "" : "s"} de revisión.
        </p>
      </div>

      <CertificadosList solicitudes={solicitudes} />
    </div>
  );
}
