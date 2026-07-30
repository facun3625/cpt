"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function NoticiaImagenLightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block h-32 w-48 overflow-hidden rounded-lg border border-surface-border"
      >
        <Image src={src} alt={alt} fill unoptimized className="object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-ink-900/0 transition-colors group-hover:bg-ink-900/40">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          >
            <path
              d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 text-white/80 transition-colors hover:text-white"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6 18 18M6 18 18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="rounded-lg object-contain"
            style={{ maxHeight: "calc(100vh - 2rem)", maxWidth: "calc(100vw - 2rem)" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
