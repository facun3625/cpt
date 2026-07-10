"use client";

import { useState } from "react";
import { verificarMatricula, crearRegistroTecnico } from "@/app/(site)/bolsa-de-trabajo/registro/actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

type Especialidad = { id: string; nombre: string };
type Step = "verificar" | "especialidad" | "datos" | "enviado";

export function TecnicoRegistroForm({ especialidades }: { especialidades: Especialidad[] }) {
  const [step, setStep] = useState<Step>("verificar");
  const [numeroMatricula, setNumeroMatricula] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [especialidadId, setEspecialidadId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerificar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await verificarMatricula(numeroMatricula);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setNombreCompleto(`${result.nombre} ${result.apellido}`);
    setStep("especialidad");
  }

  function handleEspecialidad(e: React.FormEvent) {
    e.preventDefault();
    if (!especialidadId) {
      setError("Seleccioná una especialidad.");
      return;
    }
    setError(null);
    setStep("datos");
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("numeroMatricula", numeroMatricula);
    formData.set("especialidadId", especialidadId);
    const result = await crearRegistroTecnico(formData);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setStep("enviado");
  }

  if (step === "enviado") {
    return (
      <div className="rounded-2xl border border-surface-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink-900">¡Listo! Tu perfil ya está publicado.</h3>
        <p className="mt-2 text-sm text-ink-600">
          Ya figurás en la Bolsa de Trabajo. Podés pedirle al Colegio que lo edite o lo dé de baja cuando quieras.
        </p>
        <a href="/bolsa-de-trabajo" className="mt-4 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
          Ver la Bolsa de Trabajo →
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-white p-8 shadow-sm">
      {step === "verificar" && (
        <form onSubmit={handleVerificar}>
          <h3 className="text-lg font-semibold text-ink-900">Paso 1: Verificación de matrícula</h3>
          <p className="mt-1 text-sm text-ink-600">Ingresá tu número de matrícula para continuar.</p>

          <div className="mt-5">
            <label htmlFor="tec-numero-matricula" className="text-xs font-medium text-ink-500">
              Número de matrícula
            </label>
            <input
              id="tec-numero-matricula"
              value={numeroMatricula}
              onChange={(e) => setNumeroMatricula(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {error && <p className="mt-3 text-sm font-medium text-accent-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900 disabled:opacity-60"
          >
            {loading ? "Verificando…" : "Verificar"}
          </button>
        </form>
      )}

      {step === "especialidad" && (
        <form onSubmit={handleEspecialidad}>
          <h3 className="text-lg font-semibold text-ink-900">¡Hola, {nombreCompleto}!</h3>
          <p className="mt-1 text-sm text-ink-600">Paso 2: Seleccioná tu tecnicatura o especialidad.</p>

          <div className="mt-5">
            <label htmlFor="tec-especialidad" className="text-xs font-medium text-ink-500">
              Especialidad
            </label>
            <select
              id="tec-especialidad"
              value={especialidadId}
              onChange={(e) => setEspecialidadId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Seleccioná una opción</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="mt-3 text-sm font-medium text-accent-600">{error}</p>}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
            >
              Continuar
            </button>
            <button type="button" onClick={() => setStep("verificar")} className="text-sm font-semibold text-ink-500 hover:text-ink-700">
              Volver
            </button>
          </div>
        </form>
      )}

      {step === "datos" && (
        <form action={handleSubmit}>
          <h3 className="text-lg font-semibold text-ink-900">Paso 3: Datos personales y de contacto</h3>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="tec-nombre" className="text-xs font-medium text-ink-500">
                Nombre y apellido
              </label>
              <input id="tec-nombre" name="nombre" defaultValue={nombreCompleto} required className={inputClass} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tec-telefono" className="text-xs font-medium text-ink-500">
                  Teléfono
                </label>
                <input id="tec-telefono" name="telefono" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="tec-email" className="text-xs font-medium text-ink-500">
                  Email
                </label>
                <input id="tec-email" name="email" type="email" required className={inputClass} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tec-localidad" className="text-xs font-medium text-ink-500">
                  Localidad
                </label>
                <input id="tec-localidad" name="localidad" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="tec-disponibilidad" className="text-xs font-medium text-ink-500">
                  Disponibilidad
                </label>
                <input id="tec-disponibilidad" name="disponibilidad" placeholder="Ej: Tiempo completo" className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="tec-descripcion" className="text-xs font-medium text-ink-500">
                Descripción del servicio
              </label>
              <textarea id="tec-descripcion" name="descripcion" required rows={3} className={`${inputClass} resize-y`} />
            </div>
            <div>
              <label htmlFor="tec-observaciones" className="text-xs font-medium text-ink-500">
                Observaciones (opcional)
              </label>
              <textarea id="tec-observaciones" name="observaciones" rows={2} className={`${inputClass} resize-y`} />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" name="mostrarTelefono" defaultChecked className="h-4 w-4 rounded border-surface-border" />
                Mostrar teléfono públicamente
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" name="mostrarEmail" defaultChecked className="h-4 w-4 rounded border-surface-border" />
                Mostrar email públicamente
              </label>
            </div>
          </div>

          {error && <p className="mt-3 text-sm font-medium text-accent-600">{error}</p>}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900 disabled:opacity-60"
            >
              {loading ? "Publicando…" : "Publicar mi perfil"}
            </button>
            <button type="button" onClick={() => setStep("especialidad")} className="text-sm font-semibold text-ink-500 hover:text-ink-700">
              Volver
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
