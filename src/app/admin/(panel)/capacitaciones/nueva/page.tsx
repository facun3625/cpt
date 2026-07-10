import { NoticiaForm } from "@/components/admin/noticia-form";

export default function NuevaCapacitacionPage() {
  return <NoticiaForm tipo="CAPACITACION" basePath="/admin/capacitaciones" noticia={null} />;
}
