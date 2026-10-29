import { useEffect, useRef, type ReactNode } from "react";

/** Hoja a pantalla completa sobre la gestión (editar un pedido, un producto, la Configuración…). */
export function Hoja({ titulo, onCerrar, children, pie }: { titulo: string; onCerrar: () => void; children: ReactNode; pie?: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null);
  useEffect(() => {
    caja.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [onCerrar]);
  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-[rgba(78,52,36,0.35)]">
      <div ref={caja} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className="flex h-dvh w-full max-w-[480px] flex-col bg-cream outline-none">
        <header className="flex items-center gap-2 border-b border-line px-3 pt-[max(12px,env(safe-area-inset-top))] pb-2.5">
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="flex size-11 items-center justify-center rounded-full border-none bg-transparent p-0 text-cocoa">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <h2 className="m-0 min-w-0 flex-1 truncate font-display text-[24px] font-semibold">{titulo}</h2>
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-[18px] pt-4 pb-6">{children}</div>
        {pie && <div className="flex gap-2.5 border-t border-line bg-paper px-[18px] pt-3 pb-[max(14px,env(safe-area-inset-bottom))]">{pie}</div>}
      </div>
    </div>
  );
}

export const BOTON_PRINCIPAL = "flex min-h-12 flex-1 items-center justify-center rounded-3xl border-none bg-cocoa px-5 text-[15px] font-medium text-cream disabled:opacity-50";
export const BOTON_SECUNDARIO = "flex min-h-12 items-center justify-center rounded-3xl border border-line-2 bg-transparent px-5 text-[15px] font-medium text-cocoa";
export const BOTON_PELIGRO = "flex min-h-12 items-center justify-center rounded-3xl border border-[#E7B9C6] bg-transparent px-5 text-[15px] font-medium text-rose-deep";

/** Grupo de campos con título. */
export function Seccion({ titulo, children, nota }: { titulo: string; children: ReactNode; nota?: string }) {
  return (
    <section className="flex flex-col gap-3 rounded-[18px] border border-line bg-paper px-4 py-3.5">
      <h3 className="m-0 font-display text-[20px] font-semibold">{titulo}</h3>
      {nota && <p className="m-0 -mt-1.5 text-[12px] text-muted">{nota}</p>}
      {children}
    </section>
  );
}
