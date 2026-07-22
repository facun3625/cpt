"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { saveUploadedMarketingImage } from "@/lib/upload";
import { sendMail } from "@/lib/mailer";
import { construirEmailHtml } from "@/lib/email-template";
import { getSedes, getContactEmails, getSiteSettings } from "@/lib/site-info";
import { logActivity } from "@/lib/activity-log";

const PATH = "/admin/marketing";
const CONCURRENCIA = 5;

async function enviarATodos(emails: string[], subject: string, html: string, text: string) {
  const queue = [...emails];
  let enviados = 0;
  let fallidos = 0;

  async function worker() {
    while (queue.length > 0) {
      const email = queue.shift();
      if (!email) return;
      const result = await sendMail({ to: email, subject, html, text });
      if (result.ok) enviados++;
      else fallidos++;
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCIA, emails.length) }, () => worker()));
  return { enviados, fallidos };
}

export async function enviarCampania(formData: FormData) {
  const session = await verifyAdminSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const contenido = String(formData.get("contenido") ?? "").trim();
  const destinatarios = String(formData.get("destinatarios") ?? "").trim();
  const imagen = formData.get("imagen");
  const imagenPosicion = formData.get("imagenPosicion") === "despues" ? "despues" : "antes";

  if (!titulo || !contenido || !["SUSCRIPTORES", "MATRICULADOS", "AMBOS"].includes(destinatarios)) {
    return;
  }

  let imagenUrl: string | null = null;
  if (imagen instanceof File && imagen.size > 0) {
    imagenUrl = await saveUploadedMarketingImage(imagen);
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

  const [sedes, contactEmails, siteSettings] = await Promise.all([
    getSedes(),
    getContactEmails(),
    getSiteSettings(),
  ]);

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const html = construirEmailHtml({
    titulo,
    contenido,
    imagenUrl,
    imagenPosicion,
    siteUrl,
    footer: {
      direccion: sedes[0]?.direccion ?? null,
      telefono: sedes[0]?.telefono ?? null,
      email: contactEmails[0]?.value ?? null,
      instagramUrl: siteSettings.instagramUrl ?? null,
    },
  });

  const { enviados, fallidos } = await enviarATodos(emails, titulo, html, contenido);

  await prisma.emailCampaign.create({
    data: {
      titulo,
      contenido,
      imagenUrl,
      destinatarios: destinatarios as "SUSCRIPTORES" | "MATRICULADOS" | "AMBOS",
      cantidadEnviados: enviados,
      cantidadFallidos: fallidos,
    },
  });

  await logActivity(
    session.email,
    "Envió una campaña de email",
    `"${titulo}" — ${enviados} enviados${fallidos > 0 ? `, ${fallidos} fallidos` : ""}`,
  );

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
