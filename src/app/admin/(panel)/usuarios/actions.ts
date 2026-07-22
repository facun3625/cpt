"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { logActivity } from "@/lib/activity-log";

const PATH = "/admin/usuarios";

export type CrearAdminState = { error?: string } | undefined;

export async function crearAdmin(_prevState: CrearAdminState, formData: FormData): Promise<CrearAdminState> {
  const session = await verifyAdminSession();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const existente = await prisma.adminUser.findUnique({ where: { email } });
  if (existente) {
    return { error: "Ya existe un usuario con ese email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({ data: { email, passwordHash } });

  await logActivity(session.email, "Creó un usuario administrador", email);

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function eliminarAdmin(id: string) {
  const session = await verifyAdminSession();

  const objetivo = await prisma.adminUser.findUnique({ where: { id } });
  if (!objetivo) return;

  if (objetivo.id === session.adminId) return;

  const total = await prisma.adminUser.count();
  if (total <= 1) return;

  await prisma.adminUser.delete({ where: { id } });
  await logActivity(session.email, "Eliminó un usuario administrador", objetivo.email);

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
