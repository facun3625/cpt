import "server-only";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";

export type MatriculadoRow = {
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  numeroMatricula: string;
  email: string;
  condicion: string;
  titulo: string;
  situacion: string;
  domicilioLaboral: string;
  codigoPostal: string;
  idLocalidad: string;
};

const HEADER_ALIASES: Record<string, keyof MatriculadoRow> = {
  numerodocumento: "numeroDocumento",
  documento: "numeroDocumento",
  dni: "numeroDocumento",
  nrodocumento: "numeroDocumento",
  ndedocum: "numeroDocumento",
  nombre: "nombre",
  nombres: "nombre",
  apellido: "apellido",
  apellidos: "apellido",
  numeromatricula: "numeroMatricula",
  matricula: "numeroMatricula",
  nromatricula: "numeroMatricula",
  nicpt: "numeroMatricula",
  email: "email",
  mail: "email",
  correo: "email",
  correoelectronico: "email",
  condicion: "condicion",
  titulo: "titulo",
  situacion: "situacion",
  domiciliolaboral: "domicilioLaboral",
  domicilio: "domicilioLaboral",
  cp: "codigoPostal",
  codigopostal: "codigoPostal",
  iddeloc: "idLocalidad",
  idlocalidad: "idLocalidad",
  idloc: "idLocalidad",
};

const REQUIRED_FIELDS = ["numeroDocumento", "nombre", "apellido", "numeroMatricula"] as const;

const EXTENSIONES_SOPORTADAS = ["csv", "xlsx", "xls", "xml"] as const;

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

function extraerRegistrosCrudos(
  buffer: Buffer,
  extension: string,
): { rawRecords: Record<string, string>[]; error?: string } {
  if (extension === "csv") {
    const content = buffer.toString("utf-8");
    const firstLine = content.split(/\r?\n/, 1)[0] ?? "";
    const delimiter = detectDelimiter(firstLine);
    const rawRecords = parse(content, {
      columns: true,
      bom: true,
      trim: true,
      skip_empty_lines: true,
      delimiter,
    }) as Record<string, string>[];
    return { rawRecords };
  }

  if (extension === "xlsx" || extension === "xls" || extension === "xml") {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const primeraHoja = workbook.SheetNames[0];
    if (!primeraHoja) return { rawRecords: [], error: "El archivo no tiene hojas con datos." };
    const rawRecords = XLSX.utils.sheet_to_json(workbook.Sheets[primeraHoja], {
      raw: false,
      defval: "",
    }) as Record<string, string>[];
    return { rawRecords };
  }

  return { rawRecords: [], error: "Formato de archivo no soportado. Subí un CSV, XLS o XLSX." };
}

export function parseMatriculadosFile(
  buffer: Buffer,
  filename: string,
): {
  rows: MatriculadoRow[];
  errores: string[];
} {
  const extension = filename.toLowerCase().split(".").pop() ?? "";
  if (!EXTENSIONES_SOPORTADAS.includes(extension as (typeof EXTENSIONES_SOPORTADAS)[number])) {
    return { rows: [], errores: ["Formato de archivo no soportado. Subí un CSV, XLS o XLSX."] };
  }

  const { rawRecords, error } = extraerRegistrosCrudos(buffer, extension);
  if (error) return { rows: [], errores: [error] };

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
    const row: Partial<MatriculadoRow> = {
      email: "",
      condicion: "",
      titulo: "",
      situacion: "",
      domicilioLaboral: "",
      codigoPostal: "",
      idLocalidad: "",
    };
    for (const [rawHeader, field] of headerMap) {
      row[field] = String(record[rawHeader] ?? "").trim();
    }

    // El N° de documento suele venir con puntos o comas como separador de miles (ej. "7.891.023")
    if (row.numeroDocumento) {
      row.numeroDocumento = row.numeroDocumento.replace(/\D/g, "");
    }

    if (!row.numeroDocumento || !row.nombre || !row.apellido || !row.numeroMatricula) {
      errores.push(`Fila ${index + 2}: faltan datos, se omitió.`);
      return;
    }

    rows.push(row as MatriculadoRow);
  });

  return { rows, errores };
}
