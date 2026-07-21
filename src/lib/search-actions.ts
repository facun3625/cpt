"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  titulo: string;
  href: string;
  tipo: "NOTICIA" | "CAPACITACION";
  publicadoEnText: string;
  reciente: boolean;
};

const UN_ANIO_MS = 365 * 24 * 60 * 60 * 1000;

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export async function buscarContenido(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const noticias = await prisma.noticia.findMany({
    where: {
      OR: [
        { titulo: { contains: q, mode: "insensitive" } },
        { pretexto: { contains: q, mode: "insensitive" } },
        { texto: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { publicadoEn: "desc" },
    take: 8,
  });

  const now = Date.now();

  return noticias.map((n) => ({
    id: n.id,
    titulo: n.titulo,
    tipo: n.tipo,
    href: n.tipo === "NOTICIA" ? `/noticias/${n.slug}` : `/de-interes/capacitaciones/${n.slug}`,
    publicadoEnText: dateFormatter.format(n.publicadoEn),
    reciente: now - n.publicadoEn.getTime() <= UN_ANIO_MS,
  }));
}
