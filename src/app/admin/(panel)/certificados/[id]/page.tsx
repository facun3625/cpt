import { notFound } from "next/navigation";
import { getCertificadoSolicitudById } from "@/lib/site-info";
import { updateSolicitud, aprobarSolicitud, rechazarSolicitud } from "../actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const textareaClass = `${inputClass} resize-y`;

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toDateInputValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function CertificadoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const solicitud = await getCertificadoSolicitudById(id);
  if (!solicitud) notFound();

  const esPendiente = solicitud.estado === "PENDIENTE";

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Solicitud de certificado</h1>
      <p className="mt-1 text-sm text-ink-600">
        Recibida el {dateFormatter.format(solicitud.createdAt)} · Email de contacto: {solicitud.email}
      </p>

      {solicitud.estado === "APROBADO" && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          Aprobado el {solicitud.revisadoEn && dateFormatter.format(solicitud.revisadoEn)}.{" "}
          {solicitud.pdfUrl && (
            <a href={solicitud.pdfUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Ver certificado
            </a>
          )}
          {solicitud.expiraEn && ` · Enlace válido hasta ${dateFormatter.format(solicitud.expiraEn)}.`}
        </div>
      )}
      {solicitud.estado === "RECHAZADO" && (
        <div className="mt-4 rounded-lg bg-ink-900/5 px-4 py-2.5 text-sm font-medium text-ink-700">
          Rechazado el {solicitud.revisadoEn && dateFormatter.format(solicitud.revisadoEn)}. Motivo: {solicitud.motivoRechazo}
        </div>
      )}

      <form action={updateSolicitud.bind(null, solicitud.id)} className="mt-6 space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Nombre</label>
            <input name="nombre" defaultValue={solicitud.nombre} required disabled={!esPendiente} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Apellido</label>
            <input name="apellido" defaultValue={solicitud.apellido} required disabled={!esPendiente} className={inputClass} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-ink-500">N° de matrícula</label>
            <input name="numeroMatricula" defaultValue={solicitud.numeroMatricula} required disabled={!esPendiente} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">N° de documento</label>
            <input name="numeroDocumento" defaultValue={solicitud.numeroDocumento} required disabled={!esPendiente} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Fecha de matriculación</label>
            <input
              name="fechaMatriculacion"
              type="date"
              defaultValue={toDateInputValue(solicitud.fechaMatriculacion)}
              disabled={!esPendiente}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Título profesional</label>
            <input
              name="tituloProfesional"
              defaultValue={solicitud.tituloProfesional ?? ""}
              placeholder="Maestro Mayor de Obras"
              disabled={!esPendiente}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Domicilio legal</label>
            <input
              name="domicilio"
              defaultValue={solicitud.domicilio ?? ""}
              placeholder="Calle 123, ciudad"
              disabled={!esPendiente}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Lugar de presentación</label>
          <input
            name="lugarPresentacion"
            defaultValue={solicitud.lugarPresentacion}
            required
            disabled={!esPendiente}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Observaciones (del solicitante)</label>
          <p className="mt-0.5 text-xs text-ink-400">
            Información interna para el administrador — no se imprime en el certificado.
          </p>
          <textarea
            name="observaciones"
            defaultValue={solicitud.observaciones ?? ""}
            rows={3}
            disabled={!esPendiente}
            className={textareaClass}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Notas adicionales (agregadas por el Colegio)</label>
          <p className="mt-0.5 text-xs text-ink-400">
            Texto libre que sí se imprime en el certificado — por ejemplo, la cláusula de vencimiento de cuota vigente.
          </p>
          <textarea
            name="notasAdicionales"
            defaultValue={solicitud.notasAdicionales ?? ""}
            rows={3}
            disabled={!esPendiente}
            className={textareaClass}
          />
        </div>

        {esPendiente && (
          <button
            type="submit"
            className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
          >
            Guardar cambios
          </button>
        )}
      </form>

      {esPendiente && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <form action={aprobarSolicitud.bind(null, solicitud.id)} className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-sm font-semibold text-emerald-800">Aprobar solicitud</h2>
            <p className="mt-1 text-xs text-emerald-700">
              Genera el certificado en PDF con QR de verificación y envía el enlace de descarga por email.
            </p>
            <button
              type="submit"
              className="mt-3 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Aprobar y emitir
            </button>
          </form>

          <form action={rechazarSolicitud.bind(null, solicitud.id)} className="rounded-xl border border-accent-500/20 bg-accent-500/5 p-5">
            <h2 className="text-sm font-semibold text-accent-700">Rechazar solicitud</h2>
            <textarea
              name="motivoRechazo"
              required
              placeholder="Motivo del rechazo (se envía por email)"
              rows={2}
              className="mt-2 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-accent-400"
            />
            <button
              type="submit"
              className="mt-3 rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Rechazar
            </button>
          </form>
        </div>
      )}

      <a href="/admin/certificados" className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
        ← Volver al listado
      </a>
    </div>
  );
}
