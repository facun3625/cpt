import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tutorial tramitación online de Expedientes Técnicos | CPT Santa Fe",
  description:
    "Guía del nuevo sistema de tramitación online de Expedientes Técnicos a través de la plataforma GesTO.",
};

const capacidades = [
  "Gestionar nuevos trámites: calcular los aportes e imprimir toda la documentación asociada (encomienda, liquidaciones, boletas de aportes y certificaciones).",
  "Consultar y hacer seguimiento de trámites ingresados.",
  "Consultar datos históricos de expedientes ingresados con anterioridad al nuevo sistema.",
];

const pasos: { texto: string; sub?: string[] }[] = [
  {
    texto:
      "El profesional accede a la web al área de tramitación online del Colegio utilizando su N° Documento y su Clave de Acceso. Al ingresar por primera vez, se utilizará el nro. de matrícula como Clave de Acceso con la obligación de cambiarlo inicialmente y luego una vez al año.",
  },
  {
    texto:
      "Desde las opciones del menú, ingresa al Simulador de cálculos de aportes, donde el profesional ingresa los datos básicos de la liquidación que se utilizan para el cálculo de aportes. El simulador resolverá los valores de referencia (montos básicos) y aportes profesionales.",
  },
  {
    texto: "Ingresa el trámite del expediente de forma completa. Se debe ingresar toda la información requerida para este trámite:",
    sub: [
      "Datos del expediente (n° referencia, fecha referencia, tipo, destino). El n° expediente, la fechas de ingreso y vencimiento, los otorga el sistema.",
      "Datos del comitente (nombre, documento, domicilio, cp y localidad).",
      "Datos del propietario (nombre).",
      "Datos del inmueble (n° partida, ubicación, cp, localidad, sección/quinta, manzana, gráfico/lote, subdivisión/parcela, distrito municipal).",
      "Datos de los profesionales participantes. Para los profesionales participantes matriculados en el colegio, se permitirá el ingreso simplificado con el n° matrícula y el porcentaje de participación. Para los profesionales no matriculados en el colegio, se habilitará el ingreso de sus datos profesionales (nombre, título, n° matrícula, n° documento y domicilio) y el porcentaje de participación. Para el caso de trabajos realizados en sociedad, el sistema provee un mecanismo de “firma” para que todos los socios matriculados al Colegio autoricen el inicio del trámite. El sistema hace una verificación del estado de habilitación del profesional y si tiene restricciones para la tramitación online, permitiendo o no la continuación del trámite según la situación verificada.",
    ],
  },
  {
    texto:
      "El sistema le otorga al trámite ingresado un N° de Expediente con un estado inicial “0-Ingresado” y genera los cargos por aportes al Colegio y a la Caja.",
  },
  {
    texto:
      "El profesional genera e imprime las boletas de aportes para el Colegio y la Caja, con el código de barras sobre papel en blanco (se abandona el uso de formularios preimpresos). Si correspondiere, en la boleta del Colegio también se incluyen los conceptos adicionales (gastos administrativos, comisiones, etc.). Las boletas generadas tienen fecha de vencimiento de 30 días. De no efectivizarse los depósitos bancarios dentro de ese período, las boletas vencidas deben ser desechadas y reemplazadas por otras nuevas. El banco no aceptará boletas con fechas vencidas. En los expedientes presentados por sociedades, las boletas de aportes se emiten siempre en forma conjunta, el sistema almacenará internamente los porcentajes de participación en cada depósito.",
  },
  { texto: "El profesional hace los depósitos bancarios." },
  {
    texto:
      "El banco procesa el depósito de forma totalmente electrónica y genera los registros necesarios para su envío al Colegio.",
  },
  {
    texto:
      "Diariamente, el Colegio y la Caja procesan los archivos electrónicos enviados por el banco. De igual manera como se procede ahora con los pagos de matrícula.",
  },
  { texto: "El sistema cancela los cargos del expediente ajustando su saldo de aportes." },
  {
    texto: "Dentro de un plazo de 15 días de ingresado el expediente, el profesional debe:",
    sub: [
      "Cancelar el 100% de los aportes preliminares (proyecto, documentación, etc.), y/o un porcentaje a determinar de aportes por tareas de dirección técnica.",
      "Ingresar los documentos digitales que el Colegio determina como el legajo mínimo para el tipo de expediente ingresado.",
      "Ingresar el trámite web “Revisión del expediente y documentos digitales” respectivo.",
    ],
  },
  {
    texto:
      "La oficina técnica revisa el legajo y la liquidación de aportes, y según corresponda establece el estado del expediente a “2-Observado”, “3-Aprobado c/Liq. parcial” ó “4-Aprobado c/Liq. completa”.",
  },
  {
    texto:
      "Si el estado del expediente es “3-Aprobado c/Liq. parcial” ó “4-Aprobado c/Liq. completa”, el sistema habilitará la emisión de la “Certificación de Aportes Profesionales y Retenciones de Ley”. Contiene la siguiente información:",
    sub: [
      "N° de Certificado y Fecha de emisión.",
      "N° de Expediente y Fecha de ingreso.",
      "Profesionales actuantes matriculados en el Colegio.",
      "Nombre, documento o CUIT, y domicilio del Comitente. Nombre del Propietario.",
      "Ubicación del trabajo.",
      "Datos de la liquidación de aportes por tarea profesional, porcentajes de los aportes realizados.",
    ],
  },
  {
    texto:
      "El Colegio habilitará una consulta pública en Internet, donde se puede verificar la autenticidad de las certificaciones.",
  },
  {
    texto:
      "Si el expediente queda en estado “2-Observado” el profesional tendrá un plazo de 30 días (desde la fecha de ingreso del expediente) para arreglar las observaciones.",
  },
  {
    texto:
      "Una vez verificado la finalización de las tareas profesionales y el depósito del 100% de los aportes, el visador puede actualizar el estado del expediente a “9-Liquidación Definitiva” que habilitará la emisión de la Certificación Definitiva.",
  },
  {
    texto:
      "Vencidos alguno de los plazos estipulados el sistema aplicará restricciones a la realización de nuevos trámites o a la emisión de boletas y certificados. Los plazos son:",
    sub: [
      "30 días para la presentación del legajo.",
      "90 días para la aprobación definitiva del expediente.",
      "2 años para el cierre definitivo de expedientes.",
      "Los plazos siempre son respecto a la fecha de ingreso del expediente. Para el caso de situaciones especiales, particulares del expediente o generales de la oficina técnica por acumulación de expedientes (vencimientos, moratorias, etc.), se implementa el estado “1-Recibido” que indica que el profesional cumplió con la presentación de la documentación en el colegio. Este estado evita que el sistema aplique restricciones por el vencimiento de los plazos indicados.",
    ],
  },
  {
    texto:
      "Dentro del área profesional, con el propósito de mantener informado al matriculado sobre el estado de sus trámites, el sistema tiene incorporadas opciones de consulta on-line donde se puede verificar el estado de los expedientes en cualquier momento. Además, diariamente un proceso automático de notificación vía e-mail informará de las novedades en los expedientes: cambios de estado, modificaciones, y vencimientos de plazos.",
  },
];

