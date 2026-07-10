"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";

const PATH = "/admin/aranceles";

export async function updateInfo(formData: FormData) {
  await verifyAdminSession();
  const vigenciaFecha = String(formData.get("vigenciaFecha") ?? "").trim();
  if (!vigenciaFecha) return;

  await prisma.arancelesInfo.upsert({
    where: { id: "aranceles" },
    update: { vigenciaFecha },
    create: { id: "aranceles", vigenciaFecha },
  });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function createGrupo(formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;

  const count = await prisma.arancelGrupo.count({ where: { esHonorarioMinimo: false } });
  await prisma.arancelGrupo.create({ data: { titulo, orden: count } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateGrupo(id: string, formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;

  await prisma.arancelGrupo.update({ where: { id }, data: { titulo } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteGrupo(id: string) {
  await verifyAdminSession();
  await prisma.arancelGrupo.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function createItem(grupoId: string, formData: FormData) {
  await verifyAdminSession();
  const label = String(formData.get("label") ?? "").trim();
  const valorRaw = String(formData.get("valor") ?? "").trim();
  const valor = Number(valorRaw);
  if (!label || !valorRaw || Number.isNaN(valor) || valor <= 0) return;

  const count = await prisma.arancelItem.count({ where: { grupoId } });
  await prisma.arancelItem.create({ data: { grupoId, label, valor, orden: count } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateItem(id: string, formData: FormData) {
  await verifyAdminSession();
  const label = String(formData.get("label") ?? "").trim();
  const valorRaw = String(formData.get("valor") ?? "").trim();
  const valor = Number(valorRaw);
  if (!label || !valorRaw || Number.isNaN(valor) || valor <= 0) return;

  await prisma.arancelItem.update({ where: { id }, data: { label, valor } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteItem(id: string) {
  await verifyAdminSession();
  await prisma.arancelItem.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
