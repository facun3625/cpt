"use client";

export function ChatCtaButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("cpt:abrir-chat"))}
      className={className}
    >
      {children}
    </button>
  );
}
