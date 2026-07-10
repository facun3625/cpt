import { notFound } from "next/navigation";
import { getCredencialSolicitudById } from "@/lib/site-info";
import {
  updateSolicitud,
  aprobarSolicitud,
  rechazarSolicitud,
  reenviarEnlace,
  revocarCredencial,
  regenerarCredencial,
} from "../actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

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

export default async function CredencialDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const solicitud = await getCredencialSolicitudById(id);
  if (!solicitud) notFound();

  const puedeAprobarRechazar = solicitud.estado === "PENDIENTE" || solicitud.estado === "RECHAZADO";
  const puedeGestionarEmitida = solicitud.estado === "APROBADO";
  const puedeRegenerar = solicitud.estado === "APROBADO" || solicitud.estado === "REVOCADO";

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Solicitud de credencial digital</h1>
      <p className="mt-1 text-sm text-ink-600">
        Recibida el {dateFormatter.format(solicitud.createdAt)} · Email de contacto: {solicitud.email}
      </p>

      {solicitud.estado === "APROBADO" && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          Aprobada el {solicitud.revisadoEn && dateFormatter.format(solicitud.revisadoEn)}.{" "}
          {solicitud.credencialUrl && (
            <a href={solicitud.credencialUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Ver credencial
            </a>
          )}
          {solicitud.expiraEn && ` · Enlace válido hasta ${dateFormatter.format(solicitud.expiraEn)}.`}
        </div>
      )}
      {solicitud.estado === "RECHAZADO" && (
        <div className="mt-4 rounded-lg bg-ink-900/5 px-4 py-2.5 text-sm font-medium text-ink-700">
          Rechazada el {solicitud.revisadoEn && dateFormatter.format(solicitud.revisadoEn)}. Motivo: {solicitud.motivoRechazo}
        </div>
      )}
      {solicitud.estado === "REVOCADO" && (
        <div className="mt-4 rounded-lg bg-ink-900/5 px-4 py-2.5 text-sm font-medium text-ink-700">
          Credencial revocada el {solicitud.revisadoEn && dateFormatter.format(solicitud.revisadoEn)}. Ya no verifica
          como válida.
        </div>
      )}

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-surface-border bg-white p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={solicitud.fotoUrl} alt="" className="h-32 w-32 rounded-xl border border-surface-border object-cover" />
        <div>
          <p className="text-sm font-medium text-ink-500">Foto subida por el matriculado</p>
          <p className="mt-1 text-xs text-ink-400">Revisala antes de aprobar la credencial.</p>
          <a href={solicitud.fotoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-primary-700 hover:text-primary-900">
            Ver en tamaño completo
          </a>
        </div>
      </div>

      <form action={updateSolicitud.bind(null, solicitud.id)} className="mt-6 space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Nombre</label>
            <input name="nombre" defaultValue={solicitud.nombre} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Apellido</label>
            <input name="apellido" defaultValue={solicitud.apellido} required className={inputClass} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-ink-500">N° de matrícula</label>
            <input name="numeroMatricula" defaultValue={solicitud.numeroMatricula} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">N° de documento</label>
            <input name="numeroDocumento" defaultValue={solicitud.numeroDocumento} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Fecha de matriculación</label>
            <input
              name="fechaMatriculacion"
              type="date"
              defaultValue={toDateInputValue(solicitud.fechaMatriculacion)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Título profesional</label>
          <input
            name="tituloProfesional"
            defaultValue={solicitud.tituloProfesional ?? ""}
            placeholder="Maestro Mayor de Obras"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
        >
          Guardar cambios
        </button>
      </form>

      {puedeAprobarRechazar && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <form action={aprobarSolicitud.bind(null, solicitud.id)} className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-sm font-semibold text-emerald-800">Aprobar solicitud</h2>
            <p className="mt-1 text-xs text-emerald-700">
              Genera la credencial en PDF con QR de verificación y envía el enlace de descarga por email.
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

      {(puedeGestionarEmitida || puedeRegenerar) && (
        <div className="mt-6 flex flex-wrap gap-3 rounded-xl border border-surface-border bg-white p-5">
          {puedeGestionarEmitida && (
            <>
              <form action={reenviarEnlace.bind(null, solicitud.id)}>
                <button
                  type="submit"
                  className="rounded-full border border-surface-border px-5 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
                >
                  Reenviar enlace por email
                </button>
              </form>
              <form action={revocarCredencial.bind(null, solicitud.id)}>
                <button
                  type="submit"
                  className="rounded-full border border-accent-500/30 px-5 py-2 text-sm font-semibold text-accent-600 transition-colors hover:border-accent-500 hover:bg-accent-500/5"
                >
                  Revocar credencial
                </button>
              </form>
            </>
          )}
          {puedeRegenerar && (
            <form action={regenerarCredencial.bind(null, solicitud.id)}>
              <button
                type="submit"
                className="rounded-full border border-surface-border px-5 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
              >
                Generar nueva credencial (con los datos actuales)
              </button>
            </form>
          )}
        </div>
      )}

      <a href="/admin/credenciales" className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
        ← Volver al listado
      </a>
    </div>
  );
}
