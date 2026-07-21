"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroSlide = {
  title: string;
  excerpt: string;
  href: string;
  cta?: string;
};

export function HeroNewsSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div key={index} className="flex flex-col items-center">
        <h1 className="animate-fade-in-up text-2xl font-semibold leading-tight text-white sm:text-4xl">
          {slide.title}
        </h1>
        <p
          className="animate-fade-in-up mt-4 max-w-xl text-base text-white/75 sm:text-lg"
          style={{ animationDelay: "0.15s" }}
        >
          {slide.excerpt}
        </p>
        <Link
          href={slide.href}
          className="animate-fade-in-up mt-8 rounded-full bg-accent-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          style={{ animationDelay: "0.3s" }}
        >
          {slide.cta ?? "Ingresar"}
        </Link>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Noticia anterior"
            onClick={prev}
            className="absolute -left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:-left-14"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Noticia siguiente"
            onClick={next}
            className="absolute -right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:-right-14"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
