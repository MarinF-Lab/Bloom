import { useState } from "react";
import { ETIQUETAS, TIPOS, nuevoId, type Etiqueta, type Producto } from "../core/modelo";
import { CATS } from "../data/productos";
import { Area, Fila, Interruptor, Numero, Selector, Texto } from "../ui/Campos";
import { BOTON_PELIGRO, BOTON_PRINCIPAL, Hoja, Seccion } from "../ui/Hoja";
import { Trash } from "../ui/icons";

export function productoNuevo(orden: number): Producto {
  return { id: nuevoId("p"), name: "", size: "", sizeShort: "", cat: CATS[0]!, kind: "torta", price: 0, tags: [], desc: "", disponible: true, orden };
}

export function EditorProducto({ inicial, esNuevo, foto, categorias, onGuardar, onBorrar, onSubirFoto, onQuitarFoto, onCerrar }: {
  inicial: Producto;
  esNuevo: boolean;
  foto?: string;
  categorias: string[];
  onGuardar: (p: Producto) => Promise<void>;
  onBorrar: (id: string) => Promise<void>;
  onSubirFoto: (id: string, f: File | undefined) => Promise<void>;
  onQuitarFoto: (id: string) => Promise<void>;
  onCerrar: () => void;
}) {
  const [p, setP] = useState<Producto>(inicial);
  const [nuevaCat, setNuevaCat] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const set = <K extends keyof Producto>(k: K, v: Producto[K]) => setP((x) => ({ ...x, [k]: v }));
  const cats = [...new Set([...CATS, ...categorias, p.cat])];
  const alternar = (t: Etiqueta) => set("tags", p.tags.includes(t) ? p.tags.filter((x) => x !== t) : [...p.tags, t]);

  async function guardar() {
    await onGuardar({ ...p, name: p.name.trim(), cat: nuevaCat.trim() || p.cat, sizeShort: p.sizeShort.trim() || p.size.trim() });
    onCerrar();
  }

  return (
    <Hoja
      titulo={esNuevo ? "Nuevo producto" : p.name || "Producto"}
      onCerrar={onCerrar}
      pie={
        <>
          {!esNuevo && (
            <button type="button" aria-label="Borrar producto" onClick={async () => { if (confirm(`¿Borrar ${p.name} del catálogo?`)) { await onBorrar(p.id); onCerrar(); } }} className={BOTON_PELIGRO}>
              <Trash size={18} />
            </button>
          )}
          <button type="button" disabled={!p.name.trim()} onClick={guardar} className={BOTON_PRINCIPAL}>Guardar</button>
        </>
      }
    >
      <Seccion titulo="En la tienda">
        <Interruptor label="Disponible" nota={p.disponible ? "Se puede pedir." : "Aparece como «Agotado»."} on={p.disponible} onChange={(v) => set("disponible", v)} />
        <div className="flex items-center gap-3">
          <div className="flex size-20 flex-none items-center justify-center overflow-hidden rounded-2xl bg-sand text-[11px] text-muted">
            {foto ? <img src={foto} alt={`Foto de ${p.name}`} className="size-full object-cover" /> : "Sin foto"}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className={"flex min-h-10 cursor-pointer items-center rounded-[20px] bg-rose px-4 text-[13px] font-semibold text-rose-ink" + (subiendo ? " opacity-60" : "")}>
              {subiendo ? "Guardando…" : foto ? "Cambiar foto" : "Subir foto"}
              <input type="file" accept="image/*" className="sr-only" disabled={subiendo} onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; setSubiendo(true); await onSubirFoto(p.id, f); setSubiendo(false); }} />
            </label>
            {foto && <button type="button" onClick={() => onQuitarFoto(p.id)} className="min-h-10 rounded-[20px] border border-line-2 bg-transparent px-4 text-[13px] font-semibold text-muted">Quitar</button>}
          </div>
        </div>
        <p className="m-0 text-[12px] text-muted">La foto se achica sola para que la tienda cargue rápido.</p>
      </Seccion>

      <Seccion titulo="Datos">
        <Texto label="Nombre" value={p.name} onChange={(v) => set("name", v)} />
        <Fila>
          <Numero label="Precio" prefijo="$" value={p.price} onChange={(v) => set("price", v)} />
          <Selector label="Tipo" value={p.kind} opciones={TIPOS} onChange={(v) => set("kind", v)} />
        </Fila>
        <Texto label="Tamaño" value={p.size} onChange={(v) => set("size", v)} placeholder="26 cm · 20 a 25 porciones" />
        <Texto label="Tamaño corto" value={p.sizeShort} onChange={(v) => set("sizeShort", v)} placeholder="26 cm" nota="Se ve en la gestión. Vacío = el tamaño." />
        <Selector label="Categoría" value={p.cat} opciones={cats} onChange={(v) => set("cat", v)} />
        <Texto label="O una categoría nueva" value={nuevaCat} onChange={setNuevaCat} placeholder="Galletas" />
        <Area label="Descripción" value={p.desc} onChange={(v) => set("desc", v)} />
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium">Etiquetas</span>
          <div className="flex flex-wrap gap-2">
            {ETIQUETAS.map((t) => {
              const on = p.tags.includes(t);
              return (
                <button key={t} type="button" aria-pressed={on} onClick={() => alternar(t)} className="min-h-10 rounded-[20px] border px-3.5 text-[13px] font-medium" style={on ? { background: "#6B4A33", color: "#FCF7EC", borderColor: "#6B4A33" } : { background: "#FFFDF8", color: "#6B4A33", borderColor: "#DCCDB8" }}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </Seccion>
    </Hoja>
  );
}
