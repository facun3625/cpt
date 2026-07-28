import { redirect, notFound } from "next/navigation";
import { getEscalaHonorariosArchivo } from "@/lib/site-info";

export default async function EscalaHonorariosRedirect() {
  const archivo = await getEscalaHonorariosArchivo();
  if (!archivo) notFound();

  redirect(archivo.url);
}
