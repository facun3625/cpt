import "server-only";
import { prisma } from "@/lib/prisma";

export async function logActivity(adminEmail: string, accion: string, detalle?: string) {
  await prisma.activityLog.create({ data: { adminEmail, accion, detalle: detalle ?? null } });
}
