import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNoticiaBySlug, getNoticiasRelacionadas } from "@/lib/site-info";
import { buildNoticiaMetadata } from "@/lib/noticia-metadata";
import { NoticiaDetalle } from "@/components/noticia-detalle";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia || noticia.tipo !== "CAPACITACION") return { title: "Capacitación | CPT Santa Fe" };
  return buildNoticiaMetadata(noticia, "/de-interes/capacitaciones");
}

export default async function CapacitacionDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia || noticia.tipo !== "CAPACITACION") notFound();

  const relacionadas = await getNoticiasRelacionadas("CAPACITACION", noticia.id);

  return <NoticiaDetalle {...noticia} tipo="CAPACITACION" relacionadas={relacionadas} basePath="/de-interes/capacitaciones" />;
}
