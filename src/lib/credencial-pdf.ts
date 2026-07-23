import "server-only";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";
import { readFile } from "fs/promises";

export type CredencialPdfData = {
  nombre: string;
  apellido: string;
  numeroDocumento: string;
  numeroMatricula: string;
  tituloProfesional: string | null;
  fechaMatriculacion: Date | null;
  fotoUrl: string;
  codigoVerificacion: string;
  verificationUrl: string;
  firmas: { nombre: string; titulo: string; firmaUrl: string }[];
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

function formatearDni(dni: string): string {
  return dni.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function readPublicFile(publicUrl: string): Promise<Buffer | null> {
  try {
    return await readFile(path.join(process.cwd(), "public", publicUrl));
  } catch {
    return null;
  }
}

// Carnet apaisado, proporción tarjeta de crédito (85.6mm x 54mm) escalada para legibilidad.
const CARD_WIDTH = 400;
const FRONT_HEIGHT = 252;

const INSTITUTION_NAME =
  "COLEGIO PROFESIONAL DE MAESTROS MAYORES DE OBRAS Y TÉCNICOS DE LA ARQUITECTURA, INDUSTRIA E INGENIERÍA DE LA PROVINCIA DE SANTA FE";
const HEADER_NAME_FONT_SIZE = 8;
const HEADER_NAME_X = 72;

const QR_BLOCK_HEIGHT = 104;
const FIRMA_ROW_HEIGHT = 50;
const FOOTER_HEIGHT = 40;

function measureHeaderHeight(doc: PDFKit.PDFDocument): number {
  const nameWidth = CARD_WIDTH - HEADER_NAME_X - 14;
  doc.fontSize(HEADER_NAME_FONT_SIZE).font("Helvetica-Bold");
  const nameHeight = doc.heightOfString(INSTITUTION_NAME, { width: nameWidth });
  return 12 + nameHeight + 4 + 10 + 10; // padding superior + nombre + gap + subtítulo + padding inferior
}

function drawHeader(doc: PDFKit.PDFDocument, logoBuffer: Buffer | null, subtitulo: string, headerHeight: number) {
  const nameWidth = CARD_WIDTH - HEADER_NAME_X - 14;

  doc.rect(0, 0, CARD_WIDTH, headerHeight).fill("#04213f");
  if (logoBuffer) {
    doc.image(logoBuffer, 12, 8, { width: 46 });
  }

  doc.fontSize(HEADER_NAME_FONT_SIZE).font("Helvetica-Bold").fillColor("#ffffff");
  const nameHeight = doc.heightOfString(INSTITUTION_NAME, { width: nameWidth });
  doc.text(INSTITUTION_NAME, HEADER_NAME_X, 12, { width: nameWidth });

  doc
    .fontSize(7.5)
    .font("Helvetica")
    .fillColor("#cfe0f2")
    .text(subtitulo, HEADER_NAME_X, 12 + nameHeight + 4, { width: nameWidth });
}

export async function generateCredencialPdf(data: CredencialPdfData): Promise<Buffer> {
  const [qrBuffer, logoBuffer, fotoBuffer, firmaBuffers] = await Promise.all([
    QRCode.toBuffer(data.verificationUrl, { width: 120, margin: 1 }),
    readPublicFile("/logo.png"),
    readPublicFile(data.fotoUrl),
    Promise.all(data.firmas.map((f) => readPublicFile(f.firmaUrl))),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [CARD_WIDTH, FRONT_HEIGHT], margin: 0 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const headerHeight = measureHeaderHeight(doc);

    drawFrente(doc, data, logoBuffer, fotoBuffer, headerHeight);

    const dorsoHeight = headerHeight + 14 + QR_BLOCK_HEIGHT + FIRMA_ROW_HEIGHT + FOOTER_HEIGHT;
    doc.addPage({ size: [CARD_WIDTH, dorsoHeight], margin: 0 });
    drawDorso(doc, data, logoBuffer, qrBuffer, firmaBuffers, headerHeight, dorsoHeight);

    doc.end();
  });
}

function drawFrente(
  doc: PDFKit.PDFDocument,
  data: CredencialPdfData,
  logoBuffer: Buffer | null,
  fotoBuffer: Buffer | null,
  headerHeight: number,
) {
  drawHeader(doc, logoBuffer, "Credencial Digital de Matriculado", headerHeight);

  const contentY = headerHeight + 14;

  // Foto
  const photoSize = 90;
  const photoX = 24;
  if (fotoBuffer) {
    doc.image(fotoBuffer, photoX, contentY, { width: photoSize, height: photoSize, fit: [photoSize, photoSize] });
  }
  doc.lineWidth(2).strokeColor("#04213f").rect(photoX, contentY, photoSize, photoSize).stroke();

  // Datos
  const infoX = photoX + photoSize + 20;
  const infoWidth = CARD_WIDTH - infoX - 24;

  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#14201d")
    .text(`${data.apellido.toUpperCase()}, ${data.nombre}`, infoX, contentY, { width: infoWidth });

  let y = contentY + 22;
  if (data.tituloProfesional) {
    doc.fontSize(10).font("Helvetica").fillColor("#4b5a56").text(data.tituloProfesional, infoX, y, { width: infoWidth });
    y += 16;
  }

  doc
    .moveTo(infoX, y + 4)
    .lineTo(CARD_WIDTH - 24, y + 4)
    .strokeColor("#e3ebe9")
    .lineWidth(1)
    .stroke();
  y += 14;

  const colWidth = infoWidth / 2 - 6;
  const rightX = infoX + infoWidth / 2 + 6;

  doc.fontSize(8.5).font("Helvetica").fillColor("#7c8b87").text("N° DE MATRÍCULA", infoX, y, { width: colWidth });
  doc
    .fontSize(15)
    .font("Helvetica-Bold")
    .fillColor("#003a72")
    .text(data.numeroMatricula, infoX, y + 11, { width: colWidth });

  doc.fontSize(8.5).font("Helvetica").fillColor("#7c8b87").text("D.N.I.", rightX, y, { width: colWidth });
  doc
    .fontSize(15)
    .font("Helvetica-Bold")
    .fillColor("#003a72")
    .text(formatearDni(data.numeroDocumento), rightX, y + 11, { width: colWidth });

  y += 34;

  doc.fontSize(8.5).font("Helvetica").fillColor("#7c8b87").text("ESTADO", infoX, y, { width: colWidth });
  doc.fontSize(13).font("Helvetica-Bold").fillColor("#0a7a4c").text("HABILITADO", infoX, y + 12, { width: colWidth });

  if (data.fechaMatriculacion) {
    doc.fontSize(8.5).font("Helvetica").fillColor("#7c8b87").text("FECHA DE INSCRIPCIÓN", rightX, y, { width: colWidth });
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#14201d")
      .text(dateFormatter.format(data.fechaMatriculacion), rightX, y + 12, { width: colWidth });
  }

  const footerDividerY = FRONT_HEIGHT - 28;
  const footerTextY = FRONT_HEIGHT - 20;
  doc
    .moveTo(24, footerDividerY)
    .lineTo(CARD_WIDTH - 24, footerDividerY)
    .strokeColor("#e3ebe9")
    .lineWidth(1)
    .stroke();
  doc
    .fontSize(7.5)
    .font("Helvetica")
    .fillColor("#7c8b87")
    .text("Credencial digital de matriculado — CPT Santa Fe", 24, footerTextY, { width: CARD_WIDTH - 48, align: "center" });
}

function drawDorso(
  doc: PDFKit.PDFDocument,
  data: CredencialPdfData,
  logoBuffer: Buffer | null,
  qrBuffer: Buffer,
  firmaBuffers: (Buffer | null)[],
  headerHeight: number,
  pageHeight: number,
) {
  drawHeader(doc, logoBuffer, "Verificación de autenticidad", headerHeight);

  const contentY = headerHeight + 14;

  // QR
  const qrSize = 84;
  const qrX = 24;
  doc.image(qrBuffer, qrX, contentY, { width: qrSize });

  // Datos de verificación
  const infoX = qrX + qrSize + 20;
  const infoWidth = CARD_WIDTH - infoX - 24;

  doc.fontSize(8.5).font("Helvetica").fillColor("#7c8b87").text("CÓDIGO DE VERIFICACIÓN", infoX, contentY);
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor("#003a72")
    .text(data.codigoVerificacion, infoX, contentY + 12, { width: infoWidth });

  doc.fontSize(8.5).font("Helvetica").fillColor("#7c8b87").text("FECHA DE EMISIÓN", infoX, contentY + 38);
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor("#14201d")
    .text(dateFormatter.format(new Date()), infoX, contentY + 50);

  doc
    .fontSize(7.5)
    .font("Helvetica")
    .fillColor("#4b5a56")
    .text("Escaneá el código QR para verificar la autenticidad de esta credencial.", infoX, contentY + 74, {
      width: infoWidth,
    });

  // Firmas: institucional(es) marcadas para credencial + espacio en blanco para el matriculado
  const firmasY = contentY + QR_BLOCK_HEIGHT;
  const columnas: { nombre: string; titulo: string; buffer: Buffer | null }[] = data.firmas.map((f, i) => ({
    nombre: f.nombre,
    titulo: f.titulo,
    buffer: firmaBuffers[i],
  }));

  const totalColumnas = columnas.length + 1;
  const colWidth = (CARD_WIDTH - 48) / totalColumnas;

  columnas.forEach((firma, i) => {
    const x = 24 + i * colWidth;
    const imgW = Math.min(56, colWidth - 12);
    if (firma.buffer) {
      doc.image(firma.buffer, x + colWidth / 2 - imgW / 2, firmasY, { width: imgW, height: imgW * 0.5, fit: [imgW, imgW * 0.5] });
    }
    doc
      .moveTo(x + colWidth / 2 - 30, firmasY + 26)
      .lineTo(x + colWidth / 2 + 30, firmasY + 26)
      .strokeColor("#c7d0ce")
      .lineWidth(1)
      .stroke();
    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#14201d").text(firma.nombre, x, firmasY + 29, {
      width: colWidth,
      align: "center",
    });
    doc.fontSize(7).font("Helvetica").fillColor("#7c8b87").text(firma.titulo, x, firmasY + 39, {
      width: colWidth,
      align: "center",
    });
  });

  // Última columna: siempre en blanco, para la firma manuscrita del matriculado
  const blankX = 24 + columnas.length * colWidth;
  doc
    .moveTo(blankX + colWidth / 2 - 30, firmasY + 26)
    .lineTo(blankX + colWidth / 2 + 30, firmasY + 26)
    .strokeColor("#c7d0ce")
    .lineWidth(1)
    .stroke();
  doc.fontSize(7.5).font("Helvetica").fillColor("#7c8b87").text("Firma del matriculado", blankX, firmasY + 29, {
    width: colWidth,
    align: "center",
  });

  const footerDividerY = pageHeight - 28;
  const footerTextY = pageHeight - 20;
  doc
    .moveTo(24, footerDividerY)
    .lineTo(CARD_WIDTH - 24, footerDividerY)
    .strokeColor("#e3ebe9")
    .lineWidth(1)
    .stroke();
  doc
    .fontSize(7)
    .font("Helvetica")
    .fillColor("#7c8b87")
    .text("Este documento es una credencial digital válida emitida por el CPT Santa Fe.", 24, footerTextY, {
      width: CARD_WIDTH - 48,
      align: "center",
    });
}
