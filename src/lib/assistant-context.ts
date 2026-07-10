import "server-only";
import {
  getSedes,
  getContactEmails,
  getValorM2Status,
  getValorM2DisplayProps,
  getArancelesInfo,
  getArancelGrupos,
  getTecnicosBolsaPublicos,
  getBusquedasLaboralesActivas,
} from "@/lib/site-info";
import { formatCurrency } from "@/lib/format";

const STATIC_CONTEXT = `
Institución: Colegio Profesional de Maestros Mayores de Obras y Técnicos de la Provincia de Santa Fe (CPT Santa Fe).
Creado por la Ley Provincial N° 10.946, sancionada el 26/11/1992 y publicada en el Boletín Oficial el 02/02/1993.
Es una entidad de derecho público no estatal que ejerce funciones públicas por delegación del Estado provincial: gobierno de la matrícula profesional, control del ejercicio de la profesión, fijación de aranceles de oficina técnica, actualización del valor del m² y desarrollo de capacitaciones y servicios para matriculados.

Requisitos de matriculación (3 categorías):
1) Ejercicio Independiente: título original y fotocopia autenticada (o Certificado Analítico), DNI, 1 foto carnet 3x3, email activo. Aranceles: derecho de inscripción $50.000 (pago único) + matrícula anual 2026 $300.000 en 6 cuotas bimestrales de $50.000.
2) Relación de Dependencia: mismos requisitos + recibo de sueldo reciente + certificado de trabajo o alta temprana AFIP. Mismos aranceles.
3) Egresados Recientes (Ejercicio Independiente): título/certificado analítico o constancia de egreso, DNI, foto, email. Derecho de inscripción $50.000, EXENTO de matrícula anual 2026 (beneficio solo para egresados del año 2025).
La inscripción es presencial en la Oficina Administrativa: San Martín 1748, 1° piso, Santa Fe, de lunes a viernes de 8 a 13 hs.
Una vez matriculado es obligatorio inscribirse en la Caja de Previsión Social de los Profesionales de la Ingeniería: San Jerónimo 3033, Santa Fe (jubilación obligatoria, cobertura de salud opcional).

Pagos por transferencia bancaria (Nuevo Banco Santa Fe SA, titular Colegio Profesional de Maestros Mayores de Obras y Técnicos, CUIT 30-67460944-9):
- Aportes de honorarios profesionales (5%): CBU 3300500125000080690103
- Matrícula e inscripción profesional: CBU 3300500125000080684050
Después de transferir hay que enviar el comprobante a contaduria@cptsantafe.org.

Distrito 1: comprende 12 departamentos de la provincia de Santa Fe (incluye La Capital).

Páginas del sitio a las que podés derivar al usuario según el tema de su consulta:
- Requisitos de matriculación: /matriculacion/requisitos
- Títulos profesionales habilitados: /matriculacion/titulos-profesionales
- Pagos por transferencia: /matriculacion/pagos-transferencia
- Valor del m² y calculadora de honorarios: /valor-m2
- Aranceles de Oficina Técnica: /oficina-tecnica/aranceles
- Escala de Honorarios: /oficina-tecnica/escala-honorarios
- Noticias: /noticias
- Capacitaciones: /de-interes/capacitaciones
- Repositorio de archivos (formularios, reglamentos, circulares, manuales): /de-interes/descargas
- El CPT (institucional): /institucional/cpt
- Directorio de autoridades: /institucional/directorio
- Distrito 1: /institucional/distrito-1
- Bolsa de Trabajo (técnicos disponibles y búsquedas laborales publicadas por el CPT): /bolsa-de-trabajo
- Registrarse como técnico en la Bolsa de Trabajo: /bolsa-de-trabajo/registro
`.trim();

export async function buildAssistantContext(): Promise<string> {
  const [sedes, emails, valorM2Status, arancelesInfo, grupos, tecnicos, busquedas] = await Promise.all([
    getSedes(),
    getContactEmails(),
    getValorM2Status(),
    getArancelesInfo(),
    getArancelGrupos(),
    getTecnicosBolsaPublicos(),
    getBusquedasLaboralesActivas(),
  ]);

  const valorM2 = getValorM2DisplayProps(valorM2Status);
  const valorM2Text = valorM2.valorProximo
    ? `Valor vigente del m²: ${valorM2.vigenteHasta ? `hasta el ${valorM2.vigenteHasta}` : "vigente"} ${formatCurrency(valorM2.valorVigente)}; desde el ${valorM2.proximoDesde} pasa a ${formatCurrency(valorM2.valorProximo)}.`
    : `Valor vigente del m²: ${formatCurrency(valorM2.valorVigente)}.`;

  const sedesText = sedes.map((s) => `${s.nombre}: ${s.direccion}, teléfono ${s.telefono}`).join(" | ");
  const emailsText = emails.map((e) => `${e.label}: ${e.value}`).join(" | ");

  const gruposComunes = grupos.filter((g) => !g.esHonorarioMinimo);
  const arancelesText = gruposComunes
    .map((g) => `${g.titulo}: ${g.items.map((i) => `${i.label} ${formatCurrency(i.valor)}`).join(", ")}`)
    .join(". ");

  const tecnicosText = tecnicos
    .map((t) => `${t.nombre} (${t.especialidad.nombre}, ${t.localidad})`)
    .join(" | ");

  const busquedasText = busquedas
    .map((b) => `${b.titulo} en ${b.empresa} (${b.localidad}, ${b.modalidad}${b.especialidad ? `, requiere ${b.especialidad.nombre}` : ""})`)
    .join(" | ");

  return `${STATIC_CONTEXT}

DATOS ACTUALIZADOS (vigentes hoy):
Sedes: ${sedesText || "sin datos cargados"}
Emails de contacto: ${emailsText || "sin datos cargados"}
${valorM2Text}
Aranceles de Oficina Técnica vigentes desde el ${arancelesInfo.vigenciaFecha || "(sin fecha cargada)"}: ${arancelesText || "sin datos cargados"}

Técnicos matriculados disponibles en la Bolsa de Trabajo ahora mismo: ${tecnicosText || "no hay técnicos registrados actualmente"}. Si te preguntan por un técnico de una especialidad puntual, revisá esta lista y respondé según lo que encuentres ahí (no derives directo a Secretaría sin antes chequear esta lista); si hay resultados, mencionalos y linkeá a /bolsa-de-trabajo para ver el listado completo con datos de contacto.
Búsquedas laborales activas publicadas por el CPT: ${busquedasText || "no hay búsquedas laborales activas actualmente"}.
`;
}
