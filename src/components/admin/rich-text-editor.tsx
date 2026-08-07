"use client";

import { useEffect, useRef } from "react";

const TAMANOS = [
  { label: "Tamaño", value: "" },
  { label: "Pequeño", value: "0.85em" },
  { label: "Normal", value: "1em" },
  { label: "Grande", value: "1.25em" },
  { label: "Muy grande", value: "1.5em" },
];

const botonClass =
  "flex h-8 min-w-8 items-center justify-center rounded border border-surface-border px-2 text-sm text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700";

export function RichTextEditor({ name, initialHtml }: { name: string; initialHtml: string }) {
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
      initialized.current = true;
    }
  }, [initialHtml]);

  // Después de cada re-render (por ej. al agregar/reordenar bloques) React puede
  // resetear el value del input oculto; lo volvemos a sincronizar con el editor.
  useEffect(() => {
    if (initialized.current && inputRef.current && editorRef.current) {
      inputRef.current.value = editorRef.current.innerHTML;
    }
  });

  function sync() {
    if (inputRef.current && editorRef.current) {
      inputRef.current.value = editorRef.current.innerHTML;
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
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onBlur={() => {
          saveSelection();
          sync();
        }}
        className="noticia-cuerpo min-h-32 px-3 py-2 text-sm text-ink-800 outline-none"
        data-placeholder="Escribí el texto de este bloque…"
      />
      <input type="hidden" name={name} ref={inputRef} defaultValue={initialHtml} />
    </div>
  );
}
