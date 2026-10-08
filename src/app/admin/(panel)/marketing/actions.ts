"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { saveUploadedMarketingImage } from "@/lib/upload";
import { construirEmailHtml } from "@/lib/email-template";
import { sanitizeNoticiaHtml, stripHtml } from "@/lib/sanitize-html";
import { procesarCola, TAMANO_LOTE, INTERVALO_LOTE_MIN } from "@/lib/marketing-queue";
import { getSedes, getContactEmails, getSiteSettings } from "@/lib/site-info";
import { logActivity } from "@/lib/activity-log";

const PATH = "/admin/marketing";

export async function subirImagenEmail(formData: FormData): Promise<string | null> {
  await verifyAdminSession();
  const imagen = formData.get("imagen");
  if (!(imagen instanceof File) || imagen.size === 0) return null;
  return saveUploadedMarketingImage(imagen);
}

export async function enviarCampania(formData: FormData) {
  const session = await verifyAdminSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const destinatarios = String(formData.get("destinatarios") ?? "").trim();
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const contenido = sanitizeNoticiaHtml(String(formData.get("contenido") ?? "").trim(), { email: { siteUrl } });

  const tieneContenido = stripHtml(contenido).length > 0 || contenido.includes("<img");
  if (!titulo || !tieneContenido || !["SUSCRIPTORES", "MATRICULADOS", "AMBOS"].includes(destinatarios)) {
    redirect(`${PATH}?error=datos`);
  }

  const [suscriptores, matriculados] = await Promise.all([
    destinatarios !== "MATRICULADOS" ? prisma.suscriptor.findMany({ select: { email: true } }) : Promise.resolve([]),
    destinatarios !== "SUSCRIPTORES"
      ? prisma.matriculadoHabilitado.findMany({ where: { email: { not: null } }, select: { email: true } })
      : Promise.resolve([]),
  ]);

  const emails = Array.from(
    new Set(
      [...suscriptores, ...matriculados]
        .map((r) => r.email?.trim().toLowerCase())
        .filter((e): e is string => Boolean(e)),
    ),
  );
  if (emails.length === 0) redirect(`${PATH}?error=sin-destinatarios`);

  const [sedes, contactEmails, siteSettings] = await Promise.all([getSedes(), getContactEmails(), getSiteSettings()]);

  const html = construirEmailHtml({
    titulo,
    contenido,
    siteUrl,
    footer: {
      direccion: sedes[0]?.direccion ?? null,
      telefono: sedes[0]?.telefono ?? null,
      email: contactEmails[0]?.value ?? null,
      instagramUrl: siteSettings.instagramUrl ?? null,
      facebookUrl: siteSettings.facebookUrl ?? null,
    },
  });

  // La campaña queda "en cola" y se envía en segundo plano de a TAMANO_LOTE por vez (ver marketing-queue).
  const campania = await prisma.emailCampaign.create({
    data: {
      titulo,
      contenido,
      html,
      destinatarios: destinatarios as "SUSCRIPTORES" | "MATRICULADOS" | "AMBOS",
      estado: "EN_COLA",
      total: emails.length,
    },
  });
  for (let i = 0; i < emails.length; i += 5000) {
    await prisma.emailEnvio.createMany({
      data: emails.slice(i, i + 5000).map((email) => ({ campaignId: campania.id, email })),
    });
  }

  await logActivity(
    session.email,
    "Programó una campaña de email",
    `"${titulo}" — ${emails.length} destinatarios, en lotes de ${TAMANO_LOTE} cada ${INTERVALO_LOTE_MIN} min`,
  );

  after(() => procesarCola());

  revalidatePath(PATH);
  redirect(`${PATH}?ok=1`);
}

export async function cancelarCampania(formData: FormData) {
  const session = await verifyAdminSession();
  const id = String(formData.get("id") ?? "");
  const campania = await prisma.emailCampaign.findUnique({ where: { id } });
  if (!campania || campania.estado !== "EN_COLA") redirect(PATH);

  await prisma.emailCampaign.update({ where: { id }, data: { estado: "CANCELADA" } });
  await logActivity(session.email, "Canceló una campaña de email", `"${campania.titulo}"`);

  revalidatePath(PATH);
  redirect(`${PATH}?cancelada=1`);
}
