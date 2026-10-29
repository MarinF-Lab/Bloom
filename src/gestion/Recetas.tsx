import { useState } from "react";
import type { Receta } from "../core/modelo";
import { TINTS } from "../data/productos";
import { costoPorPorcion, costoReceta, margen } from "../core/recipes";
import { clp } from "../core/money";
import { Book, ChevronDown } from "../ui/icons";

const ROTULO = "text-[11px] font-semibold tracking-[0.12em] text-olive uppercase";

export function Recetas({ recetas, onEditar, onNueva }: { recetas: Receta[]; onEditar: (r: Receta) => void; onNueva: () => void }) {
  const [abierta, setAbierta] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-rose-soft px-3 py-2 text-[12px] text-rose-ink">Revisa que los costos sean los tuyos: el margen se calcula con ellos.</div>
      {recetas.map((r) => {
        const costo = costoReceta(r.ingredients);
        const open = abierta === r.id;
        return (
          <article key={r.id} className="overflow-hidden rounded-[18px] border border-line bg-paper">
            <button type="button" onClick={() => setAbierta(open ? null : r.id)} aria-expanded={open} className="flex w-full items-center gap-3 border-none bg-transparent px-3.5 py-[13px] text-left text-ink">
              <div className="flex size-[42px] flex-none items-center justify-center rounded-xl text-cocoa" style={{ background: TINTS[r.kind] }}>
                <Book size={21} sw={1.7} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[19px] font-semibold leading-[1.15]">{r.name}</div>
                <div className="mt-0.5 text-[12px] text-muted">Rinde {r.portions} {r.unit}</div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-semibold">{clp(costo)}</div>
                <div className="text-[11px] text-muted">costo</div>
              </div>
              <ChevronDown size={16} className="flex-none text-faint transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} />
            </button>
            {open && (
              <div className="flex flex-col gap-3 px-3.5 pb-3.5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-sand-2 px-2.5 py-2"><div className="text-[10px] text-muted">Por porción</div><div className="text-[14px] font-semibold">{clp(costoPorPorcion(costo, r.portions))}</div></div>
                  <div className="rounded-xl bg-sand-2 px-2.5 py-2"><div className="text-[10px] text-muted">Precio venta</div><div className="text-[14px] font-semibold">{clp(r.price)}</div></div>
                  <div className="rounded-xl bg-olive-soft px-2.5 py-2 text-olive-ink"><div className="text-[10px]">Margen</div><div className="text-[14px] font-semibold">{margen(r.price, costo)}%</div></div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className={ROTULO}>Ingredientes</div>
                  {r.ingredients.map(({ name, qty, cost: c }, k) => (
                    <div key={k} className="flex gap-2 border-b border-dashed border-line py-[5px] text-[13px]">
                      <span className="min-w-0 flex-1">{name}</span>
                      <span className="text-muted">{qty}</span>
                      <span className="w-[58px] text-right font-medium">{clp(c)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <div className={ROTULO}>Preparación</div>
                  {r.steps.map((t, k) => (
                    <div key={k} className="flex gap-2.5 text-[13px] leading-[1.5]">
                      <span className="flex size-[22px] flex-none items-center justify-center rounded-full bg-rose text-[11px] font-semibold text-rose-ink">{k + 1}</span>
                      <span className="min-w-0 flex-1">{t}</span>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => onEditar(r)} className="min-h-10 self-start rounded-[20px] border border-line-2 bg-transparent px-4 text-[13px] font-semibold text-cocoa">Editar receta</button>
              </div>
            )}
          </article>
        );
      })}
      <button type="button" onClick={onNueva} className="min-h-12 rounded-[18px] border-[1.5px] border-dashed border-[#C9B79F] bg-transparent text-[14px] font-medium text-cocoa">+ Nueva receta</button>
    </div>
  );
}
