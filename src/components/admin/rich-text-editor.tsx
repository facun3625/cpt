"use client";

import { useEffect, useRef, useState } from "react";

const TAMANOS = [
  { label: "Tamaño", value: "" },
  { label: "Pequeño", value: "0.85em" },
  { label: "Normal", value: "1em" },
  { label: "Grande", value: "1.25em" },
  { label: "Muy grande", value: "1.5em" },
];

const COLORES = [
  { label: "Negro", value: "#14201d" },
  { label: "Azul CPT", value: "#016099" },
  { label: "Azul oscuro", value: "#04213f" },
  { label: "Rojo", value: "#c62828" },
  { label: "Naranja", value: "#e65100" },
  { label: "Verde", value: "#2e7d32" },
  { label: "Gris", value: "#5a6b67" },
];

// Anchos en px del cuerpo del email (el contenido útil mide ~544px).
const TAMANOS_IMAGEN = [
  { label: "Chica", value: 180 },
  { label: "Mediana", value: 300 },
  { label: "Grande", value: 420 },
  { label: "Ancho completo", value: 544 },
];

const botonClass =
  "flex h-8 min-w-8 items-center justify-center rounded border border-surface-border px-2 text-sm text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700";

type Props = {
  name: string;
  initialHtml: string;
  /** Agrega color de texto, links e imágenes (con tamaño). Pensado para el email marketing. */
  conExtras?: boolean;
  /** Sube una imagen y devuelve su URL (requerido para insertar imágenes). */
  subirImagen?: (file: File) => Promise<string | null>;
  onChange?: (html: string) => void;
  placeholder?: string;
};

