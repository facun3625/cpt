// Sanitizador de HTML para el cuerpo de las noticias.
// El contenido lo escriben sólo administradores autenticados, pero igual lo
// filtramos con lista blanca antes de guardarlo y antes de renderizarlo, para
// no depender de dependencias externas y evitar cualquier inyección.

const ALLOWED_TAGS = new Set([
  "p", "div", "br", "b", "strong", "i", "em", "u", "s",
  "span", "ul", "ol", "li", "a", "h2", "h3", "blockquote",
]);

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitizeStyle(style: string): string {
  const decls: string[] = [];
  for (const part of style.split(";")) {
    const idx = part.indexOf(":");
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();
    if (prop === "text-align" && /^(left|right|center|justify)$/i.test(val)) {
      decls.push(`text-align: ${val.toLowerCase()}`);
    } else if (prop === "font-size" && /^\d+(\.\d+)?(px|em|rem|%)$/i.test(val)) {
      decls.push(`font-size: ${val}`);
    } else if (prop === "font-weight" && /^(bold|normal|\d{3})$/i.test(val)) {
      decls.push(`font-weight: ${val.toLowerCase()}`);
    }
  }
  return decls.join("; ");
}

function sanitizeAttrs(tag: string, attrs: string): string {
  const out: string[] = [];
  let hasHref = false;
  const re = /([a-zA-Z-]+)\s*=\s*"([^"]*)"|([a-zA-Z-]+)\s*=\s*'([^']*)'/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrs))) {
    const name = (m[1] ?? m[3]).toLowerCase();
    const value = m[2] ?? m[4] ?? "";
    if (name === "style") {
      const s = sanitizeStyle(value);
      if (s) out.push(`style="${escapeAttr(s)}"`);
    } else if (tag === "a" && name === "href") {
      const href = value.trim();
      if (/^(https?:|mailto:)/i.test(href)) {
        out.push(`href="${escapeAttr(href)}"`);
        hasHref = true;
      }
    }
  }
  if (tag === "a" && hasHref) {
    out.push('target="_blank"', 'rel="noopener noreferrer"');
  }
  return out.length ? " " + out.join(" ") : "";
}

export function sanitizeNoticiaHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<(\/?)([a-zA-Z0-9]+)((?:[^<>"']|"[^"]*"|'[^']*')*)>/g, (_match, slash, rawTag, attrs) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (slash) return `</${tag}>`;
    if (tag === "br") return "<br>";
    return `<${tag}${sanitizeAttrs(tag, attrs)}>`;
  });
}

// Convierte el contenido de un bloque de texto en HTML listo para renderizar.
// Si ya es HTML (viene del editor), lo sanitiza. Si es texto plano (bloques
// viejos), respeta los saltos de línea partiendo en párrafos.
export function textoBloqueAHtml(texto: string): string {
  if (!texto) return "";
  if (/<[a-zA-Z][^>]*>/.test(texto)) {
    return sanitizeNoticiaHtml(texto);
  }
  return texto
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((p) => `<p>${escapeAttr(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

// Devuelve el texto plano (sin etiquetas) para chequear si un bloque está vacío.
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim();
}
