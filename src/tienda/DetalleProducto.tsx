import { useEffect, useRef, useState } from "react";
import { TAG_STYLE, TINTS, type Producto } from "../data/productos";
import type { Etiqueta } from "../core/modelo";
import { clp } from "../core/money";
import { BigPan, BigPie, BigPostre, BigTorta } from "../ui/icons";
import { useTienda } from "./contexto";

const ILUSTRACION = { torta: BigTorta, pie: BigPie, postre: BigPostre, pan: BigPan };
const MAXIMO = 20;

/** Ficha de un producto: foto en grande, cantidad y confirmar. En el celular sube desde abajo. */
export function DetalleProducto({ producto: p, enCaja, onConfirmar, onCerrar }: {
  producto: Producto;
  /** Unidades que ya tiene en la caja (0 si no está). */
  enCaja: number;
  /** Deja en la caja esta cantidad (0 = quitar). */
  onConfirmar: (cantidad: number) => void;
  onCerrar: () => void;
}) {
  const { fotos, config } = useTienda();
  const [cant, setCant] = useState(Math.max(1, enCaja));
  const caja = useRef<HTMLDivElement>(null);
  const foto = fotos[p.id];
  const Ilus = ILUSTRACION[p.kind];
  const tags: Etiqueta[] = p.disponible ? p.tags : ["Agotado"];
  const puede = p.disponible && config.abierta;

  // Esc cierra; el fondo no se mueve mientras la ficha está abierta.
  useEffect(() => {
    caja.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    addEventListener("keydown", esc);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", esc);
      document.body.style.overflow = antes;
    };
  }, [onCerrar]);

  const boton = "flex min-h-[52px] items-center justify-center rounded-[26px] px-5 text-[15px] font-medium";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(78,52,36,0.45)] sm:items-center sm:p-6" onClick={onCerrar}>
      <div
        ref={caja}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-nombre"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[94dvh] w-full max-w-[880px] flex-col overflow-hidden rounded-t-[28px] bg-paper outline-none sm:max-h-[90vh] sm:min-h-[460px] sm:flex-row sm:rounded-[28px]"
      >
        <div className="relative flex aspect-[4/3] w-full flex-none items-center justify-center text-cocoa sm:aspect-auto sm:w-1/2" style={{ background: TINTS[p.kind] }}>
          {foto ? <img src={foto} alt={`Foto de ${p.name}`} className="absolute inset-0 size-full object-cover" /> : <Ilus size={120} />}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 pr-16">
            {tags.map((t) => (
              <span key={t} className="rounded-xl px-3 py-1 text-[12px] font-semibold" style={{ background: TAG_STYLE[t][0], color: TAG_STYLE[t][1] }}>{t}</span>
            ))}
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full border-none bg-paper/90 p-0 text-cocoa shadow-[0_1px_4px_rgba(78,52,36,0.25)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-6 pt-6 pb-4">
            <div className="text-[13px] font-semibold text-olive">{p.size}</div>
            <h2 id="detalle-nombre" className="m-0 font-display text-[32px] font-semibold leading-[1.05]">{p.name}</h2>
            <div className="text-[22px] font-semibold text-cocoa">{clp(p.price)}</div>
            {p.desc && <p className="m-0 text-[15px] leading-[1.6] text-muted">{p.desc}</p>}
            {p.kind === "torta" && <div className="text-[13px] text-rose-ink">Consulta por otros tamaños y porciones.</div>}
          </div>

          <div className="flex flex-col gap-3 border-t border-line px-6 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
            {puede ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-medium">Cantidad</span>
                  <div className="flex items-center rounded-[26px] border border-line-2">
                    <button type="button" onClick={() => setCant((c) => Math.max(1, c - 1))} disabled={cant <= 1} aria-label="Una menos" className="size-12 border-none bg-transparent p-0 text-[22px] text-cocoa disabled:opacity-35">−</button>
                    <span aria-live="polite" className="min-w-8 text-center text-[18px] font-semibold">{cant}</span>
                    <button type="button" onClick={() => setCant((c) => Math.min(MAXIMO, c + 1))} disabled={cant >= MAXIMO} aria-label="Una más" className="size-12 border-none bg-transparent p-0 text-[22px] text-cocoa disabled:opacity-35">+</button>
                  </div>
                </div>
                <button type="button" onClick={() => onConfirmar(cant)} className={boton + " w-full border-none bg-cocoa text-cream"}>
                  {enCaja > 0 ? "Actualizar pedido" : "Agregar al pedido"} · {clp(p.price * cant)}
                </button>
                {enCaja > 0 && (
                  <button type="button" onClick={() => onConfirmar(0)} className="min-h-11 border-none bg-transparent text-[14px] font-medium text-rose-deep underline">
                    Quitar del pedido
                  </button>
                )}
              </>
            ) : (
              <div className={boton + " w-full bg-sand text-muted"} role="status">
                {p.disponible ? "Por ahora no estamos recibiendo pedidos" : "Agotado por ahora"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
