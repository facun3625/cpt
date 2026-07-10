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

  return (
    <>
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
        <div className="mt-8 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.href}
              type="button"
              aria-label={`Ir a la noticia ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-accent-500" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
