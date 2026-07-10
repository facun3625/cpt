import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NoticiaForm } from "@/components/admin/noticia-form";

export default async function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noticia = await prisma.noticia.findUnique({
    where: { id },
    include: { galeria: { orderBy: { orden: "asc" } } },
  });
  if (!noticia) notFound();

  return <NoticiaForm tipo="NOTICIA" basePath="/admin/noticias" noticia={noticia} />;
}
