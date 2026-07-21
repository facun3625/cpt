export type EmailFooterInfo = {
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  instagramUrl?: string | null;
};

export type EmailTemplateData = {
  titulo: string;
  contenido: string;
  imagenUrl?: string | null;
  imagenPosicion?: "antes" | "despues";
  siteUrl: string;
  footer?: EmailFooterInfo;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function construirEmailHtml({
  titulo,
  contenido,
  imagenUrl,
  imagenPosicion = "antes",
  siteUrl,
  footer,
}: EmailTemplateData) {
  const parrafos = contenido
    .split("\n")
    .filter((linea) => linea.trim().length > 0)
    .map((linea) => `<p style="margin:0 0 14px;">${escapeHtml(linea)}</p>`)
    .join("");

  const datosContacto = [footer?.direccion, footer?.telefono, footer?.email].filter(Boolean).join(" · ");

  const imagenHtml = imagenUrl
    ? `<img src="${imagenUrl.startsWith("http") ? imagenUrl : `${siteUrl}${imagenUrl}`}" alt="" style="max-width:100%; border-radius:8px; margin-bottom:16px;" />`
    : "";

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background:#ffffff; border:1px solid #e3ebe9; border-radius:10px; overflow:hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#016099;">
        <tr>
          <td style="padding:20px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <img src="${siteUrl}/logo.png" alt="CPT Santa Fe" height="40" style="height:40px; display:block;" />
                </td>
                <td style="color:#ffffff; font-size:14px; font-weight:600;">
                  Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="padding:28px; color:#14201d;">
        <h1 style="color:#04213f; font-size:22px; margin:0 0 16px;">${escapeHtml(titulo)}</h1>
        ${imagenPosicion === "antes" ? imagenHtml : ""}
        <div style="font-size:15px; line-height:1.6;">${parrafos}</div>
        ${imagenPosicion === "despues" ? imagenHtml : ""}
      </div>

      <div style="background:#f4f7f6; padding:20px 28px; border-top:1px solid #e3ebe9;">
        <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:#04213f;">
          Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe
        </p>
        ${datosContacto ? `<p style="margin:0 0 6px; font-size:12px; color:#5a6b67;">${escapeHtml(datosContacto)}</p>` : ""}
        <p style="margin:0; font-size:12px;">
          <a href="${siteUrl}" style="color:#016099; text-decoration:none;">${siteUrl.replace(/^https?:\/\//, "")}</a>
          ${footer?.instagramUrl ? ` · <a href="${footer.instagramUrl}" style="color:#016099; text-decoration:none;">Instagram</a>` : ""}
        </p>
        <p style="margin:10px 0 0; font-size:11px; color:#9aa6a2;">
          Recibiste este correo por ser matriculado o suscriptor del CPT Santa Fe.
        </p>
      </div>
    </div>
  `.trim();
}
