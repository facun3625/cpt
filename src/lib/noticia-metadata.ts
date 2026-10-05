import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

type NoticiaMeta = {
  slug: string;
  titulo: string;
  pretexto: string | null;
  publicadoEn: Date;
  bloques: { tipo: string; texto: string | null }[];
};

function textoPlano(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function descripcionNoticia(noticia: NoticiaMeta): string {
  const base =
    noticia.pretexto?.trim() ||
    textoPlano(noticia.bloques.find((b) => b.tipo === "TEXTO" && b.texto)?.texto ?? "") ||
    "Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe.";
  return base.length > 200 ? `${base.slice(0, 197).trimEnd()}...` : base;
}

export function noticiaUrl(basePath: string, slug: string): string {
  return `${getSiteUrl()}${basePath}/${slug}`;
}

export function buildNoticiaMetadata(noticia: NoticiaMeta, basePath: string): Metadata {
  const title = noticia.titulo;
  const description = descripcionNoticia(noticia);
  const url = noticiaUrl(basePath, noticia.slug);
  // Imagen 1200x630 generada en /api/og/[slug]: liviana (WhatsApp descarta imágenes pesadas) y siempre la de la noticia.
  const image = { url: `${getSiteUrl()}/api/og/${noticia.slug}`, width: 1200, height: 630, alt: title };

  return {
    title: `${title} | CPT Santa Fe`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "CPT Santa Fe",
      locale: "es_AR",
      publishedTime: noticia.publicadoEn.toISOString(),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
