import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RepositorioForm } from "@/components/admin/repositorio-form";

export default async function EditarArchivoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const archivo = await prisma.repositorioArchivo.findUnique({ where: { id } });
  if (!archivo) notFound();

  return <RepositorioForm archivo={archivo} />;
}
