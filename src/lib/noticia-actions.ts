"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { saveUploadedImage, saveUploadedDocument } from "@/lib/upload";
import { slugify } from "@/lib/slugify";
import { sanitizeNoticiaHtml, stripHtml } from "@/lib/sanitize-html";
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

type BloqueInput =
  | { tipo: "TEXTO"; texto: string }
  | { tipo: "IMAGEN"; file: File | null; existingUrl: string | null }
  | { tipo: "ARCHIVO"; file: File | null; existingUrl: string | null; nombre: string };

function parseBloques(formData: FormData): BloqueInput[] {
  const bloques: BloqueInput[] = [];
  let i = 0;
  while (formData.has(`bloque_${i}_tipo`)) {
    const tipo = formData.get(`bloque_${i}_tipo`);
    if (tipo === "TEXTO") {
      const texto = sanitizeNoticiaHtml(String(formData.get(`bloque_${i}_texto`) ?? "").trim());
      if (stripHtml(texto)) bloques.push({ tipo: "TEXTO", texto });
    } else if (tipo === "IMAGEN") {
      const file = formData.get(`bloque_${i}_imagen`);
      const existingUrl = String(formData.get(`bloque_${i}_imagenUrl`) ?? "").trim() || null;
      bloques.push({
        tipo: "IMAGEN",
        file: file instanceof File && file.size > 0 ? file : null,
        existingUrl,
      });
    } else if (tipo === "ARCHIVO") {
      const file = formData.get(`bloque_${i}_archivo`);
      const existingUrl = String(formData.get(`bloque_${i}_archivoUrl`) ?? "").trim() || null;
      const nombre = String(formData.get(`bloque_${i}_archivoNombre`) ?? "").trim();
      bloques.push({
        tipo: "ARCHIVO",
        file: file instanceof File && file.size > 0 ? file : null,
        existingUrl,
        nombre,
      });
    }
    i++;
  }
  return bloques;
}

async function guardarBloques(noticiaId: string, bloques: BloqueInput[]) {
  await prisma.noticiaBloque.deleteMany({ where: { noticiaId } });

  let orden = 0;
  for (const bloque of bloques) {
    if (bloque.tipo === "TEXTO") {
      await prisma.noticiaBloque.create({
        data: { noticiaId, tipo: "TEXTO", texto: bloque.texto, orden: orden++ },
      });
    } else if (bloque.tipo === "IMAGEN") {
      const imagenUrl = bloque.file ? await saveUploadedImage(bloque.file) : bloque.existingUrl;
      if (!imagenUrl) continue;
      await prisma.noticiaBloque.create({
        data: { noticiaId, tipo: "IMAGEN", imagenUrl, orden: orden++ },
      });
    } else {
      let archivoUrl = bloque.existingUrl;
      if (bloque.file) {
        const saved = await saveUploadedDocument(bloque.file);
        if (saved) archivoUrl = saved.url;
      }
      if (!archivoUrl) continue;
      await prisma.noticiaBloque.create({
        data: {
          noticiaId,
          tipo: "ARCHIVO",
          archivoUrl,
          archivoNombre: bloque.nombre || "Descargar documento",
          orden: orden++,
        },
      });
    }
  }
}

export async function createNoticia(tipo: NoticiaTipo, formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;

  const pretexto = String(formData.get("pretexto") ?? "").trim() || null;
  const video = String(formData.get("video") ?? "").trim() || null;
  const enSliderHome = formData.get("enSliderHome") === "on";
  const mostrarImagenDestacadaEnCuerpo = formData.get("mostrarImagenDestacadaEnCuerpo") === "on";
  const bloques = parseBloques(formData);

  const imagenFile = formData.get("imagenDestacada");
  let imagenDestacada: string | null = null;
  if (imagenFile instanceof File && imagenFile.size > 0) {
    imagenDestacada = await saveUploadedImage(imagenFile);
  }

  const slug = await uniqueSlug(titulo);
  const primerOrden = await prisma.noticia.aggregate({ where: { tipo }, _min: { orden: true } });
  const orden = (primerOrden._min.orden ?? 0) - 1;

  const noticia = await prisma.noticia.create({
    data: { tipo, slug, titulo, pretexto, video, enSliderHome, imagenDestacada, mostrarImagenDestacadaEnCuerpo, orden },
  });

  await guardarBloques(noticia.id, bloques);

  revalidatePath("/", "layout");
  redirect(`${sectionPath(tipo)}/${noticia.id}?ok=1`);
}

export async function updateNoticia(id: string, tipo: NoticiaTipo, formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;

  const pretexto = String(formData.get("pretexto") ?? "").trim() || null;
  const video = String(formData.get("video") ?? "").trim() || null;
  const enSliderHome = formData.get("enSliderHome") === "on";
  const mostrarImagenDestacadaEnCuerpo = formData.get("mostrarImagenDestacadaEnCuerpo") === "on";
  const bloques = parseBloques(formData);

  const imagenFile = formData.get("imagenDestacada");
  const data: Record<string, unknown> = { titulo, pretexto, video, enSliderHome, mostrarImagenDestacadaEnCuerpo };
  if (imagenFile instanceof File && imagenFile.size > 0) {
    data.imagenDestacada = await saveUploadedImage(imagenFile);
  }

  await prisma.noticia.update({ where: { id }, data });
  await guardarBloques(id, bloques);

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

export async function moverNoticia(id: string, tipo: NoticiaTipo, direccion: "arriba" | "abajo") {
  await verifyAdminSession();

  const noticias = await prisma.noticia.findMany({
    where: { tipo },
    orderBy: [{ orden: "asc" }, { publicadoEn: "desc" }],
    select: { id: true, orden: true },
  });

  const index = noticias.findIndex((n) => n.id === id);
  const swapIndex = direccion === "arriba" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= noticias.length) return;

  const actual = noticias[index];
  const vecino = noticias[swapIndex];

  await prisma.$transaction([
    prisma.noticia.update({ where: { id: actual.id }, data: { orden: vecino.orden } }),
    prisma.noticia.update({ where: { id: vecino.id }, data: { orden: actual.orden } }),
  ]);

  revalidatePath("/", "layout");
  redirect(`${sectionPath(tipo)}?ok=1`);
}
