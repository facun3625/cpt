import { getSuscriptores } from "@/lib/site-info";
import { deleteSuscriptor } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function SuscriptoresAdminPage() {
  const suscriptores = await getSuscriptores();

  return (
    <div className="max-w-2xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Suscriptores del newsletter</h1>
      <p className="mt-1 text-sm text-ink-600">{suscriptores.length} suscriptores.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-surface-border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Suscripto el</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {suscriptores.map((s) => (
              <tr key={s.id} className="border-b border-surface-border last:border-0">
                <td className="px-4 py-2.5 text-ink-900">{s.email}</td>
                <td className="px-4 py-2.5 text-ink-500">{dateFormatter.format(s.createdAt)}</td>
                <td className="px-4 py-2.5 text-right">
                  <form action={deleteSuscriptor.bind(null, s.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-surface-border px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
                    >
                      Eliminar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {suscriptores.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-400">Todavía no hay suscriptores.</p>
        )}
      </div>

      <a href="/admin/marketing" className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
        ← Volver a Email Marketing
      </a>
    </div>
  );
}
