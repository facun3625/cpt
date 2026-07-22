import { getAdminUsers, getActivityLog } from "@/lib/site-info";
import { verifyAdminSession } from "@/lib/admin-dal";
import { NuevoAdminForm } from "./nuevo-admin-form";
import { eliminarAdmin } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function UsuariosAdminPage() {
  const session = await verifyAdminSession();
  const [admins, actividad] = await Promise.all([getAdminUsers(), getActivityLog(50)]);

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Usuarios</h1>
      <p className="mt-1 text-sm text-ink-600">{admins.length} administradores con acceso al panel.</p>

      <div className="mt-6 space-y-3">
        {admins.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-white p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">
                {a.email} {a.id === session.adminId && <span className="font-normal text-ink-400">(vos)</span>}
              </p>
              <p className="mt-0.5 text-xs text-ink-400">Alta: {dateFormatter.format(a.createdAt)}</p>
            </div>
            {a.id !== session.adminId && admins.length > 1 && (
              <form action={eliminarAdmin.bind(null, a.id)}>
                <button
                  type="submit"
                  className="rounded-full border border-accent-500/30 px-4 py-1.5 text-xs font-semibold text-accent-600 transition-colors hover:border-accent-500 hover:bg-accent-500/5"
                >
                  Eliminar
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      <NuevoAdminForm />

      <h2 className="mt-10 text-sm font-semibold text-ink-900">Actividad reciente</h2>
      <div className="mt-4 space-y-2">
        {actividad.map((log) => (
          <div key={log.id} className="rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm">
            <span className="font-semibold text-ink-900">{log.adminEmail}</span>{" "}
            <span className="text-ink-600">{log.accion}</span>
            {log.detalle && <span className="text-ink-400"> — {log.detalle}</span>}
            <span className="ml-2 text-xs text-ink-400">{dateFormatter.format(log.createdAt)}</span>
          </div>
        ))}

        {actividad.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-center text-sm text-ink-500">
            Todavía no hay actividad registrada.
          </p>
        )}
      </div>
    </div>
  );
}
