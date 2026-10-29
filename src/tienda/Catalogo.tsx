import { TAG_STYLE, TINTS, categorias, type Producto } from "../data/productos";
import type { Etiqueta } from "../core/modelo";
import type { Cantidades } from "../core/cart";
import { clp } from "../core/money";
import { BigPan, BigPie, BigPostre, BigTorta } from "../ui/icons";
import { Eyebrow, chip } from "./comun";
import { useTienda } from "./contexto";

const ILUSTRACION = { torta: BigTorta, pie: BigPie, postre: BigPostre, pan: BigPan };

export function Catalogo({ cat, onCat, qty, onAdd }: { cat: string; onCat: (c: string) => void; qty: Cantidades; onAdd: (p: Producto) => void }) {
  const { productos, fotos, config } = useTienda();
  const CATS = ["Todo", ...categorias(productos)];
  const shown = productos.filter((p) => cat === "Todo" || p.cat === cat);
  return (
    <section id="catalogo" className="mx-auto flex max-w-[1180px] flex-col gap-7 px-6 py-[72px]">
      <div className="flex flex-wrap items-end justify-between gap-[18px]">
        <div>
          <Eyebrow>CATÁLOGO</Eyebrow>
          <h2 className="mt-1.5 mb-0 font-display text-[38px] font-semibold leading-[1.05] sm:text-[46px]">Recién salido del horno</h2>
        </div>
        <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCat(c)}
              aria-pressed={c === cat}
              className="min-h-11 rounded-[22px] border px-[18px] text-[14px] font-medium"
              style={chip(c === cat)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[22px]">
        {shown.map((p) => {
          const q = qty[p.id] ?? 0;
          const Ilus = ILUSTRACION[p.kind];
          const tags: Etiqueta[] = p.disponible ? p.tags : ["Agotado"];
          const puede = p.disponible && config.abierta;
          return (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-paper">
              <div className="relative flex h-[170px] items-center justify-center text-cocoa" style={{ background: TINTS[p.kind] }}>
                {fotos[p.id] ? <img src={fotos[p.id]} alt={`Foto de ${p.name}`} className="absolute inset-0 size-full object-cover" /> : <Ilus size={70} />}
                <div className="absolute top-3 right-3 left-3 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="rounded-[11px] px-2.5 py-1 text-[11px] font-semibold" style={{ background: TAG_STYLE[t][0], color: TAG_STYLE[t][1] }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 px-[18px] pt-[18px] pb-5">
                <div className="text-[12px] font-semibold text-olive">{p.size}</div>
                <h3 className="m-0 font-display text-[24px] font-semibold leading-[1.1]">{p.name}</h3>
                <p className="m-0 flex-1 text-[13px] leading-[1.55] text-muted">{p.desc}</p>
                {p.kind === "torta" && <div className="text-[12px] text-rose-ink">Consulta por otros tamaños y porciones.</div>}
                <div className="mt-1.5 flex items-center justify-between gap-2.5">
                  <span className="text-[19px] font-semibold text-cocoa">{clp(p.price)}</span>
                  <button
                    type="button"
                    onClick={() => onAdd(p)}
                    disabled={!puede}
                    aria-label={puede ? `Agregar ${p.name} al pedido` : `${p.name}: ${p.disponible ? "tienda cerrada" : "agotado"}`}
                    className="min-h-11 rounded-[22px] border-none px-[18px] text-[14px] font-medium transition-colors disabled:cursor-not-allowed"
                    style={!puede ? { background: "#ECE6DC", color: "#5E5248" } : q > 0 ? { background: "#E6EAD2", color: "#3F4A1F" } : { background: "#6B4A33", color: "#FCF7EC" }}
                  >
                    {!p.disponible ? "Agotado" : !config.abierta ? "Tienda cerrada" : q > 0 ? `En tu caja · ${q}` : "Agregar"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
