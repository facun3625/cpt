import "server-only";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const NOTICIAS_DIR = path.join(process.cwd(), "public", "uploads", "noticias");
const REPOSITORIO_DIR = path.join(process.cwd(), "public", "uploads", "repositorio");
const FIRMAS_DIR = path.join(process.cwd(), "public", "uploads", "firmas");
const CERTIFICADOS_DIR = path.join(process.cwd(), "public", "uploads", "certificados");
const CREDENCIALES_FOTOS_DIR = path.join(process.cwd(), "public", "uploads", "credenciales-fotos");
const CREDENCIALES_DIR = path.join(process.cwd(), "public", "uploads", "credenciales");
const MARKETING_DIR = path.join(process.cwd(), "public", "uploads", "marketing");
const ALLOWED_DOCUMENT_EXTENSIONS = ["pdf", "zip"];
// pdfkit sólo soporta JPEG y PNG al incrustar imágenes en el PDF de la credencial
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"];

export async function saveUploadedImage(file: File): Promise<string> {
  await mkdir(NOTICIAS_DIR, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(NOTICIAS_DIR, filename), buffer);
  return `/uploads/noticias/${filename}`;
}

export async function saveUploadedDocument(
  file: File,
): Promise<{ url: string; extension: string; tamano: number } | null> {
  const extension = path.extname(file.name).slice(1).toLowerCase();
  if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) return null;

  await mkdir(REPOSITORIO_DIR, { recursive: true });

  const filename = `${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(REPOSITORIO_DIR, filename), buffer);
  return { url: `/uploads/repositorio/${filename}`, extension, tamano: file.size };
}

export async function saveUploadedSignature(file: File): Promise<string> {
  await mkdir(FIRMAS_DIR, { recursive: true });

  const ext = path.extname(file.name) || ".png";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(FIRMAS_DIR, filename), buffer);
  return `/uploads/firmas/${filename}`;
}

export async function saveCertificadoPdf(buffer: Buffer, filename: string): Promise<string> {
  await mkdir(CERTIFICADOS_DIR, { recursive: true });
  await writeFile(path.join(CERTIFICADOS_DIR, filename), buffer);
  return `/uploads/certificados/${filename}`;
}

export async function saveUploadedFoto(file: File): Promise<string | null> {
  const extension = path.extname(file.name).slice(1).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) return null;

  await mkdir(CREDENCIALES_FOTOS_DIR, { recursive: true });

  const filename = `${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(CREDENCIALES_FOTOS_DIR, filename), buffer);
  return `/uploads/credenciales-fotos/${filename}`;
}

export async function saveCredencialPdf(buffer: Buffer, filename: string): Promise<string> {
  await mkdir(CREDENCIALES_DIR, { recursive: true });
  await writeFile(path.join(CREDENCIALES_DIR, filename), buffer);
  return `/uploads/credenciales/${filename}`;
}

export async function saveUploadedMarketingImage(file: File): Promise<string | null> {
  const extension = path.extname(file.name).slice(1).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) return null;

  await mkdir(MARKETING_DIR, { recursive: true });

  const filename = `${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(MARKETING_DIR, filename), buffer);
  return `/uploads/marketing/${filename}`;
}

export async function deleteUploadedFile(publicUrl: string) {
  try {
    await unlink(path.join(process.cwd(), "public", publicUrl));
  } catch {
    // file already missing on disk, nothing to do
  }
}
