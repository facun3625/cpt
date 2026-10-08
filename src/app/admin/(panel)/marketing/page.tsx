import Link from "next/link";
import { getEmailCampaigns, getSuscriptores, getSedes, getContactEmails, getSiteSettings } from "@/lib/site-info";
import { prisma } from "@/lib/prisma";
import { ultimoEnvio, proximoLoteDesde, TAMANO_LOTE, INTERVALO_LOTE_MIN } from "@/lib/marketing-queue";
import { MarketingForm } from "./marketing-form";
import { AutoRefresh } from "./auto-refresh";
import { cancelarCampania } from "./actions";

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

const ESTADO_LABEL: Record<string, { texto: string; clase: string }> = {
  EN_COLA: { texto: "En envío", clase: "bg-amber-50 text-amber-700" },
  COMPLETADA: { texto: "Completada", clase: "bg-green-50 text-green-700" },
  CANCELADA: { texto: "Cancelada", clase: "bg-surface text-ink-500" },
};

const MENSAJES: Record<string, { texto: string; error?: boolean }> = {
  ok: { texto: "Campaña programada: se envía en segundo plano, de a lotes. Seguí el avance en el historial." },
  cancelada: { texto: "Campaña cancelada. Los mails ya enviados no se pueden deshacer." },
  "error-datos": { texto: "Completá el título y el texto del correo.", error: true },
  "error-sin-destinatarios": { texto: "No hay destinatarios con email para esa selección.", error: true },
};

export default async function MarketingAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; cancelada?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const mensaje = sp.error ? MENSAJES[`error-${sp.error}`] : sp.ok ? MENSAJES.ok : sp.cancelada ? MENSAJES.cancelada : null;
  const [campanias, suscriptores, matriculadosConEmail, sedes, contactEmails, siteSettings, ultimo] = await Promise.all([
    getEmailCampaigns(),
    getSuscriptores(),
    prisma.matriculadoHabilitado.count({ where: { email: { not: null } } }),
    getSedes(),
    getContactEmails(),
    getSiteSettings(),
    ultimoEnvio(),
  ]);
  const hayEnCola = campanias.some((c) => c.estado === "EN_COLA");
  const proximoLote = proximoLoteDesde(ultimo);

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  return (
    <div className="max-w-5xl px-8 py-8">
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

      {hayEnCola && <AutoRefresh />}
      {mensaje && (
        <p
          className={`mt-6 rounded-lg px-4 py-3 text-sm ${mensaje.error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
        >
          {mensaje.texto}
        </p>
      )}

      <MarketingForm
        tamanoLote={TAMANO_LOTE}
        intervaloMin={INTERVALO_LOTE_MIN}
        suscriptoresCount={suscriptores.length}
        matriculadosCount={matriculadosConEmail}
        siteUrl={siteUrl}
        footer={{
          direccion: sedes[0]?.direccion ?? null,
          telefono: sedes[0]?.telefono ?? null,
          email: contactEmails[0]?.value ?? null,
          instagramUrl: siteSettings.instagramUrl ?? null,
          facebookUrl: siteSettings.facebookUrl ?? null,
        }}
      />

      <h2 className="mt-10 text-sm font-semibold text-ink-900">Historial de envíos</h2>
      <div className="mt-4 space-y-3">
        {campanias.map((c) => {
          const hechos = c.cantidadEnviados + c.cantidadFallidos;
          const porcentaje = c.total > 0 ? Math.round((hechos / c.total) * 100) : 100;
          const estado = ESTADO_LABEL[c.estado];
          return (
            <div key={c.id} className="rounded-xl border border-surface-border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-sm font-semibold text-ink-900">{c.titulo}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${estado.clase}`}>{estado.texto}</span>
              </div>
              <p className="mt-1 text-xs text-ink-400">
                {DESTINATARIOS_LABEL[c.destinatarios]} · {dateFormatter.format(c.enviadoEn)} · {c.cantidadEnviados}
                {c.total > 0 && ` de ${c.total}`} enviados
                {c.cantidadFallidos > 0 && `, ${c.cantidadFallidos} fallidos`}
              </p>
              {c.estado === "EN_COLA" && (
                <>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${porcentaje}%` }} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-ink-500">
                      {porcentaje}% · próximo lote de hasta {TAMANO_LOTE}: {dateFormatter.format(proximoLote)}
                    </p>
                    <form action={cancelarCampania}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:text-red-800">
                        Cancelar envío
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {campanias.length === 0 && (
          <p className="rounded-xl border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-500">
            Todavía no se envió ninguna campaña.
          </p>
        )}
      </div>
    </div>
  );
}
