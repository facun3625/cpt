import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNoticiaBySlug } from "@/lib/site-info";
import { NoticiaDetalle } from "@/components/noticia-detalle";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  return { title: noticia ? `${noticia.titulo} | CPT Santa Fe` : "Capacitación | CPT Santa Fe" };
}

export default async function CapacitacionDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia || noticia.tipo !== "CAPACITACION") notFound();

  return <NoticiaDetalle {...noticia} />;
}
