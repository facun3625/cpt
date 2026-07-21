import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export async function getSedes() {
  return prisma.sede.findMany({ orderBy: { orden: "asc" } });
}

export async function getContactEmails() {
  return prisma.contactEmail.findMany({ orderBy: { orden: "asc" } });
}

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });
  return settings ?? { id: "settings", instagramUrl: null };
}

export async function getValorM2Entries() {
  return prisma.valorM2Entry.findMany({ orderBy: { vigenteDesde: "asc" } });
}

export async function getValorM2Status() {
  const entries = await getValorM2Entries();
  const now = new Date();

  let current: (typeof entries)[number] | null = null;
  let next: (typeof entries)[number] | null = null;

  for (const entry of entries) {
    if (entry.vigenteDesde <= now) {
      current = entry;
    } else {
      next = entry;
      break;
    }
  }

  const history = entries.filter((e) => e.id !== current?.id && e.vigenteDesde <= now).reverse();

  return { current, next, history };
}

export function getValorM2DisplayProps(status: Awaited<ReturnType<typeof getValorM2Status>>) {
  const { current, next } = status;
  if (!current) {
    return { valorVigente: 0, vigenteHasta: null, valorProximo: null, proximoDesde: null };
  }
  if (!next) {
    return { valorVigente: current.valor, vigenteHasta: null, valorProximo: null, proximoDesde: null };
  }
  const vigenteHasta = formatDate(new Date(next.vigenteDesde.getTime() - 86_400_000));
  const proximoDesde = formatDate(next.vigenteDesde);
  return { valorVigente: current.valor, vigenteHasta, valorProximo: next.valor, proximoDesde };
}

export async function getArancelesInfo() {
  const info = await prisma.arancelesInfo.findUnique({ where: { id: "aranceles" } });
  return info ?? { id: "aranceles", vigenciaFecha: "" };
}

export async function getArancelGrupos() {
  return prisma.arancelGrupo.findMany({
    orderBy: { orden: "asc" },
    include: { items: { orderBy: { orden: "asc" } } },
  });
}

export async function getNoticias(tipo: "NOTICIA" | "CAPACITACION") {
  return prisma.noticia.findMany({
    where: { tipo },
    orderBy: { publicadoEn: "desc" },
  });
}

export async function getNoticiaBySlug(slug: string) {
  return prisma.noticia.findUnique({
    where: { slug },
    include: { galeria: { orderBy: { orden: "asc" } } },
  });
}

export async function getSliderNoticias() {
  return prisma.noticia.findMany({
    where: { enSliderHome: true },
    orderBy: { publicadoEn: "desc" },
  });
}

export async function getRepositorioArchivos() {
  return prisma.repositorioArchivo.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getMatriculados() {
  return prisma.matriculadoHabilitado.findMany({ orderBy: [{ apellido: "asc" }, { nombre: "asc" }] });
}

export async function getMatriculadoByMatriculaYDocumento(numeroMatricula: string, numeroDocumento: string) {
  return prisma.matriculadoHabilitado.findFirst({ where: { numeroMatricula, numeroDocumento } });
}

export async function getMatriculadoByMatricula(numeroMatricula: string) {
  return prisma.matriculadoHabilitado.findFirst({ where: { numeroMatricula } });
}

export async function getMatriculadosUploadInfo() {
  return prisma.matriculadosUpload.findUnique({ where: { id: "matriculados" } });
}

export async function getFirmas() {
  return prisma.firma.findMany({ orderBy: { orden: "asc" } });
}

export async function getFirmasCertificado() {
  return prisma.firma.findMany({ where: { enCertificado: true }, orderBy: { orden: "asc" } });
}

export async function getFirmasCredencial() {
  return prisma.firma.findMany({ where: { enCredencial: true }, orderBy: { orden: "asc" } });
}

export async function getCertificadoSolicitudes() {
  return prisma.certificadoSolicitud.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getCertificadoSolicitudById(id: string) {
  return prisma.certificadoSolicitud.findUnique({ where: { id } });
}

export async function getCertificadoSolicitudByCodigo(codigoVerificacion: string) {
  return prisma.certificadoSolicitud.findUnique({ where: { codigoVerificacion } });
}

export async function getCredencialSolicitudes() {
  return prisma.credencialSolicitud.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getCredencialSolicitudById(id: string) {
  return prisma.credencialSolicitud.findUnique({ where: { id } });
}

export async function getCredencialSolicitudByCodigo(codigoVerificacion: string) {
  return prisma.credencialSolicitud.findUnique({ where: { codigoVerificacion } });
}

export async function getEspecialidades() {
  return prisma.especialidad.findMany({ orderBy: { orden: "asc" } });
}

export async function getTecnicosBolsa() {
  return prisma.tecnicoBolsa.findMany({
    include: { especialidad: true },
    orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
  });
}

export async function getTecnicosBolsaPublicos() {
  return prisma.tecnicoBolsa.findMany({
    where: { activo: true },
    include: { especialidad: true },
    orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
  });
}

export async function getTecnicoBolsaById(id: string) {
  return prisma.tecnicoBolsa.findUnique({ where: { id } });
}

export async function getBusquedasLaborales() {
  return prisma.busquedaLaboral.findMany({
    include: { especialidad: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBusquedasLaboralesActivas() {
  return prisma.busquedaLaboral.findMany({
    where: {
      estado: "ACTIVA",
      OR: [{ fechaCierre: null }, { fechaCierre: { gte: new Date() } }],
    },
    include: { especialidad: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBusquedaLaboralById(id: string) {
  return prisma.busquedaLaboral.findUnique({ where: { id } });
}

export async function getSmtpSettings() {
  const settings = await prisma.smtpSettings.findUnique({ where: { id: "smtp" } });
  return (
    settings ?? {
      id: "smtp",
      host: null,
      port: 587,
      secure: false,
      user: null,
      password: null,
      fromEmail: null,
      fromName: null,
      updatedAt: new Date(),
    }
  );
}

export async function getSuscriptores() {
  return prisma.suscriptor.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getEmailCampaigns() {
  return prisma.emailCampaign.findMany({ orderBy: { enviadoEn: "desc" } });
}

export async function getLinksInteres() {
  return prisma.linkInteres.findMany({ orderBy: { orden: "asc" } });
}
