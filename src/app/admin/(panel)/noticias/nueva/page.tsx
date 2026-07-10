import { NoticiaForm } from "@/components/admin/noticia-form";

export default function NuevaNoticiaPage() {
  return <NoticiaForm tipo="NOTICIA" basePath="/admin/noticias" noticia={null} />;
}
