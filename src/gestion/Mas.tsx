import { useState, type ReactNode } from "react";
import { idCliente, nuevoId, type Cliente, type Insumo } from "../core/modelo";
import { confirmados, ventas } from "../core/orders";
import { cumpleCorto, esCumple, inicioSemana, nombreMes, sumarDias } from "../core/fechas";
import { clp } from "../core/money";
import type { UsoDatos } from "../store/useDatos";
import { Texto } from "../ui/Campos";
import { BOTON_PELIGRO, BOTON_PRINCIPAL, Hoja, Seccion } from "../ui/Hoja";
import { Trash } from "../ui/icons";

export type Seg = "clientes" | "insumos" | "resumen";
export const SEG_TITULOS: Record<Seg, string> = { clientes: "Clientes", insumos: "Insumos", resumen: "Resumen" };

const AGREGAR = "min-h-12 rounded-[18px] border-[1.5px] border-dashed border-[#C9B79F] bg-transparent text-[14px] font-medium text-cocoa";

export function Mas({ seg, onSeg, d, hoy }: { seg: Seg; onSeg: (s: Seg) => void; d: UsoDatos; hoy: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label="Sección" className="grid grid-cols-3 gap-1 rounded-[22px] bg-sand p-1">
        {(Object.keys(SEG_TITULOS) as Seg[]).map((k) => {
          const on = k === seg;
          return (
            <button key={k} type="button" onClick={() => onSeg(k)} aria-pressed={on} className="min-h-10 rounded-[18px] border-none text-[13px] font-medium" style={{ background: on ? "#FFFDF8" : "transparent", color: on ? "#4E3424" : "#6E5644" }}>
              {SEG_TITULOS[k]}
            </button>
          );
        })}
      </div>
      {seg === "clientes" && <Clientes d={d} hoy={hoy} />}
      {seg === "insumos" && <Insumos d={d} />}
      {seg === "resumen" && <Resumen d={d} hoy={hoy} />}
    </div>
  );
}

function Clientes({ d, hoy }: { d: UsoDatos; hoy: string }) {
  const [editando, setEditando] = useState<{ c: Cliente; nuevo: boolean } | null>(null);
  const conteo = new Map<string, number>();
  for (const p of confirmados(d.pedidos)) conteo.set(idCliente(p.cliente), (conteo.get(idCliente(p.cliente)) ?? 0) + 1);
  const proximos = new Set([0, 1, 2, 3, 4, 5, 6, 7].map((n) => sumarDias(hoy, n)));
  return (
    <div className="flex flex-col gap-2.5">
      {d.clientes.length === 0 && <div className="px-3 py-5 text-center text-[14px] text-muted">Los clientes se agregan solos al guardar sus pedidos.</div>}
      {d.clientes.map((c) => {
        const pronto = [...proximos].some((f) => esCumple(c.cumple, f));
        return (
          <button key={c.id} type="button" onClick={() => setEditando({ c, nuevo: false })} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3.5 py-3 text-left text-ink">
            <span className="flex size-[42px] flex-none items-center justify-center rounded-full bg-rose font-semibold text-rose-ink">{c.name.charAt(0)}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold">{c.name}</span>
              <span className="block text-[12px] text-muted">{conteo.get(c.id) ?? 0} pedidos{c.canal ? " · " + c.canal : ""}</span>
            </span>
            <span className="rounded-[10px] px-2 py-1 text-right text-[12px]" style={pronto ? { background: "#F7DDE3", color: "#7E2F47" } : { background: "#F6EFE3", color: "#6E5644" }}>
              {pronto ? "Cumple " : ""}{cumpleCorto(c.cumple)}
            </span>
          </button>
        );
      })}
      <button type="button" onClick={() => setEditando({ c: { id: "", name: "", whatsapp: "", canal: "", cumple: "" }, nuevo: true })} className={AGREGAR}>+ Cliente</button>
      {editando && (
        <EditorSimple
          titulo={editando.nuevo ? "Nuevo cliente" : editando.c.name}
          onCerrar={() => setEditando(null)}
          onBorrar={editando.nuevo ? undefined : () => d.borrarCliente(editando.c.id)}
          puedeGuardar={(x: Cliente) => x.name.trim() !== ""}
          inicial={editando.c}
          onGuardar={(x: Cliente) => d.guardarCliente({ ...x, name: x.name.trim(), id: x.id || idCliente(x.name) })}
          campos={(x, set) => (
            <>
              <Texto label="Nombre" value={x.name} onChange={(v) => set({ ...x, name: v })} />
              <Texto label="WhatsApp" value={x.whatsapp} inputMode="tel" onChange={(v) => set({ ...x, whatsapp: v })} />
              <Texto label="Canal" value={x.canal} onChange={(v) => set({ ...x, canal: v })} placeholder="WhatsApp, Instagram…" />
              <Texto label="Cumpleaños" type="date" value={x.cumple} onChange={(v) => set({ ...x, cumple: v })} nota="Solo importan el día y el mes." />
            </>
          )}
        />
      )}
    </div>
  );
}

