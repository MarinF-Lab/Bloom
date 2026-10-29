import { useState } from "react";
import { CANALES, nuevoId, type Config, type ItemPedido, type Pedido, type Producto } from "../core/modelo";
import { ESTADOS, type Estado } from "../core/orders";
import { clp } from "../core/money";
import { Area, Fila, Interruptor, Numero, Selector, Texto } from "../ui/Campos";
import { BOTON_PELIGRO, BOTON_PRINCIPAL, Hoja, Seccion } from "../ui/Hoja";
import { Trash } from "../ui/icons";

export function pedidoNuevo(hoy: string): Pedido {
  return {
    id: nuevoId("o"), cliente: "", whatsapp: "", producto: "", items: [], precio: 0, abono: 0, fecha: hoy, hora: "",
    canal: "WhatsApp", entrega: "", notas: "", estado: "pendiente", urgente: false, origen: "gestion", nuevo: false,
    rechazado: false, creado: new Date().toISOString(),
  };
}

const sumaItems = (items: ItemPedido[]) => items.reduce((a, i) => a + i.cant * i.precio, 0);
const resumenItems = (items: ItemPedido[]) => items.map((i) => `${i.cant > 1 ? i.cant + " x " : ""}${i.nombre}`).join(", ");

export function EditorPedido({ inicial, esNuevo, catalogo, config, onGuardar, onBorrar, onCerrar }: {
  inicial: Pedido;
  esNuevo: boolean;
  catalogo: Producto[];
  config: Config;
  onGuardar: (p: Pedido) => Promise<void>;
  onBorrar: (id: string) => Promise<void>;
  onCerrar: () => void;
}) {
  const [p, setP] = useState<Pedido>(inicial);
  const set = <K extends keyof Pedido>(k: K, v: Pedido[K]) => setP((x) => ({ ...x, [k]: v }));
  const [agregar, setAgregar] = useState("");

  function cambiarItems(items: ItemPedido[]) {
    setP((x) => ({ ...x, items, producto: items.length ? resumenItems(items) : x.producto, precio: items.length ? sumaItems(items) : x.precio }));
  }
  function agregarDelCatalogo(id: string) {
    const prod = catalogo.find((c) => c.id === id);
    if (!prod) return;
    const ya = p.items.find((i) => i.nombre === prod.name);
    cambiarItems(ya ? p.items.map((i) => (i === ya ? { ...i, cant: i.cant + 1 } : i)) : [...p.items, { nombre: prod.name, cant: 1, precio: prod.price }]);
    setAgregar("");
  }

  const valido = p.cliente.trim() !== "" && (p.producto.trim() !== "" || p.items.length > 0);
  const entregas = [...new Set(["", ...config.zonas.map((z) => z.label), p.entrega])];

  return (
    <Hoja
      titulo={esNuevo ? "Nuevo pedido" : "Pedido"}
      onCerrar={onCerrar}
      pie={
        <>
          {!esNuevo && (
            <button type="button" aria-label="Borrar pedido" onClick={async () => { if (confirm(`¿Borrar el pedido de ${p.cliente}?`)) { await onBorrar(p.id); onCerrar(); } }} className={BOTON_PELIGRO}>
              <Trash size={18} />
            </button>
          )}
          <button type="button" disabled={!valido} onClick={async () => { await onGuardar({ ...p, cliente: p.cliente.trim() }); onCerrar(); }} className={BOTON_PRINCIPAL}>
            Guardar
          </button>
        </>
      }
    >
      {p.origen === "tienda" && <div className="rounded-xl bg-rose-soft px-3 py-2 text-[13px] text-rose-ink">Pedido hecho desde la tienda.</div>}
      <Seccion titulo="Cliente">
        <Texto label="Nombre" value={p.cliente} onChange={(v) => set("cliente", v)} autoComplete="off" />
        <Fila>
          <Texto label="WhatsApp" value={p.whatsapp} onChange={(v) => set("whatsapp", v)} inputMode="tel" />
          <Selector label="Canal" value={p.canal} opciones={[...new Set([...CANALES, p.canal])]} onChange={(v) => set("canal", v)} />
        </Fila>
      </Seccion>

      <Seccion titulo="Qué pidió">
        {p.items.map((it, k) => (
          <div key={k} className="flex items-center gap-2 border-b border-dashed border-line pb-2 text-[14px]">
            <span className="min-w-0 flex-1">{it.nombre}<span className="block text-[12px] text-muted">{clp(it.precio)} c/u</span></span>
            <div className="flex items-center rounded-[22px] border border-line">
              <button type="button" aria-label={`Quitar uno de ${it.nombre}`} onClick={() => cambiarItems(it.cant > 1 ? p.items.map((x, j) => (j === k ? { ...x, cant: x.cant - 1 } : x)) : p.items.filter((_, j) => j !== k))} className="size-10 border-none bg-transparent text-[18px] text-cocoa">−</button>
              <span className="min-w-5 text-center font-semibold">{it.cant}</span>
              <button type="button" aria-label={`Agregar otro ${it.nombre}`} onClick={() => cambiarItems(p.items.map((x, j) => (j === k ? { ...x, cant: x.cant + 1 } : x)))} className="size-10 border-none bg-transparent text-[18px] text-cocoa">+</button>
            </div>
          </div>
        ))}
        <Selector
          label="Agregar del catálogo"
          value={agregar}
          opciones={[{ key: "", label: "Elegir producto…" }, ...catalogo.map((c) => ({ key: c.id, label: `${c.name} · ${clp(c.price)}` }))]}
          onChange={agregarDelCatalogo}
        />
        {p.items.length === 0 && <Texto label="O escríbelo" value={p.producto} onChange={(v) => set("producto", v)} placeholder="Torta tres leches 26 cm" />}
        <Fila>
          <Numero label="Total" prefijo="$" value={p.precio} onChange={(v) => set("precio", v)} />
          <Numero label="Abonado" prefijo="$" value={p.abono} onChange={(v) => set("abono", v)} />
        </Fila>
      </Seccion>

      <Seccion titulo="Entrega">
        <Fila>
          <Texto label="Fecha" type="date" value={p.fecha} onChange={(v) => set("fecha", v)} />
          <Texto label="Hora" type="time" value={p.hora} onChange={(v) => set("hora", v)} />
        </Fila>
        <Selector label="Forma de entrega" value={p.entrega} opciones={entregas.map((e) => ({ key: e, label: e || "Sin definir" }))} onChange={(v) => set("entrega", v)} />
        <Selector label="Estado" value={p.estado} opciones={ESTADOS.map((e) => ({ key: e.key as Estado, label: e.label }))} onChange={(v) => set("estado", v)} />
        <Interruptor label="Urgente" on={p.urgente} onChange={(v) => set("urgente", v)} />
        <Area label="Notas" value={p.notas} onChange={(v) => set("notas", v)} rows={2} placeholder="Dedicatoria, decoración, dirección…" />
      </Seccion>
    </Hoja>
  );
}
