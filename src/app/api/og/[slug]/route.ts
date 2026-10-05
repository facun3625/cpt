import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getNoticiaBySlug } from "@/lib/site-info";

const WIDTH = 1200;
const HEIGHT = 630;
const PUBLIC_DIR = path.join(process.cwd(), "public");

async function leerImagenPublica(url: string): Promise<Buffer | null> {
  if (!url.startsWith("/") || url.includes("..")) return null;
  try {
    return await readFile(path.join(PUBLIC_DIR, url));
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) return new Response("Not found", { status: 404 });

  const candidatas = [
    noticia?.imagenDestacada,
    ...(noticia?.bloques.filter((b) => b.tipo === "IMAGEN").map((b) => b.imagenUrl) ?? []),
  ].filter((u): u is string => Boolean(u));

  for (const url of candidatas) {
    const original = await leerImagenPublica(url);
    if (!original) continue;
    try {
      const jpeg = await sharp(original)
        .rotate()
        .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
      return new Response(new Uint8Array(jpeg), {
        headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
      });
    } catch {
      continue;
    }
  }

  // Sin imagen propia: logo del Colegio centrado sobre fondo blanco.
  const logo = await readFile(path.join(PUBLIC_DIR, "logo.png"));
  const logoRedimensionado = await sharp(logo)
    .resize(WIDTH - 240, HEIGHT - 240, { fit: "inside" })
    .toBuffer();
  const jpeg = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: "#ffffff" } })
    .composite([{ input: logoRedimensionado, gravity: "center" }])
    .jpeg({ quality: 85 })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