function Insumos({ d }: { d: UsoDatos }) {
  const [editando, setEditando] = useState<{ i: Insumo; nuevo: boolean } | null>(null);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[13px] text-muted">{d.insumos.filter((x) => x.level <= 20).length} insumos por comprar</div>
      {d.insumos.map((s) => {
        const low = s.level <= 20;
        return (
          <article key={s.id} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3.5 py-[11px]">
            <button type="button" onClick={() => setEditando({ i: s, nuevo: false })} aria-label={`Editar ${s.name}`} className="flex min-w-0 flex-1 flex-col gap-1.5 border-none bg-transparent p-0 text-left text-ink">
              <span className="flex w-full justify-between text-[14px]"><span className="font-medium">{s.name}</span><span className="text-[12px] text-muted">{s.amount}</span></span>
              <span className="block h-[7px] w-full overflow-hidden rounded bg-sand">
                <span className="block h-[7px] rounded" style={{ width: `${Math.max(s.level, 3)}%`, background: low ? "#A84F68" : s.level < 50 ? "#D9A866" : "#A8B07A" }} />
              </span>
            </button>
            {low && <button type="button" onClick={() => d.guardarInsumo({ ...s, level: 100 })} className="min-h-9 flex-none rounded-[18px] border-none bg-rose px-3 text-[12px] font-semibold text-rose-ink">Comprado</button>}
          </article>
        );
      })}
      <button type="button" onClick={() => setEditando({ i: { id: nuevoId("s"), name: "", amount: "", level: 100 }, nuevo: true })} className={AGREGAR}>+ Insumo</button>
      {editando && (
        <EditorSimple
          titulo={editando.nuevo ? "Nuevo insumo" : editando.i.name}
          onCerrar={() => setEditando(null)}
          onBorrar={editando.nuevo ? undefined : () => d.borrarInsumo(editando.i.id)}
          puedeGuardar={(x: Insumo) => x.name.trim() !== ""}
          inicial={editando.i}
          onGuardar={(x: Insumo) => d.guardarInsumo({ ...x, name: x.name.trim() })}
          campos={(x, set) => (
            <>
              <Texto label="Nombre" value={x.name} onChange={(v) => set({ ...x, name: v })} />
              <Texto label="Cuánto queda" value={x.amount} onChange={(v) => set({ ...x, amount: v })} placeholder="2 kg" />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nivel" className="text-[13px] font-medium">Nivel: {x.level}%</label>
                <input id="nivel" type="range" min={0} max={100} step={5} value={x.level} onChange={(e) => set({ ...x, level: Number(e.target.value) })} className="w-full accent-cocoa" />
                <span className="text-[12px] text-muted">Con 20% o menos aparece «por comprar».</span>
              </div>
            </>
          )}
        />
      )}
    </div>
  );
}

function Resumen({ d, hoy }: { d: UsoDatos; hoy: string }) {
  const lunes = inicioSemana(hoy);
  const v = ventas(d.pedidos, hoy, lunes, sumarDias(lunes, 6));
  const max = Math.max(1, ...v.porEstado.map((f) => f.count));
  const tarjeta = "rounded-2xl border border-line bg-paper px-3.5 py-3";
  const cifra = "font-display text-[26px] font-semibold";
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">
        <div className={tarjeta}><div className="text-[12px] text-muted">Hoy</div><div className={cifra}>{clp(v.hoy)}</div></div>
        <div className={tarjeta}><div className="text-[12px] text-muted">Ya entregado hoy</div><div className={cifra}>{clp(v.cobradoHoy)}</div></div>
        <div className={tarjeta}><div className="text-[12px] text-muted">Esta semana</div><div className={cifra}>{clp(v.semana)}</div></div>
        <div className={tarjeta}><div className="text-[12px] text-muted">{nombreMes(hoy)}</div><div className={cifra}>{clp(v.mes)}</div></div>
      </div>
      <div className="text-[11px] text-muted">Por fecha de entrega, sin pedidos rechazados ni por confirmar.</div>
      <section className="flex flex-col gap-2.5 rounded-2xl border border-line bg-paper px-4 py-3.5">
        <div className="font-display text-[20px] font-semibold">Pedidos de hoy por estado</div>
        {v.porEstado.map((f) => (
          <div key={f.key} className="flex flex-col gap-[5px]">
            <div className="flex justify-between text-[13px]"><span>{f.label}</span><span className="font-semibold">{f.count}</span></div>
            <div className="h-[9px] overflow-hidden rounded-[5px] bg-sand"><div className="h-[9px] rounded-[5px]" style={{ width: `${Math.round((f.count / max) * 100)}%`, background: f.bar }} /></div>
          </div>
        ))}
      </section>
      {v.estrellas.length > 0 && (
        <section className="flex flex-col gap-1.5 rounded-2xl bg-rose px-4 py-3.5">
          <div className="text-[12px] text-rose-ink">Productos estrella</div>
          <div className="font-display text-[19px] font-semibold">{v.estrellas.join(" · ")}</div>
        </section>
      )}
    </div>
  );
}

/** Hoja de edición con Guardar y Borrar para registros sencillos (clientes, insumos). */
function EditorSimple<T>({ titulo, inicial, campos, puedeGuardar, onGuardar, onBorrar, onCerrar }: {
  titulo: string;
  inicial: T;
  campos: (x: T, set: (x: T) => void) => ReactNode;
  puedeGuardar: (x: T) => boolean;
  onGuardar: (x: T) => Promise<void>;
  onBorrar?: () => Promise<void>;
  onCerrar: () => void;
}) {
  const [x, setX] = useState<T>(inicial);
  return (
    <Hoja
      titulo={titulo || "Editar"}
      onCerrar={onCerrar}
      pie={
        <>
          {onBorrar && (
            <button type="button" aria-label="Borrar" onClick={async () => { if (confirm(`¿Borrar ${titulo}?`)) { await onBorrar(); onCerrar(); } }} className={BOTON_PELIGRO}>
              <Trash size={18} />
            </button>
          )}
          <button type="button" disabled={!puedeGuardar(x)} onClick={async () => { await onGuardar(x); onCerrar(); }} className={BOTON_PRINCIPAL}>Guardar</button>
        </>
      }
    >
      <Seccion titulo="Datos">{campos(x, setX)}</Seccion>
    </Hoja>
  );
}
