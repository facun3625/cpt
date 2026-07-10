"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { saveUploadedImage } from "@/lib/upload";
import { slugify } from "@/lib/slugify";
import type { NoticiaTipo } from "@/generated/prisma/client";

function sectionPath(tipo: NoticiaTipo) {
  return tipo === "NOTICIA" ? "/admin/noticias" : "/admin/capacitaciones";
}

async function uniqueSlug(base: string) {
  const slug = slugify(base) || "sin-titulo";
  const existing = await prisma.noticia.findUnique({ where: { slug } });
  if (!existing) return slug;
  return `${slug}-${Date.now().toString(36)}`;
}

export async function createNoticia(tipo: NoticiaTipo, formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;

  const pretexto = String(formData.get("pretexto") ?? "").trim() || null;
  const texto = String(formData.get("texto") ?? "").trim() || null;
  const video = String(formData.get("video") ?? "").trim() || null;
  const enSliderHome = formData.get("enSliderHome") === "on";

  const imagenFile = formData.get("imagenDestacada");
  let imagenDestacada: string | null = null;
  if (imagenFile instanceof File && imagenFile.size > 0) {
    imagenDestacada = await saveUploadedImage(imagenFile);
  }

  const slug = await uniqueSlug(titulo);

  const noticia = await prisma.noticia.create({
    data: { tipo, slug, titulo, pretexto, texto, video, enSliderHome, imagenDestacada },
  });

  revalidatePath("/", "layout");
  redirect(`${sectionPath(tipo)}/${noticia.id}?ok=1`);
}

export async function updateNoticia(id: string, tipo: NoticiaTipo, formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;

  const pretexto = String(formData.get("pretexto") ?? "").trim() || null;
  const texto = String(formData.get("texto") ?? "").trim() || null;
  const video = String(formData.get("video") ?? "").trim() || null;
  const enSliderHome = formData.get("enSliderHome") === "on";

  const imagenFile = formData.get("imagenDestacada");
  const data: Record<string, unknown> = { titulo, pretexto, texto, video, enSliderHome };
  if (imagenFile instanceof File && imagenFile.size > 0) {
    data.imagenDestacada = await saveUploadedImage(imagenFile);
  }

  await prisma.noticia.update({ where: { id }, data });

  revalidatePath("/", "layout");
  redirect(`${sectionPath(tipo)}/${id}?ok=1`);
}

export async function toggleEnSlider(id: string, tipo: NoticiaTipo, enSliderHome: boolean) {
  await verifyAdminSession();
  await prisma.noticia.update({ where: { id }, data: { enSliderHome: !enSliderHome } });
  revalidatePath("/", "layout");
  redirect(`${sectionPath(tipo)}?ok=1`);
}

export async function deleteNoticia(id: string, tipo: NoticiaTipo) {
  await verifyAdminSession();
  await prisma.noticia.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${sectionPath(tipo)}?ok=1`);
}

export async function addGaleriaImagen(noticiaId: string, tipo: NoticiaTipo, formData: FormData) {
  await verifyAdminSession();
  const file = formData.get("imagen");
  if (!(file instanceof File) || file.size === 0) return;

  const url = await saveUploadedImage(file);
  const count = await prisma.noticiaImagen.count({ where: { noticiaId } });
  await prisma.noticiaImagen.create({ data: { noticiaId, url, orden: count } });

  revalidatePath("/", "layout");
  redirect(`${sectionPath(tipo)}/${noticiaId}?ok=1`);
}

export async function deleteGaleriaImagen(imageId: string, noticiaId: string, tipo: NoticiaTipo) {
  await verifyAdminSession();
  await prisma.noticiaImagen.delete({ where: { id: imageId } });
  revalidatePath("/", "layout");
  redirect(`${sectionPath(tipo)}/${noticiaId}?ok=1`);
}
