"use client";

import { useMemo, useState } from "react";
import { construirEmailHtml, type EmailFooterInfo } from "@/lib/email-template";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { enviarCampania, subirImagenEmail } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

async function subirImagen(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("imagen", file);
  try {
    return await subirImagenEmail(fd);
  } catch {
    return null;
  }
}

export function MarketingForm({
  suscriptoresCount,
  matriculadosCount,
  siteUrl,
  footer,
  tamanoLote,
  intervaloMin,
}: {
  suscriptoresCount: number;
  matriculadosCount: number;
  tamanoLote: number;
  intervaloMin: number;
  siteUrl: string;
  footer: EmailFooterInfo;
}) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  const previewHtml = useMemo(
    () =>
      construirEmailHtml({
        titulo: titulo || "Título del correo",
        contenido: contenido || "<p>El contenido de tu mensaje aparecerá acá a medida que lo escribís.</p>",
        siteUrl,
        footer,
      }),
    [titulo, contenido, siteUrl, footer],
  );

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <form action={enviarCampania} className="space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div>
          <label className="text-xs font-medium text-ink-500">Título / asunto</label>
          <input
            name="titulo"
            required
            className={inputClass}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Texto</label>
          <p className="mt-0.5 text-xs text-ink-400">
            Seleccioná una parte del texto para darle su propio estilo (negrita, color, alineación, link). Para
            agregar una imagen, ubicá el cursor donde va y usá “Imagen”; después hacé clic en ella para cambiar su
            tamaño.
          </p>
          <RichTextEditor
            name="contenido"
            initialHtml=""
            conExtras
            subirImagen={subirImagen}
            onChange={setContenido}
            placeholder="Escribí el mensaje del correo…"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Destinatarios</label>
          <select name="destinatarios" defaultValue="SUSCRIPTORES" className={inputClass}>
            <option value="SUSCRIPTORES">Suscriptores del newsletter ({suscriptoresCount})</option>
            <option value="MATRICULADOS">Matriculados con email cargado ({matriculadosCount})</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>

        <p className="text-xs text-ink-400">
          El envío se hace en segundo plano, en lotes de {tamanoLote} mails cada {intervaloMin} minutos, para no
          superar el límite del servidor de correo. Podés cerrar esta página: el seguimiento está en el historial de
          envíos.
        </p>

        <button
          type="submit"
          className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
        >
          Enviar campaña
        </button>
      </form>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-xs font-medium text-ink-500">Preview del email</p>
        <div className="overflow-hidden rounded-xl border border-surface-border bg-surface">
          <iframe title="Preview del email" srcDoc={previewHtml} className="h-[600px] w-full bg-white" />
        </div>
      </div>
    </div>
  );
}
