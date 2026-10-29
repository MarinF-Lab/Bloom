import type { ReactNode } from "react";

/** Antetítulo en mayúsculas espaciadas. */
export function Eyebrow({ children, className = "text-olive" }: { children: ReactNode; className?: string }) {
  return <div className={"text-[12px] font-semibold tracking-[0.3em] " + className}>{children}</div>;
}

export function H2({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={"m-0 font-display text-[36px] font-semibold leading-[1.05] sm:text-[44px] " + className}>
      {children}
    </h2>
  );
}

/** Enlaces a WhatsApp e Instagram: se abren en otra pestaña. */
export const externo = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Colores de un botón de opción: activo en cacao, inactivo en papel. */
export function chip(on: boolean) {
  return on
    ? { background: "#6B4A33", color: "#FCF7EC", borderColor: "#6B4A33" }
    : { background: "#FFFDF8", color: "#6B4A33", borderColor: "#DCCDB8" };
}

/** Clases de los campos de formulario. */
export const campo = "min-h-[46px] rounded-[14px] border border-line-2 bg-cream px-3.5 text-[14px] text-ink";
export const area = "rounded-[14px] border border-line-2 bg-cream px-3.5 py-3 text-[14px] text-ink resize-y";
