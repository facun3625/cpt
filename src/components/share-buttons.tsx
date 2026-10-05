"use client";

import { useEffect, useRef, useState } from "react";

type Target = { key: string; label: string; href: (url: string, text: string) => string; icon: React.ReactNode };

const enc = encodeURIComponent;

const TARGETS: Target[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: (url, text) => `https://wa.me/?text=${enc(`${text} ${url}`)}`,
    icon: (
      <path
        d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm4.6 12.4c-.2.5-1.1 1-1.5 1-.4.1-.9.1-1.4-.1-.3-.1-.8-.3-1.4-.6-2.4-1-3.9-3.4-4-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c.1.1.1.3 0 .5l-.3.4-.3.3c-.1.1-.2.3-.1.5.1.2.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.1.1.5-.1 1Z"
        fill="currentColor"
      />
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    icon: (
      <path
        d="M14 8.5V7c0-.8.4-1.2 1.2-1.2H17V3h-2.4C12.2 3 11 4.5 11 6.8v1.7H9v3h2V21h3v-9.5h2.4l.6-3H14Z"
        fill="currentColor"
      />
    ),
  },
  {
    key: "x",
    label: "X",
    href: (url, text) => `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`,
    icon: <path d="M17.8 3h3l-6.6 7.5L22 21h-6.1l-4.8-6.2L5.6 21h-3l7-8L2 3h6.2l4.3 5.7L17.8 3Zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5Z" fill="currentColor" />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    icon: <path d="M4.5 9h3.7v11.5H4.5V9ZM6.3 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM10.5 9H14v1.6c.5-1 1.8-1.9 3.6-1.9 3.6 0 4.4 2.4 4.4 5.5v6.3h-3.7v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7h-3.8V9Z" fill="currentColor" />,
  },
  {
    key: "telegram",
    label: "Telegram",
    href: (url, text) => `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`,
    icon: <path d="M21.5 4.3 2.9 11.5c-.9.4-.9 1 0 1.3l4.7 1.5 1.8 5.5c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.5-1.8-1.5-1.3ZM9.2 13.9l9.4-5.9c.4-.3.8-.1.5.2l-7.8 7-.3 3.2-1.8-4.5Z" fill="currentColor" />,
  },
  {
    key: "email",
    label: "Email",
    href: (url, text) => `mailto:?subject=${enc(text)}&body=${enc(`${text}\n${url}`)}`,
    icon: (
      <path
        d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    ),
  },
];

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-white text-ink-600 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700";

function Links({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copiá el link:", url);
    }
  }

  return (
    <>
      {TARGETS.map((t) => (
        <a
          key={t.key}
          href={t.href(url, title)}
          target={t.key === "email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={`Compartir en ${t.label}`}
          title={t.label}
          className={iconBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {t.icon}
          </svg>
        </a>
      ))}
      <button type="button" onClick={copy} aria-label="Copiar link" title={copied ? "¡Copiado!" : "Copiar link"} className={iconBtn}>
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </>
  );
}

/** Fila de íconos para compartir (detalle de la noticia). `url` debe ser absoluta. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Compartir</span>
      <Links url={url} title={title} />
    </div>
  );
}

/** Botón flotante con menú desplegable (tarjetas de listado). */
export function ShareMenu({ url, title, className = "" }: { url: string; title: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function onClick() {
    // En celulares usamos el menú nativo del sistema (incluye Instagram, etc.)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    setOpen((v) => !v);
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Compartir: ${title}`}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink-700 shadow-md ring-1 ring-black/5 transition-colors hover:bg-primary-50 hover:text-primary-700"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-20 grid w-[12.5rem] grid-cols-4 gap-2 rounded-xl border border-surface-border bg-white p-3 shadow-xl">
          <Links url={url} title={title} />
        </div>
      )}
    </div>
  );
}
