import Link from "next/link";
import { getEmailCampaigns, getSuscriptores, getSedes, getContactEmails, getSiteSettings } from "@/lib/site-info";
import { prisma } from "@/lib/prisma";
import { MarketingForm } from "./marketing-form";

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
  const [campanias, suscriptores, matriculadosConEmail, sedes, contactEmails, siteSettings] = await Promise.all([
    getEmailCampaigns(),
    getSuscriptores(),
    prisma.matriculadoHabilitado.count({ where: { email: { not: null } } }),
    getSedes(),
    getContactEmails(),
    getSiteSettings(),
  ]);

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

      <MarketingForm
        suscriptoresCount={suscriptores.length}
        matriculadosCount={matriculadosConEmail}
        siteUrl={siteUrl}
        footer={{
          direccion: sedes[0]?.direccion ?? null,
          telefono: sedes[0]?.telefono ?? null,
          email: contactEmails[0]?.value ?? null,
          instagramUrl: siteSettings.instagramUrl ?? null,
        }}
      />

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
