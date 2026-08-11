import "server-only";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import sharp, { type Metadata } from "sharp";
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

// Lienzo interno de dibujo (apaisado, proporción tarjeta ID-1 85.6mm x 54mm).
// El contenido se dibuja a este tamaño y luego se escala al tamaño real de
// impresión sobre la hoja A4.
const CARD_WIDTH = 400;
const CARD_HEIGHT = 252;

// Tamaño real de una tarjeta ID-1 (85.6 x 54 mm) en puntos PDF, para que al
// imprimir la hoja A4 al 100% las caras salgan a tamaño carnet listo para recortar.
const CARD_PRINT_WIDTH = 242.6;
const CARD_PRINT_HEIGHT = CARD_PRINT_WIDTH * (CARD_HEIGHT / CARD_WIDTH);
const A4_WIDTH = 595.28;

const INSTITUTION_NAME =
  "COLEGIO PROFESIONAL DE MAESTROS MAYORES DE OBRAS Y TÉCNICOS DE LA ARQUITECTURA, INDUSTRIA E INGENIERÍA DE LA PROVINCIA DE SANTA FE";
const HEADER_NAME_FONT_SIZE = 8;
const HEADER_NAME_X = 72;

const QR_BLOCK_HEIGHT = 104;

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
  const fotoMeta = fotoBuffer ? await sharp(fotoBuffer).metadata() : null;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const headerHeight = measureHeaderHeight(doc);

    // Escala del lienzo interno (CARD_WIDTH x CARD_HEIGHT) al tamaño real de carnet.
    const scale = CARD_PRINT_WIDTH / CARD_WIDTH;
    const cardW = CARD_PRINT_WIDTH;
    const cardH = CARD_PRINT_HEIGHT;
    const x = (A4_WIDTH - cardW) / 2;
    const frontY = 150;
    const gap = 64;
    const backY = frontY + cardH + gap;

    // Título e instrucciones
    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .fillColor("#04213f")
      .text("Credencial de Matriculado", 0, 70, { width: A4_WIDTH, align: "center" });
    doc
      .fontSize(9.5)
      .font("Helvetica")
      .fillColor("#4b5a56")
      .text(
        "Imprimí esta hoja al 100% (sin ajustar a página). Recortá el frente y el dorso por las marcas y pegalos espalda con espalda para armar tu carnet.",
        A4_WIDTH / 2 - 220,
        94,
        { width: 440, align: "center" },
      );

    // Frente
    doc.save();
    doc.translate(x, frontY).scale(scale);
    drawFrente(doc, data, logoBuffer, fotoBuffer, fotoMeta, headerHeight);
    doc.restore();
    drawCropMarks(doc, x, frontY, cardW, cardH);
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#7c8b87").text("FRENTE", x, frontY - 14, { width: cardW });

    // Dorso
    doc.save();
    doc.translate(x, backY).scale(scale);
    drawDorso(doc, data, logoBuffer, qrBuffer, firmaBuffers, headerHeight, CARD_HEIGHT);
    doc.restore();
    drawCropMarks(doc, x, backY, cardW, cardH);
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#7c8b87").text("DORSO", x, backY - 14, { width: cardW });

    doc.end();
  });
}

// Marcas de corte en forma de "L" en las cuatro esquinas, por fuera de la tarjeta.
function drawCropMarks(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number) {
  const len = 10;
  const off = 4;
  doc.lineWidth(0.5).strokeColor("#9aa8a4");
  const corners = [
    { cx: x, cy: y, sx: -1, sy: -1 },
    { cx: x + w, cy: y, sx: 1, sy: -1 },
    { cx: x, cy: y + h, sx: -1, sy: 1 },
    { cx: x + w, cy: y + h, sx: 1, sy: 1 },
  ];
  for (const c of corners) {
    doc
      .moveTo(c.cx + c.sx * off, c.cy)
      .lineTo(c.cx + c.sx * (off + len), c.cy)
      .stroke();
    doc
      .moveTo(c.cx, c.cy + c.sy * off)
      .lineTo(c.cx, c.cy + c.sy * (off + len))
      .stroke();
  }
}

function drawFrente(
  doc: PDFKit.PDFDocument,
  data: CredencialPdfData,
  logoBuffer: Buffer | null,
  fotoBuffer: Buffer | null,
  fotoMeta: Metadata | null,
  headerHeight: number,
) {
  drawHeader(doc, logoBuffer, "Credencial Digital de Matriculado", headerHeight);

  const contentY = headerHeight + 14;

  // Foto: se recorta en modo "cover" para llenar el recuadro sin dejar franjas vacías
  const photoSize = 90;
  const photoX = 24;
  const photoRadius = 6;
  if (fotoBuffer) {
    const imgW = fotoMeta?.width ?? photoSize;
    const imgH = fotoMeta?.height ?? photoSize;
    const scale = Math.max(photoSize / imgW, photoSize / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const dx = photoX + (photoSize - drawW) / 2;
    const dy = contentY + (photoSize - drawH) / 2;

    doc.save();
    doc.roundedRect(photoX, contentY, photoSize, photoSize, photoRadius).clip();
    doc.image(fotoBuffer, dx, dy, { width: drawW, height: drawH });
    doc.restore();
  }
  doc.lineWidth(1).strokeColor("#c7d0ce").roundedRect(photoX, contentY, photoSize, photoSize, photoRadius).stroke();

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

  const footerDividerY = CARD_HEIGHT - 28;
  const footerTextY = CARD_HEIGHT - 20;
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

  // Firmas institucionales marcadas para credencial (sin firma del matriculado)
  const firmasY = contentY + QR_BLOCK_HEIGHT;
  const columnas: { nombre: string; titulo: string; buffer: Buffer | null }[] = data.firmas.map((f, i) => ({
    nombre: f.nombre,
    titulo: f.titulo,
    buffer: firmaBuffers[i],
  }));

  if (columnas.length > 0) {
    const colWidth = (CARD_WIDTH - 48) / columnas.length;
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
  }

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
