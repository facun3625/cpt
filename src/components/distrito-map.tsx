"use client";

import { useState } from "react";
import { santaFeDepartamentos, santaFeWidth, santaFeHeight } from "@/lib/santa-fe-map";

export function DistritoMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-md select-none">
      <svg
        viewBox={`0 0 ${santaFeWidth} ${santaFeHeight}`}
        className="h-auto w-full overflow-visible"
        aria-hidden="true"
      >
        {santaFeDepartamentos.map((dep) => {
          const isCapital = dep.nombre === "La Capital";
          const isHovered = hovered === dep.nombre;
          return (
            <path
              key={dep.nombre}
              d={dep.d}
              className={`transition-colors duration-200 ${
                dep.esDistrito1
                  ? isCapital
                    ? "fill-accent-500/25 stroke-accent-500"
                    : `${isHovered ? "fill-primary-400/50" : "fill-primary-400/25"} stroke-primary-600`
                  : "fill-surface stroke-surface-border"
              }`}
              strokeWidth={dep.esDistrito1 ? 1.4 : 1}
              onMouseEnter={() => dep.esDistrito1 && setHovered(dep.nombre)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {santaFeDepartamentos
          .filter((d) => d.esDistrito1)
          .map((dep) => {
            const isCapital = dep.nombre === "La Capital";
            const isHovered = hovered === dep.nombre;
            return (
              <g
                key={dep.nombre}
                transform={`translate(${dep.cx}, ${dep.cy})`}
                onMouseEnter={() => setHovered(dep.nombre)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-default"
              >
                {isHovered && (
                  <circle r="16" className={isCapital ? "fill-accent-500/40" : "fill-primary-600/40"}>
                    <animate attributeName="r" from="16" to="26" dur="0.7s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="0.7s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={isHovered ? "15" : "13"}
                  className={`transition-all duration-300 ${isCapital ? "fill-accent-500" : "fill-primary-600"}`}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-white text-[13px] font-bold"
                >
                  {dep.numero}
                </text>
              </g>
            );
          })}
      </svg>

      {santaFeDepartamentos
        .filter((d) => d.esDistrito1)
        .map((dep) => {
          const isHovered = hovered === dep.nombre;
          return (
            <div
              key={dep.nombre}
              className={`pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-ink-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg transition-all duration-200 ${
                isHovered ? "-translate-y-[calc(100%+8px)] opacity-100" : "-translate-y-[calc(100%-4px)] opacity-0"
              }`}
              style={{
                left: `${(dep.cx / santaFeWidth) * 100}%`,
                top: `${(dep.cy / santaFeHeight) * 100}%`,
              }}
            >
              {dep.nombre}
            </div>
          );
        })}
    </div>
  );
}
