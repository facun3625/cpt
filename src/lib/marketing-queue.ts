import "server-only";
import { prisma } from "@/lib/prisma";
import { getMailTransporter } from "@/lib/mailer";
import { stripHtml } from "@/lib/sanitize-html";

// El servidor de correo permite ~500 mails por hora: mandamos lotes de 300 y dejamos
// margen para los mails transaccionales (certificados, credenciales, contacto).
export const TAMANO_LOTE = Number(process.env.MARKETING_LOTE_TAMANO) || 300;
export const INTERVALO_LOTE_MIN = Number(process.env.MARKETING_LOTE_INTERVALO_MIN) || 60;
const CONCURRENCIA = 5;
const REVISION_MS = 60_000;

const ERROR_DE_CUOTA = /quota|limit|too many|rate|exceed|throttl|try again later/i;

type Estado = { procesando: boolean; bloqueadoHasta: number; cronIniciado: boolean };
const globalState = globalThis as unknown as { __marketingQueue?: Estado };
const estado: Estado = (globalState.__marketingQueue ??= { procesando: false, bloqueadoHasta: 0, cronIniciado: false });

export async function ultimoEnvio(): Promise<Date | null> {
  const r = await prisma.emailEnvio.aggregate({ _max: { enviadoEn: true } });
  return r._max.enviadoEn;
}

export function proximoLoteDesde(ultimo: Date | null): Date {
  const base = ultimo ? ultimo.getTime() + INTERVALO_LOTE_MIN * 60_000 : Date.now();
  return new Date(Math.max(base, estado.bloqueadoHasta, Date.now()));
}

/** Envía, como máximo, un lote de TAMANO_LOTE mails si pasó el intervalo desde el lote anterior. */
export async function procesarCola(): Promise<void> {
  if (estado.procesando || Date.now() < estado.bloqueadoHasta) return;
  estado.procesando = true;
  try {
    const ultimo = await ultimoEnvio();
    if (ultimo && Date.now() - ultimo.getTime() < INTERVALO_LOTE_MIN * 60_000) return;

    const campania = await prisma.emailCampaign.findFirst({
      where: { estado: "EN_COLA" },
      orderBy: { enviadoEn: "asc" },
    });
    if (!campania) return;

    const pendientes = await prisma.emailEnvio.findMany({
      where: { campaignId: campania.id, estado: "PENDIENTE" },
      orderBy: { id: "asc" },
      take: TAMANO_LOTE,
    });
    if (pendientes.length === 0) {
      await prisma.emailCampaign.updateMany({ where: { id: campania.id, estado: "EN_COLA" }, data: { estado: "COMPLETADA" } });
      return;
    }

    const mail = await getMailTransporter();
    if (!mail) return; // SMTP sin configurar: se reintenta en la próxima revisión, sin marcar nada como fallido.

    const html = campania.html ?? "";
    const text = stripHtml(html);
    const cola = [...pendientes];
    let enviados = 0;
    let fallidos = 0;
    let cuotaExcedida = false;

    async function worker() {
      while (!cuotaExcedida) {
        const envio = cola.shift();
        if (!envio) return;
        try {
          await mail!.transporter.sendMail({ from: mail!.from, to: envio.email, subject: campania!.titulo, html, text });
          await prisma.emailEnvio.update({ where: { id: envio.id }, data: { estado: "ENVIADO", enviadoEn: new Date() } });
          enviados++;
        } catch (err) {
          const mensaje = err instanceof Error ? err.message : "Error desconocido";
          if (ERROR_DE_CUOTA.test(mensaje)) {
            // El servidor nos frenó por límite de envíos: dejamos este y el resto pendientes.
            cuotaExcedida = true;
            return;
          }
          await prisma.emailEnvio.update({
            where: { id: envio.id },
            data: { estado: "FALLIDO", error: mensaje.slice(0, 500), enviadoEn: new Date() },
          });
          fallidos++;
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(CONCURRENCIA, pendientes.length) }, () => worker()));

    await prisma.emailCampaign.update({
      where: { id: campania.id },
      data: { cantidadEnviados: { increment: enviados }, cantidadFallidos: { increment: fallidos } },
    });

    const quedan = await prisma.emailEnvio.count({ where: { campaignId: campania.id, estado: "PENDIENTE" } });
    if (quedan === 0) {
      await prisma.emailCampaign.updateMany({ where: { id: campania.id, estado: "EN_COLA" }, data: { estado: "COMPLETADA" } });
    }
    if (cuotaExcedida) estado.bloqueadoHasta = Date.now() + INTERVALO_LOTE_MIN * 60_000;
  } catch (err) {
    console.error("[marketing] error procesando la cola:", err);
  } finally {
    estado.procesando = false;
  }
}

/** Revisa la cola cada minuto mientras el servidor esté levantado (se llama desde instrumentation.ts). */
export function iniciarCronMarketing(): void {
  if (estado.cronIniciado) return;
  estado.cronIniciado = true;
  const timer = setInterval(() => void procesarCola(), REVISION_MS);
  timer.unref?.();
  setTimeout(() => void procesarCola(), 10_000).unref?.();
}
