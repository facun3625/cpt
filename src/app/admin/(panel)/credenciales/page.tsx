import { getCredencialSolicitudes } from "@/lib/site-info";
import { CredencialesList } from "@/components/admin/credenciales-list";

export default async function CredencialesAdminPage() {
  const solicitudes = await getCredencialSolicitudes();
  const pendientes = solicitudes.filter((s) => s.estado === "PENDIENTE").length;

  return (
    <div className="px-8 py-8">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Credenciales digitales</h1>
        <p className="mt-1 text-sm text-ink-600">
          {solicitudes.length} solicitudes — {pendientes} pendiente{pendientes === 1 ? "" : "s"} de revisión.
        </p>
      </div>

      <CredencialesList solicitudes={solicitudes} />
    </div>
  );
}