export default function TutorialExpedientesPage() {
  return (
    <div style={{ paddingTop: "var(--site-header-h, 170px)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Tutorial tramitación online de Expedientes Técnicos" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Tutorial tramitación Online de Expedientes Técnicos
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Guía del nuevo sistema de tramitación de expedientes técnicos a través de la plataforma GesTO.
          </p>
        </div>
        <svg
          className="absolute inset-x-0 bottom-0 block h-16 w-full text-ink-900"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,20 C320,20 460,85 720,85 C980,85 1120,20 1440,20 L1440,100 L0,100 Z" fill="currentColor" />
        </svg>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-semibold text-ink-900">Introducción</h2>
        <p className="mt-4 text-ink-600">
          Se introduce un cambio radical en la tramitación de los expedientes técnicos, reemplazando la
          metodología de gestión personal por un procedimiento basado en Internet.
        </p>
        <p className="mt-4 text-ink-600">
          El nuevo sistema permitirá la gestión completa de la tramitación vía online desde la plataforma
          de GesTO:{" "}
          <a
            href="https://www.gesto.org.ar/cptsantafe"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary-700 hover:text-primary-900"
          >
            www.gesto.org.ar/cptsantafe
          </a>
        </p>
        <p className="mt-4 text-ink-600">
          En esta plataforma cada profesional posee un área de trabajo personal, desde donde podrá:
        </p>
        <ul className="mt-4 space-y-2">
          {capacidades.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-ink-700">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="mt-0.5 shrink-0 text-primary-600"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {c}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl font-semibold text-ink-900">Metodología</h2>
        <p className="mt-4 text-ink-600">El procedimiento para gestionar los trámites online es el siguiente:</p>

        <ol className="mt-6 space-y-6">
          {pasos.map((paso, i) => (
            <li key={i} className="rounded-xl border border-surface-border bg-white p-5">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm text-ink-700">{paso.texto}</p>
              </div>
              {paso.sub && (
                <ul className="mt-3 ml-9 space-y-2 border-l border-surface-border pl-4">
                  {paso.sub.map((s, j) => (
                    <li key={j} className="text-sm text-ink-600">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
