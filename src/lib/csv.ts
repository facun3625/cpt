import "server-only";
import { parse } from "csv-parse/sync";

export type MatriculadoRow = {
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  numeroMatricula: string;
  email: string;
};

const HEADER_ALIASES: Record<string, keyof MatriculadoRow> = {
  numerodocumento: "numeroDocumento",
  documento: "numeroDocumento",
  dni: "numeroDocumento",
  nrodocumento: "numeroDocumento",
  nombre: "nombre",
  nombres: "nombre",
  apellido: "apellido",
  apellidos: "apellido",
  numeromatricula: "numeroMatricula",
  matricula: "numeroMatricula",
  nromatricula: "numeroMatricula",
  email: "email",
  mail: "email",
  correo: "email",
  correoelectronico: "email",
};

const REQUIRED_FIELDS = ["numeroDocumento", "nombre", "apellido", "numeroMatricula"] as const;

function normalizeHeader(header: string): keyof MatriculadoRow | null {
  const key = header
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, "");
  return HEADER_ALIASES[key] ?? null;
}

function detectDelimiter(firstLine: string): string {
  const commaCount = (firstLine.match(/,/g) ?? []).length;
  const semicolonCount = (firstLine.match(/;/g) ?? []).length;
  return semicolonCount > commaCount ? ";" : ",";
}

export function parseMatriculadosCsv(content: string): {
  rows: MatriculadoRow[];
  errores: string[];
} {
  const firstLine = content.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = detectDelimiter(firstLine);

  const rawRecords = parse(content, {
    columns: true,
    bom: true,
    trim: true,
    skip_empty_lines: true,
    delimiter,
  }) as Record<string, string>[];

  if (rawRecords.length === 0) {
    return { rows: [], errores: ["El archivo está vacío o no tiene filas de datos."] };
  }

  const headerMap = new Map<string, keyof MatriculadoRow>();
  for (const rawHeader of Object.keys(rawRecords[0])) {
    const normalized = normalizeHeader(rawHeader);
    if (normalized) headerMap.set(rawHeader, normalized);
  }

  const missing = REQUIRED_FIELDS.filter((field) => ![...headerMap.values()].includes(field));
  if (missing.length > 0) {
    return {
      rows: [],
      errores: [
        `Faltan columnas requeridas: ${missing.join(", ")}. Encabezados esperados: numero_documento, nombre, apellido, numero_matricula (y opcionalmente email).`,
      ],
    };
  }

  const rows: MatriculadoRow[] = [];
  const errores: string[] = [];

  rawRecords.forEach((record, index) => {
    const row: Partial<MatriculadoRow> = { email: "" };
    for (const [rawHeader, field] of headerMap) {
      row[field] = String(record[rawHeader] ?? "").trim();
    }

    if (!row.numeroDocumento || !row.nombre || !row.apellido || !row.numeroMatricula) {
      errores.push(`Fila ${index + 2}: faltan datos, se omitió.`);
      return;
    }

    rows.push(row as MatriculadoRow);
  });

  return { rows, errores };
}
