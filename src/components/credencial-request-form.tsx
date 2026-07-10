"use client";

import { useState } from "react";
import { verificarMatricula, crearSolicitudCredencial } from "@/app/(site)/matriculacion/credencial/actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

type Step = "verificar" | "formulario" | "enviado";

export function CredencialRequestForm() {
  const [step, setStep] = useState<Step>("verificar");
  const [numeroMatricula, setNumeroMatricula] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerificar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await verificarMatricula(numeroMatricula, numeroDocumento);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setNombreCompleto(`${result.nombre} ${result.apellido}`);
    setStep("formulario");
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFotoPreview(null);
      return;
    }
    setFotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("numeroMatricula", numeroMatricula);
    formData.set("numeroDocumento", numeroDocumento);
    const result = await crearSolicitudCredencial(formData);
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
        <h3 className="mt-4 text-lg font-semibold text-ink-900">¡Solicitud recibida!</h3>
        <p className="mt-2 text-sm text-ink-600">
          El Colegio va a revisar tu foto y aprobar la credencial. Te vamos a enviar un email con el enlace de acceso
          o el motivo de rechazo.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-white p-8 shadow-sm">
      {step === "verificar" && (
        <form onSubmit={handleVerificar}>
          <h3 className="text-lg font-semibold text-ink-900">Paso 1: Verificación de matrícula</h3>
          <p className="mt-1 text-sm text-ink-600">Ingresá tu número de matrícula y de documento para continuar.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cred-numero-matricula" className="text-xs font-medium text-ink-500">
                Número de matrícula
              </label>
              <input
                id="cred-numero-matricula"
                value={numeroMatricula}
                onChange={(e) => setNumeroMatricula(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cred-numero-documento" className="text-xs font-medium text-ink-500">
                Número de documento
              </label>
              <input
                id="cred-numero-documento"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                required
                className={inputClass}
              />
            </div>
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

      {step === "formulario" && (
        <form action={handleSubmit}>
          <h3 className="text-lg font-semibold text-ink-900">¡Hola, {nombreCompleto}!</h3>
          <p className="mt-1 text-sm text-ink-600">Matrícula {numeroMatricula} verificada. Completá los siguientes datos.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="cred-email" className="text-xs font-medium text-ink-500">
                Email de contacto
              </label>
              <input id="cred-email" name="email" type="email" required placeholder="tu@email.com" className={inputClass} />
            </div>
            <div>
              <label htmlFor="cred-foto" className="text-xs font-medium text-ink-500">
                Foto para la credencial (JPG o PNG)
              </label>
              <div className="mt-1 flex items-center gap-4">
                {fotoPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fotoPreview} alt="" className="h-16 w-16 rounded-lg border border-surface-border object-cover" />
                )}
                <input
                  id="cred-foto"
                  name="foto"
                  type="file"
                  accept="image/jpeg,image/png"
                  required
                  onChange={handleFotoChange}
                  className="block text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900"
                />
              </div>
              <p className="mt-1 text-xs text-ink-400">Usá una foto tipo carnet, con buena iluminación y de frente.</p>
            </div>
          </div>

          {error && <p className="mt-3 text-sm font-medium text-accent-600">{error}</p>}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900 disabled:opacity-60"
            >
              {loading ? "Enviando…" : "Enviar solicitud"}
            </button>
            <button
              type="button"
              onClick={() => setStep("verificar")}
              className="text-sm font-semibold text-ink-500 hover:text-ink-700"
            >
              Volver
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
