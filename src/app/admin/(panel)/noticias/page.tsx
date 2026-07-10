import { NoticiasList } from "@/components/admin/noticias-list";

export default function AdminNoticiasPage() {
  return <NoticiasList tipo="NOTICIA" basePath="/admin/noticias" titulo="Noticias" />;
}
