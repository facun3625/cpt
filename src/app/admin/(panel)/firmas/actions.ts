"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { saveUploadedSignature, deleteUploadedFile } from "@/lib/upload";

const PATH = "/admin/firmas";

export async function createFirma(formData: FormData) {
  await verifyAdminSession();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const file = formData.get("firma");
  if (!nombre || !titulo || !(file instanceof File) || file.size === 0) return;

  const firmaUrl = await saveUploadedSignature(file);
  if (!firmaUrl) return;
  const count = await prisma.firma.count();
  await prisma.firma.create({ data: { nombre, titulo, firmaUrl, orden: count } });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateFirma(id: string, formData: FormData) {
  await verifyAdminSession();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!nombre || !titulo) return;

  const data: { nombre: string; titulo: string; firmaUrl?: string } = {
    nombre,
    titulo,
  };

  const file = formData.get("firma");
  if (file instanceof File && file.size > 0) {
    const firmaUrl = await saveUploadedSignature(file);
    if (!firmaUrl) return;
    const existing = await prisma.firma.findUnique({ where: { id } });
    if (existing) await deleteUploadedFile(existing.firmaUrl);
    data.firmaUrl = firmaUrl;
  }

  await prisma.firma.update({ where: { id }, data });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteFirma(id: string) {
  await verifyAdminSession();
  const existing = await prisma.firma.findUnique({ where: { id } });
  if (existing) await deleteUploadedFile(existing.firmaUrl);

  await prisma.firma.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
