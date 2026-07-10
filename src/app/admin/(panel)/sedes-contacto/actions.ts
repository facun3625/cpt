"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";

const PATH = "/admin/sedes-contacto";

async function canEnableHeader(excludeId?: string) {
  const count = await prisma.sede.count({
    where: { mostrarEnHeader: true, ...(excludeId ? { id: { not: excludeId } } : {}) },
  });
  return count < 2;
}

export async function createSede(formData: FormData) {
  await verifyAdminSession();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  if (!nombre || !direccion || !telefono) return;

  const wantsHeader = formData.get("mostrarEnHeader") === "on";
  const mostrarEnHeader = wantsHeader && (await canEnableHeader());

  const count = await prisma.sede.count();
  await prisma.sede.create({ data: { nombre, direccion, telefono, orden: count, mostrarEnHeader } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateSede(id: string, formData: FormData) {
  await verifyAdminSession();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  if (!nombre || !direccion || !telefono) return;

  const wantsHeader = formData.get("mostrarEnHeader") === "on";
  const mostrarEnHeader = wantsHeader && (await canEnableHeader(id));

  await prisma.sede.update({ where: { id }, data: { nombre, direccion, telefono, mostrarEnHeader } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteSede(id: string) {
  await verifyAdminSession();
  await prisma.sede.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function createEmail(formData: FormData) {
  await verifyAdminSession();
  const label = String(formData.get("label") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  if (!label || !value) return;

  const count = await prisma.contactEmail.count();
  await prisma.contactEmail.create({ data: { label, value, orden: count } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateEmail(id: string, formData: FormData) {
  await verifyAdminSession();
  const label = String(formData.get("label") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  if (!label || !value) return;

  await prisma.contactEmail.update({ where: { id }, data: { label, value } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteEmail(id: string) {
  await verifyAdminSession();
  await prisma.contactEmail.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateSettings(formData: FormData) {
  await verifyAdminSession();
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim();

  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: { instagramUrl: instagramUrl || null },
    create: { id: "settings", instagramUrl: instagramUrl || null },
  });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
