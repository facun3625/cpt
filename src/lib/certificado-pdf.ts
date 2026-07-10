import "server-only";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";
import { readFile } from "fs/promises";

export type CertificadoPdfData = {
  nombre: string;
  apellido: string;
  numeroDocumento: string;
  numeroMatricula: string;
  fechaMatriculacion: Date | null;
  tituloProfesional: string | null;
  domicilio: string | null;
  lugarPresentacion: string;
  notasAdicionales: string | null;
  codigoVerificacion: string;
  verificationUrl: string;
  firmas: { nombre: string; titulo: string; firmaUrl: string }[];
  sede: { direccion: string; telefono: string } | null;
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const ESPECIALES: Record<number, string> = {
  10: "diez", 11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince",
  16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve", 20: "veinte",
  21: "veintiuno", 22: "veintidós", 23: "veintitrés", 24: "veinticuatro", 25: "veinticinco",
  26: "veintiséis", 27: "veintisiete", 28: "veintiocho", 29: "veintinueve",
};
const DECENAS = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

function numeroATexto(n: number): string {
  if (n === 0) return "cero";
  if (n === 100) return "cien";
  if (n < 10) return UNIDADES[n];
  if (ESPECIALES[n]) return ESPECIALES[n];
  if (n < 100) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? DECENAS[d] : `${DECENAS[d]} y ${UNIDADES[u]}`;
  }
  if (n < 1000) {
    const c = Math.floor(n / 100);
    const resto = n % 100;
    return resto === 0 ? CENTENAS[c] : `${CENTENAS[c]} ${numeroATexto(resto)}`;
  }
  const miles = Math.floor(n / 1000);
  const resto = n % 1000;
  const milesTexto = miles === 1 ? "mil" : `${numeroATexto(miles)} mil`;
  return resto === 0 ? milesTexto : `${milesTexto} ${numeroATexto(resto)}`;
}

function fechaEnPalabras(date: Date): string {
  const dia = date.getUTCDate();
  const mes = MESES[date.getUTCMonth()];
  const anio = date.getUTCFullYear();
  if (dia === 1) return `al primer día del mes de ${mes} del año ${numeroATexto(anio)}`;
  return `a los ${numeroATexto(dia)} días del mes de ${mes} del año ${numeroATexto(anio)}`;
}

async function readPublicFile(publicUrl: string): Promise<Buffer | null> {
  try {
    return await readFile(path.join(process.cwd(), "public", publicUrl));
  } catch {
    return null;
  }
}

export async function generateCertificadoPdf(data: CertificadoPdfData): Promise<Buffer> {
  const [qrBuffer, logoBuffer, firmaBuffers] = await Promise.all([
    QRCode.toBuffer(data.verificationUrl, { width: 130, margin: 1 }),
    readPublicFile("/logo.png"),
    Promise.all(data.firmas.map((f) => readPublicFile(f.firmaUrl))),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = 483; // A4 width (595) menos 2*56 de margen

    if (logoBuffer) {
      doc.image(logoBuffer, 56 + pageWidth / 2 - 24, 40, { width: 48 });
    }
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#14201d")
      .text(
        "COLEGIO PROFESIONAL DE MAESTROS MAYORES DE OBRAS Y TÉCNICOS DE LA PROVINCIA DE SANTA FE - DISTRITO I",
        56,
        96,
        { align: "center", width: pageWidth },
      );
    doc.fontSize(10).font("Helvetica").fillColor("#4b5a56").text("(LEY 10.946)", { align: "center", width: pageWidth });

    const direccionLinea = data.sede
      ? `${data.sede.direccion} · Tel: ${data.sede.telefono} · www.cptsantafe.org`
      : "www.cptsantafe.org";
    doc.moveDown(0.6);
    doc.fontSize(8.5).fillColor("#7c8b87").text(direccionLinea, { align: "center", width: pageWidth });

    doc.moveDown(0.8);
    const lineY1 = doc.y;
    doc.moveTo(56, lineY1).lineTo(56 + pageWidth, lineY1).strokeColor("#c7d0ce").lineWidth(1).stroke();

    doc.moveDown(1);
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#14201d")
      .text("CERTIFICADO", { align: "center", width: pageWidth, underline: true });

    doc.moveDown(1.5);

    const nombreCompleto = `${data.apellido.toUpperCase()}, ${data.nombre}`;
    const tituloTexto = data.tituloProfesional ? `${data.tituloProfesional} ` : "";
    const domicilioTexto = data.domicilio ? `, fijando su domicilio legal en ${data.domicilio}` : "";
    const fechaMatriculacionTexto = data.fechaMatriculacion
      ? ` desde el ${dateFormatter.format(data.fechaMatriculacion)}`
      : "";

    doc
      .fontSize(11.5)
      .font("Helvetica")
      .fillColor("#14201d")
      .text(
        `Certificamos que el/la ${tituloTexto}${nombreCompleto}, D.N.I. N° ${data.numeroDocumento}, se ha matriculado ` +
          `en este Colegio Profesional de Maestros Mayores de Obras y Técnicos de la Provincia de Santa Fe - Distrito I ` +
          `bajo el N° ${data.numeroMatricula}${domicilioTexto}, en cumplimiento de lo dispuesto en la Ley N° 10.946, ` +
          `quedando por lo tanto habilitado/a para ejercer su profesión dentro del territorio de esta Provincia` +
          `${fechaMatriculacionTexto}, manteniendo tal condición mientras cumplimente con las obligaciones establecidas ` +
          `por este Colegio.`,
        { align: "justify", width: pageWidth, lineGap: 3 },
      );

    if (data.notasAdicionales) {
      doc.moveDown(1);
      doc.fontSize(11.5).text(data.notasAdicionales, { align: "justify", width: pageWidth, lineGap: 3 });
    }

    doc.moveDown(1.2);
    doc
      .fontSize(11.5)
      .fillColor("#14201d")
      .text(
        `A pedido del interesado y para ser presentado ante ${data.lugarPresentacion}, se extiende el presente ` +
          `${fechaEnPalabras(new Date())}.`,
        { align: "justify", width: pageWidth, lineGap: 3 },
      );

    // Firmas
    const firmasY = 640;
    if (data.firmas.length > 0) {
      const colWidth = pageWidth / data.firmas.length;
      data.firmas.forEach((firma, i) => {
        const x = 56 + i * colWidth;
        const buffer = firmaBuffers[i];
        if (buffer) {
          doc.image(buffer, x + colWidth / 2 - 45, firmasY, { width: 90, height: 45, fit: [90, 45] });
        }
        doc
          .moveTo(x + colWidth / 2 - 60, firmasY + 50)
          .lineTo(x + colWidth / 2 + 60, firmasY + 50)
          .strokeColor("#c7d0ce")
          .stroke();
        doc
          .fontSize(9)
          .font("Helvetica-Bold")
          .fillColor("#14201d")
          .text(firma.nombre, x, firmasY + 55, { width: colWidth, align: "center" });
        doc.fontSize(8).font("Helvetica").fillColor("#7c8b87").text(firma.titulo, x, firmasY + 68, {
          width: colWidth,
          align: "center",
        });
      });
    }

    // QR + verificación
    const footerY = 730;
    doc.image(qrBuffer, 56, footerY, { width: 70 });
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#7c8b87")
      .text(`Código de verificación: ${data.codigoVerificacion}`, 140, footerY + 10, { width: 399 });
    doc.text(`Verificá la autenticidad de este certificado en:`, 140, footerY + 24, { width: 399 });
    doc.fillColor("#003a72").text(data.verificationUrl, 140, footerY + 36, { width: 399 });

    doc.end();
  });
}