export function RichTextEditor({
  name,
  initialHtml,
  conExtras = false,
  subirImagen,
  onChange,
  placeholder = "Escribí el texto de este bloque…",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagenSel, setImagenSel] = useState<HTMLImageElement | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [errorImagen, setErrorImagen] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);
  const initialized = useRef(false);

  // Inicializamos el contenido una sola vez de forma imperativa. Si usáramos
  // dangerouslySetInnerHTML, cualquier re-render del formulario (por ej. al
  // agregar otro bloque) volvería a aplicarlo y borraría lo que el usuario
  // escribió, porque el editor es no controlado.
  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = initialHtml;
      if (inputRef.current) inputRef.current.value = initialHtml;
      // Que Enter cree <p> (y no <div>) para que cada párrafo tenga su separación en el email.
      if (conExtras) document.execCommand("defaultParagraphSeparator", false, "p");
      initialized.current = true;
    }
  }, [initialHtml, conExtras]);

  // Después de cada re-render (por ej. al agregar/reordenar bloques) React puede
  // resetear el value del input oculto; lo volvemos a sincronizar con el editor.
  useEffect(() => {
    if (initialized.current && inputRef.current && editorRef.current) {
      inputRef.current.value = html();
    }
  });

  function html(): string {
    const editor = editorRef.current;
    if (!editor) return "";
    // La marca de "imagen seleccionada" es sólo visual: no debe viajar en el contenido.
    editor.querySelectorAll("img[data-sel]").forEach((img) => img.removeAttribute("data-sel"));
    const out = editor.innerHTML;
    if (imagenSel && editor.contains(imagenSel)) imagenSel.setAttribute("data-sel", "");
    return out;
  }

  function sync() {
    if (inputRef.current && editorRef.current) {
      const value = html();
      inputRef.current.value = value;
      onChange?.(value);
    }
  }

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }

  function cmd(command: string, value?: string) {
    // El preventDefault del mousedown ya preservó la selección viva del editor,
    // así que ejecutamos el comando directamente sin restaurar rangos guardados.
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    saveSelection();
    sync();
  }

  function aplicarTamano(px: string) {
    if (!px) return;
    editorRef.current?.focus();
    restoreSelection();
    // execCommand("fontSize") genera <font size="7">; lo reemplazamos por un
    // <span style="font-size"> para tener markup limpio y en em.
    document.execCommand("fontSize", false, "7");
    editorRef.current?.querySelectorAll('font[size="7"]').forEach((f) => {
      const span = document.createElement("span");
      span.style.fontSize = px;
      span.innerHTML = f.innerHTML;
      f.replaceWith(span);
    });
    saveSelection();
    sync();
  }

  function aplicarColor(color: string) {
    editorRef.current?.focus();
    restoreSelection();
    // Con styleWithCSS el color sale como <span style="color">; lo apagamos enseguida para que
    // negrita/cursiva/subrayado sigan generando etiquetas simples.
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("foreColor", false, color);
    document.execCommand("styleWithCSS", false, "false");
    saveSelection();
    sync();
  }

  function agregarLink() {
    saveSelection();
    const entrada = window.prompt("Dirección del link (por ejemplo https://cptsantafe.org):");
    if (!entrada) return;
    let url = entrada.trim();
    if (!/^(https?:|mailto:)/i.test(url)) url = /^[^\s@]+@[^\s@]+$/.test(url) ? `mailto:${url}` : `https://${url}`;
    editorRef.current?.focus();
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.isCollapsed) {
      const texto = url.replace(/^(https?:\/\/|mailto:)/i, "");
      document.execCommand("insertHTML", false, `<a href="${url.replace(/"/g, "&quot;")}">${texto}</a>`);
    } else {
      document.execCommand("createLink", false, url);
    }
    saveSelection();
    sync();
  }

  async function elegirImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !subirImagen) return;
    setErrorImagen(null);
    setSubiendo(true);
    const url = await subirImagen(file);
    setSubiendo(false);
    if (!url) {
      setErrorImagen("No se pudo subir la imagen. Usá un archivo JPG o PNG.");
      return;
    }
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    if (savedRange.current) restoreSelection();
    else {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    document.execCommand("insertHTML", false, `<img src="${url}" width="420" alt="">`);
    saveSelection();
    sync();
  }

  function seleccionarImagen(img: HTMLImageElement | null) {
    editorRef.current?.querySelectorAll("img[data-sel]").forEach((i) => i.removeAttribute("data-sel"));
    img?.setAttribute("data-sel", "");
    setImagenSel(img);
    if (img) {
      const range = document.createRange();
      range.selectNode(img);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      savedRange.current = range.cloneRange();
    }
  }

  function tamanoImagen(ancho: number) {
    if (!imagenSel) return;
    imagenSel.setAttribute("width", String(ancho));
    imagenSel.removeAttribute("height");
    sync();
  }

  function quitarImagen() {
    if (!imagenSel) return;
    imagenSel.remove();
    setImagenSel(null);
    sync();
  }

  function alinearImagen(command: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      cmd(command);
    };
  }

  // preventDefault en mousedown para no robarle el foco/selección al editor.
  function botonComando(command: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      cmd(command);
    };
  }

  return (
    <div className="mt-1 overflow-hidden rounded-lg border border-surface-border focus-within:border-primary-400">
      <div className="flex flex-wrap items-center gap-1 border-b border-surface-border bg-surface px-2 py-1.5">
        <button type="button" onMouseDown={botonComando("bold")} className={`${botonClass} font-bold`} title="Negrita">
          B
        </button>
        <button type="button" onMouseDown={botonComando("italic")} className={`${botonClass} italic`} title="Cursiva">
          I
        </button>
        <button
          type="button"
          onMouseDown={botonComando("underline")}
          className={`${botonClass} underline`}
          title="Subrayado"
        >
          U
        </button>
        <span className="mx-1 h-5 w-px bg-surface-border" />
        <button type="button" onMouseDown={botonComando("justifyLeft")} className={botonClass} title="Alinear a la izquierda">
          ≡
        </button>
        <button type="button" onMouseDown={botonComando("justifyCenter")} className={botonClass} title="Centrar">
          ⊟
        </button>
        <button type="button" onMouseDown={botonComando("justifyRight")} className={botonClass} title="Alinear a la derecha">
          ≣
        </button>
        <span className="mx-1 h-5 w-px bg-surface-border" />
        <button
          type="button"
          onMouseDown={botonComando("insertUnorderedList")}
          className={botonClass}
          title="Lista"
        >
          •
        </button>
        <select
          onMouseDown={saveSelection}
          onChange={(e) => {
            aplicarTamano(e.target.value);
            e.target.selectedIndex = 0;
          }}
          className="h-8 rounded border border-surface-border bg-white px-2 text-sm text-ink-600"
          title="Tamaño de letra"
          defaultValue=""
        >
          {TAMANOS.map((t) => (
            <option key={t.label} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onMouseDown={botonComando("removeFormat")}
          className={`${botonClass} text-xs`}
          title="Quitar formato"
        >
          Tx
        </button>
        {conExtras && (
          <>
            <span className="mx-1 h-5 w-px bg-surface-border" />
            <button
              type="button"
              onMouseDown={botonComando("insertOrderedList")}
              className={botonClass}
              title="Lista numerada"
            >
              1.
            </button>
            <span className="mx-1 h-5 w-px bg-surface-border" />
            {COLORES.map((c) => (
              <button
                key={c.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  aplicarColor(c.value);
                }}
                title={`Color: ${c.label}`}
                aria-label={`Color ${c.label}`}
                className="h-6 w-6 rounded-full border border-black/10 transition-transform hover:scale-110"
                style={{ backgroundColor: c.value }}
              />
            ))}
            <label
              title="Otro color"
              className="relative flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-surface-border bg-white text-[11px] text-ink-500"
              onMouseDown={saveSelection}
            >
              +
              <input
                type="color"
                onChange={(e) => aplicarColor(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            <span className="mx-1 h-5 w-px bg-surface-border" />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                agregarLink();
              }}
              className={botonClass}
              title="Insertar link (seleccioná el texto antes)"
            >
              Link
            </button>
            <button type="button" onMouseDown={botonComando("unlink")} className={`${botonClass} text-xs`} title="Quitar link">
              Sin link
            </button>
            {subirImagen && (
              <button
                type="button"
                disabled={subiendo}
                onMouseDown={(e) => {
                  e.preventDefault();
                  saveSelection();
                  fileRef.current?.click();
                }}
                className={`${botonClass} disabled:opacity-50`}
                title="Insertar imagen"
              >
                {subiendo ? "Subiendo…" : "Imagen"}
              </button>
            )}
          </>
        )}
      </div>
      {conExtras && imagenSel && (
        <div className="flex flex-wrap items-center gap-1 border-b border-surface-border bg-primary-50 px-2 py-1.5 text-xs text-ink-600">
          <span className="mr-1 font-semibold">Imagen:</span>
          {TAMANOS_IMAGEN.map((t) => (
            <button
              key={t.value}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                tamanoImagen(t.value);
              }}
              className={`${botonClass} ${Number(imagenSel.getAttribute("width")) === t.value ? "border-primary-500 bg-white text-primary-700" : ""}`}
            >
              {t.label}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-surface-border" />
          <button type="button" onMouseDown={alinearImagen("justifyLeft")} className={botonClass} title="Izquierda">
            ≡
          </button>
          <button type="button" onMouseDown={alinearImagen("justifyCenter")} className={botonClass} title="Centrar">
            ⊟
          </button>
          <button type="button" onMouseDown={alinearImagen("justifyRight")} className={botonClass} title="Derecha">
            ≣
          </button>
          <span className="mx-1 h-5 w-px bg-surface-border" />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              quitarImagen();
            }}
            className={`${botonClass} text-red-600`}
          >
            Quitar
          </button>
        </div>
      )}
      {errorImagen && <p className="bg-red-50 px-3 py-1.5 text-xs text-red-600">{errorImagen}</p>}
      {conExtras && subirImagen && (
        <input ref={fileRef} type="file" accept="image/jpeg,image/png" onChange={elegirImagen} className="hidden" />
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onClick={(e) => {
          if (!conExtras) return;
          const t = e.target;
          seleccionarImagen(t instanceof HTMLImageElement ? t : null);
        }}
        onBlur={() => {
          saveSelection();
          sync();
        }}
        className="noticia-cuerpo min-h-32 px-3 py-2 text-sm text-ink-800 outline-none"
        data-placeholder={placeholder}
      />
      <input type="hidden" name={name} ref={inputRef} defaultValue={initialHtml} />
    </div>
  );
}
