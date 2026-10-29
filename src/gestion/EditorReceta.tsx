import { useState } from "react";
import { TIPOS, nuevoId, type Receta } from "../core/modelo";
import { costoReceta, margen } from "../core/recipes";
import { clp } from "../core/money";
import { Area, Fila, Numero, Selector, Texto } from "../ui/Campos";
import { BOTON_PELIGRO, BOTON_PRINCIPAL, Hoja, Seccion } from "../ui/Hoja";
import { Trash } from "../ui/icons";

export function recetaNueva(): Receta {
  return { id: nuevoId("r"), name: "", kind: "torta", portions: 10, unit: "porciones", price: 0, ingredients: [{ name: "", qty: "", cost: 0 }], steps: [] };
}

export function EditorReceta({ inicial, esNueva, onGuardar, onBorrar, onCerrar }: {
  inicial: Receta;
  esNueva: boolean;
  onGuardar: (r: Receta) => Promise<void>;
  onBorrar: (id: string) => Promise<void>;
  onCerrar: () => void;
}) {
  const [r, setR] = useState<Receta>(inicial);
  const [pasos, setPasos] = useState(inicial.steps.join("\n"));
  const set = <K extends keyof Receta>(k: K, v: Receta[K]) => setR((x) => ({ ...x, [k]: v }));
  const costo = costoReceta(r.ingredients);

  async function guardar() {
    await onGuardar({ ...r, name: r.name.trim(), ingredients: r.ingredients.filter((i) => i.name.trim()), steps: pasos.split("\n").map((s) => s.trim()).filter(Boolean) });
    onCerrar();
  }

  return (
    <Hoja
      titulo={esNueva ? "Nueva receta" : r.name || "Receta"}
      onCerrar={onCerrar}
      pie={
        <>
          {!esNueva && (
            <button type="button" aria-label="Borrar receta" onClick={async () => { if (confirm(`¿Borrar la receta ${r.name}?`)) { await onBorrar(r.id); onCerrar(); } }} className={BOTON_PELIGRO}>
              <Trash size={18} />
            </button>
          )}
          <button type="button" disabled={!r.name.trim()} onClick={guardar} className={BOTON_PRINCIPAL}>Guardar</button>
        </>
      }
    >
      <Seccion titulo="Receta">
        <Texto label="Nombre" value={r.name} onChange={(v) => set("name", v)} placeholder="Torta tres leches 26 cm" />
        <Fila>
          <Numero label="Rinde" value={r.portions} min={1} onChange={(v) => set("portions", Math.max(1, v))} />
          <Texto label="Unidad" value={r.unit} onChange={(v) => set("unit", v)} />
        </Fila>
        <Fila>
          <Numero label="Precio de venta" prefijo="$" value={r.price} onChange={(v) => set("price", v)} />
          <Selector label="Tipo" value={r.kind} opciones={TIPOS} onChange={(v) => set("kind", v)} />
        </Fila>
        <div className="rounded-xl bg-olive-soft px-3 py-2 text-[13px] text-olive-ink">Costo {clp(costo)} · margen {margen(r.price, costo)}%</div>
      </Seccion>

      <Seccion titulo="Ingredientes">
        {r.ingredients.map((ing, k) => (
          <div key={k} className="flex items-end gap-2">
            <div className="min-w-0 flex-[2]"><Texto label={`Ingrediente ${k + 1}`} value={ing.name} onChange={(v) => set("ingredients", r.ingredients.map((x, j) => (j === k ? { ...x, name: v } : x)))} /></div>
            <div className="min-w-0 flex-1"><Texto label="Cantidad" value={ing.qty} onChange={(v) => set("ingredients", r.ingredients.map((x, j) => (j === k ? { ...x, qty: v } : x)))} /></div>
            <div className="min-w-0 flex-1"><Numero label="Costo" value={ing.cost} onChange={(v) => set("ingredients", r.ingredients.map((x, j) => (j === k ? { ...x, cost: v } : x)))} /></div>
            <button type="button" aria-label="Quitar ingrediente" onClick={() => set("ingredients", r.ingredients.filter((_, j) => j !== k))} className="flex size-11 flex-none items-center justify-center rounded-full border-none bg-transparent text-muted"><Trash size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={() => set("ingredients", [...r.ingredients, { name: "", qty: "", cost: 0 }])} className="min-h-11 rounded-2xl border-[1.5px] border-dashed border-[#C9B79F] bg-transparent text-[14px] font-medium text-cocoa">+ Ingrediente</button>
      </Seccion>

      <Seccion titulo="Preparación">
        <Area label="Pasos, uno por línea" value={pasos} onChange={setPasos} rows={6} />
      </Seccion>
    </Hoja>
  );
}
