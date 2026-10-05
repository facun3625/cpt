import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNoticiaBySlug, getNoticiasRelacionadas } from "@/lib/site-info";
import { buildNoticiaMetadata } from "@/lib/noticia-metadata";
import { NoticiaDetalle } from "@/components/noticia-detalle";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia || noticia.tipo !== "NOTICIA") return { title: "Noticia | CPT Santa Fe" };
  return buildNoticiaMetadata(noticia, "/noticias");
}

export default async function NoticiaDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia || noticia.tipo !== "NOTICIA") notFound();

  const relacionadas = await getNoticiasRelacionadas("NOTICIA", noticia.id);

  return <NoticiaDetalle {...noticia} tipo="NOTICIA" relacionadas={relacionadas} basePath="/noticias" />;
}
