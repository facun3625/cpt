import Link from "next/link";
import { getEmailCampaigns, getSuscriptores } from "@/lib/site-info";
import { prisma } from "@/lib/prisma";
import { enviarCampania } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const textareaClass = `${inputClass} resize-y`;
const fileInputClass =
  "mt-2 block text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const DESTINATARIOS_LABEL: Record<string, string> = {
  SUSCRIPTORES: "Suscriptores",
  MATRICULADOS: "Matriculados",
  AMBOS: "Suscriptores + Matriculados",
};

export default async function MarketingAdminPage() {
  const [campanias, suscriptores, matriculadosConEmail] = await Promise.all([
    getEmailCampaigns(),
    getSuscriptores(),
    prisma.matriculadoHabilitado.count({ where: { email: { not: null } } }),
  ]);

  return (
    <div className="max-w-3xl px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Email Marketing</h1>
          <p className="mt-1 text-sm text-ink-600">
            {suscriptores.length} suscriptores · {matriculadosConEmail} matriculados con email cargado.
          </p>
        </div>
        <Link
          href="/admin/marketing/suscriptores"
          className="rounded-full border border-surface-border px-5 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
        >
          Ver suscriptores
        </Link>
      </div>

      <form action={enviarCampania} className="mt-6 space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div>
          <label className="text-xs font-medium text-ink-500">Título / asunto</label>
          <input name="titulo" required className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Texto</label>
          <textarea name="contenido" required rows={6} className={textareaClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Imagen (opcional)</label>
          <input name="imagen" type="file" accept="image/jpeg,image/png" className={fileInputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Destinatarios</label>
          <select name="destinatarios" defaultValue="SUSCRIPTORES" className={inputClass}>
            <option value="SUSCRIPTORES">Suscriptores del newsletter ({suscriptores.length})</option>
            <option value="MATRICULADOS">Matriculados con email cargado ({matriculadosConEmail})</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>

        <p className="text-xs text-ink-400">
          El envío se hace en el momento y puede tardar unos minutos si la lista es grande — no cierres esta página
          hasta que redirija.
        </p>

        <button
          type="submit"
          className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
        >
          Enviar campaña
        </button>
      </form>

      <h2 className="mt-10 text-sm font-semibold text-ink-900">Historial de envíos</h2>
      <div className="mt-4 space-y-3">
        {campanias.map((c) => (
          <div key={c.id} className="rounded-xl border border-surface-border bg-white p-4">
            <p className="text-sm font-semibold text-ink-900">{c.titulo}</p>
            <p className="mt-1 text-xs text-ink-400">
              {DESTINATARIOS_LABEL[c.destinatarios]} · {dateFormatter.format(c.enviadoEn)} · {c.cantidadEnviados}{" "}
              enviados{c.cantidadFallidos > 0 && `, ${c.cantidadFallidos} fallidos`}
            </p>
          </div>
        ))}

        {campanias.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no se envió ninguna campaña.
          </p>
        )}
      </div>
    </div>
  );
}
