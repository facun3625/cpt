// Sanitizador de HTML para el cuerpo de las noticias.
// El contenido lo escriben sólo administradores autenticados, pero igual lo
// filtramos con lista blanca antes de guardarlo y antes de renderizarlo, para
// no depender de dependencias externas y evitar cualquier inyección.

const ALLOWED_TAGS = new Set([
  "p", "div", "br", "b", "strong", "i", "em", "u", "s",
  "span", "ul", "ol", "li", "a", "h2", "h3", "blockquote",
]);

export type SanitizeOptions = {
  // Modo email: además permite color de texto e imágenes (con ancho), y agrega estilos
  // inline (los clientes de correo no cargan CSS). `siteUrl` completa las URLs relativas.
  email?: { siteUrl: string };
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitizeStyle(style: string, email: boolean): string {
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
    } else if (email && prop === "color" && /^(#[0-9a-f]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\))$/i.test(val)) {
      decls.push(`color: ${val.toLowerCase()}`);
    } else if (prop === "font-weight" && /^(bold|normal|\d{3})$/i.test(val)) {
      decls.push(`font-weight: ${val.toLowerCase()}`);
    }
  }
  return decls.join("; ");
}

function absolutizar(url: string, siteUrl: string): string {
  return url.startsWith("/") ? `${siteUrl}${url}` : url;
}

const EMAIL_ESTILO_BASE: Record<string, string> = {
  p: "margin:0 0 14px;",
  ul: "margin:0 0 14px 20px; padding:0;",
  ol: "margin:0 0 14px 20px; padding:0;",
  blockquote: "margin:0 0 14px; padding-left:12px; border-left:3px solid #c9d6d3;",
};

function sanitizeAttrs(tag: string, attrs: string, opts: SanitizeOptions): string {
  const email = opts.email;
  const out: string[] = [];
  let hasHref = false;
  let style = "";
  let width: string | null = null;
  const re = /([a-zA-Z-]+)\s*=\s*"([^"]*)"|([a-zA-Z-]+)\s*=\s*'([^']*)'/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrs))) {
    const name = (m[1] ?? m[3]).toLowerCase();
    const value = m[2] ?? m[4] ?? "";
    if (name === "style") {
      style = sanitizeStyle(value, Boolean(email));
    } else if (email && tag === "img" && name === "src") {
      const src = value.trim();
      if (/^(https?:\/\/|\/uploads\/)/i.test(src)) out.push(`src="${escapeAttr(absolutizar(src, email.siteUrl))}"`);
    } else if (email && tag === "img" && name === "width") {
      if (/^\d{2,4}$/.test(value.trim())) width = value.trim();
    } else if (email && tag === "img" && name === "alt") {
      out.push(`alt="${escapeAttr(value)}"`);
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
    if (email) style = `${style ? `${style}; ` : ""}text-decoration: underline`;
  }
  if (tag === "img") {
    if (width) out.push(`width="${width}"`);
    style = `${style ? `${style}; ` : ""}max-width:100%; height:auto; border-radius:8px; vertical-align:bottom`;
  }
  if (email && EMAIL_ESTILO_BASE[tag]) style = `${EMAIL_ESTILO_BASE[tag]} ${style}`.trim();
  if (style) out.push(`style="${escapeAttr(style)}"`);
  return out.length ? " " + out.join(" ") : "";
}

export function sanitizeNoticiaHtml(html: string, opts: SanitizeOptions = {}): string {
  if (!html) return "";
  return html.replace(/<(\/?)([a-zA-Z0-9]+)((?:[^<>"']|"[^"]*"|'[^']*')*)>/g, (_match, slash, rawTag, attrs) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag) && !(opts.email && tag === "img")) return "";
    if (slash) return tag === "img" ? "" : `</${tag}>`;
    if (tag === "br") return "<br>";
    const attrsLimpios = sanitizeAttrs(tag, attrs, opts);
    if (tag === "img" && !attrsLimpios.includes("src=")) return "";
    return `<${tag}${attrsLimpios}>`;
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
