"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { saveUploadedMarketingImage } from "@/lib/upload";
import { sendMail } from "@/lib/mailer";

const PATH = "/admin/marketing";
const CONCURRENCIA = 5;

function construirHtml(titulo: string, contenido: string, imagenUrl: string | null, siteUrl: string) {
  const parrafos = contenido
    .split("\n")
    .filter((linea) => linea.trim().length > 0)
    .map((linea) => `<p style="margin:0 0 14px;">${linea}</p>`)
    .join("");

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color:#14201d;">
      <h1 style="color:#04213f; font-size:22px; margin-bottom:16px;">${titulo}</h1>
      ${imagenUrl ? `<img src="${siteUrl}${imagenUrl}" alt="" style="max-width:100%; border-radius:8px; margin-bottom:16px;" />` : ""}
      <div style="font-size:15px; line-height:1.6;">${parrafos}</div>
      <hr style="margin-top:32px; border:none; border-top:1px solid #e3ebe9;" />
      <p style="font-size:12px; color:#7c8b87;">Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe</p>
    </div>
  `.trim();
}

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
  await verifyAdminSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const contenido = String(formData.get("contenido") ?? "").trim();
  const destinatarios = String(formData.get("destinatarios") ?? "").trim();
  const imagen = formData.get("imagen");

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

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const html = construirHtml(titulo, contenido, imagenUrl, siteUrl);

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

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
