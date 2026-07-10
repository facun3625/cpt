"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";

const PATH = "/admin/bolsa-de-trabajo/especialidades";

export async function createEspecialidad(formData: FormData) {
  await verifyAdminSession();
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return;

  const count = await prisma.especialidad.count();
  await prisma.especialidad.create({ data: { nombre, orden: count } });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateEspecialidad(id: string, formData: FormData) {
  await verifyAdminSession();
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return;

  await prisma.especialidad.update({ where: { id }, data: { nombre } });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteEspecialidad(id: string) {
  await verifyAdminSession();
  await prisma.especialidad.delete({ where: { id } }).catch(() => null);

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
