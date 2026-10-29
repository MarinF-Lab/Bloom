import { TAG_STYLE, TINTS } from "../data/productos";
import type { Etiqueta, Producto } from "../core/modelo";
import { clp } from "../core/money";
import type { UsoDatos } from "../store/useDatos";
import { Cake } from "../ui/icons";
import { Switch } from "../ui/Switch";

export function Catalogo({ d, onEditar, onNuevo }: { d: UsoDatos; onEditar: (p: Producto) => void; onNuevo: () => void }) {
  const disponibles = d.catalogo.filter((p) => p.disponible).length;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[13px] text-muted">{disponibles} de {d.catalogo.length} productos disponibles en la tienda</div>
      {d.catalogo.map((p) => {
        const tags: Etiqueta[] = p.disponible ? p.tags : ["Agotado"];
        const foto = d.fotos[p.id];
        return (
          <article key={p.id} className="flex items-center gap-3 rounded-[18px] border border-line bg-paper py-3 pr-2 pl-3">
            <button type="button" onClick={() => onEditar(p)} aria-label={`Editar ${p.name}`} className="flex min-w-0 flex-1 items-center gap-3 border-none bg-transparent p-0 text-left text-ink">
              <span className="flex size-[52px] flex-none items-center justify-center overflow-hidden rounded-[14px] text-cocoa" style={{ background: TINTS[p.kind] }}>
                {foto ? <img src={foto} alt="" className="size-full object-cover" /> : <Cake size={26} sw={1.6} />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-display text-[18px] font-semibold leading-[1.1]">{p.name}</span>
                <span className="text-[12px] text-muted">{p.sizeShort ? p.sizeShort + " · " : ""}{clp(p.price)}</span>
                {tags.length > 0 && (
                  <span className="flex flex-wrap gap-1">
                    {tags.map((t) => <span key={t} className="rounded-[9px] px-2 py-0.5 text-[10px] font-semibold" style={{ background: TAG_STYLE[t][0], color: TAG_STYLE[t][1] }}>{t}</span>)}
                  </span>
                )}
              </span>
            </button>
            <Switch on={p.disponible} label={`Mostrar ${p.name} en la tienda`} onToggle={() => d.guardarProducto({ ...p, disponible: !p.disponible })} />
          </article>
        );
      })}
      <button type="button" onClick={onNuevo} className="min-h-12 rounded-[18px] border-[1.5px] border-dashed border-[#C9B79F] bg-transparent text-[14px] font-medium text-cocoa">+ Nuevo producto</button>
      <div className="text-center text-[11px] text-muted">Toca un producto para editarlo o subir su foto. Al apagarlo aparece como «Agotado» en la tienda.</div>
    </div>
  );
}
