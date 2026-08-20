"use client";

import { useEffect, useRef, useState } from "react";
import { renderMessageContent } from "@/components/chat-message-content";

type Message = { role: "user" | "assistant"; content: string };

const SALUDO_INICIAL: Message = {
  role: "assistant",
  content: "¡Hola! Soy el asistente virtual del CPT Santa Fe. ¿En qué te puedo ayudar?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([SALUDO_INICIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading]);

  useEffect(() => {
    const onOpenRequest = () => setOpen(true);
    window.addEventListener("cpt:abrir-chat", onOpenRequest);
    return () => window.removeEventListener("cpt:abrir-chat", onOpenRequest);
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.ok ? data.reply : (data.error ?? "Ocurrió un error.") },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "No se pudo conectar con el asistente." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar asistente virtual" : "Abrir asistente virtual"}
        className={`fixed bottom-20 right-2 z-50 flex h-11 w-11 items-center justify-center gap-2 rounded-full bg-accent-500 text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6 sm:h-14 sm:w-auto ${
          open ? "sm:w-14 sm:justify-center" : "sm:pl-4 sm:pr-5 sm:justify-start"
        }`}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6 18 18M6 18 18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 sm:h-6 sm:w-6">
              <path d="M4 4h16v12H8l-4 4V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="hidden whitespace-nowrap text-sm font-semibold sm:inline">¿Necesitás ayuda?</span>
          </>
        )}
      </button>

      {open && (
        <div className="fixed bottom-32 right-2 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl sm:bottom-24 sm:right-6 sm:max-w-[calc(100vw-3rem)]">
          <div className="bg-primary-900 px-4 py-3">
            <p className="text-sm font-semibold text-white">Asistente virtual CPT</p>
            <p className="text-xs text-white/60">Respuestas basadas en la información del sitio</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-primary-700 text-white" : "bg-surface text-ink-700"
                  }`}
                >
                  {m.role === "assistant" ? renderMessageContent(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-surface px-3 py-2 text-sm text-ink-400">Escribiendo…</div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-surface-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu consulta…"
              className="flex-1 rounded-full border border-surface-border px-4 py-2 text-sm outline-none focus:border-primary-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900 disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
