"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { saveUploadedDocument, deleteUploadedFile } from "@/lib/upload";

const PATH = "/admin/repositorio";

export async function createArchivo(formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const file = formData.get("archivo");
  if (!titulo || !(file instanceof File) || file.size === 0) return;

  const saved = await saveUploadedDocument(file);
  if (!saved) return;

  await prisma.repositorioArchivo.create({
    data: { titulo, url: saved.url, extension: saved.extension, tamano: saved.tamano },
  });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateArchivo(id: string, formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;

  const data: { titulo: string; url?: string; extension?: string; tamano?: number } = { titulo };

  const file = formData.get("archivo");
  if (file instanceof File && file.size > 0) {
    const saved = await saveUploadedDocument(file);
    if (!saved) return;

    const existing = await prisma.repositorioArchivo.findUnique({ where: { id } });
    if (existing) await deleteUploadedFile(existing.url);

    data.url = saved.url;
    data.extension = saved.extension;
    data.tamano = saved.tamano;
  }

  await prisma.repositorioArchivo.update({ where: { id }, data });
  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}

export async function deleteArchivo(id: string) {
  await verifyAdminSession();
  const existing = await prisma.repositorioArchivo.findUnique({ where: { id } });
  if (existing) await deleteUploadedFile(existing.url);

  await prisma.repositorioArchivo.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
