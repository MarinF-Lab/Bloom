import { useState } from "react";
import { CLIENTS, ESTRELLAS, ORDERS, SUPPLIES, VENTAS_EJEMPLO } from "../data/gestion";
import { ESTADOS, type Estado } from "../core/orders";
import { clp } from "../core/money";

export type Seg = "clientes" | "insumos" | "resumen";
export const SEG_TITULOS: Record<Seg, string> = { clientes: "Clientes", insumos: "Insumos", resumen: "Resumen" };

export function Mas({ seg, onSeg, statuses }: { seg: Seg; onSeg: (s: Seg) => void; statuses: Record<number, Estado> }) {
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
      {seg === "clientes" && <Clientes />}
      {seg === "insumos" && <Insumos />}
      {seg === "resumen" && <Resumen statuses={statuses} />}
    </div>
  );
}

function Clientes() {
  return (
    <div className="flex flex-col gap-2.5">
      {CLIENTS.map((c) => (
        <article key={c.name} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3.5 py-3">
          <div className="flex size-[42px] flex-none items-center justify-center rounded-full bg-rose font-semibold text-rose-ink">{c.name.charAt(0)}</div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold">{c.name}</div>
            <div className="text-[12px] text-muted">{c.orders} pedidos · {c.channel}</div>
          </div>
          <div className="rounded-[10px] px-2 py-1 text-right text-[12px]" style={c.soon ? { background: "#F7DDE3", color: "#7E2F47" } : { background: "#F6EFE3", color: "#6E5644" }}>{c.bday}</div>
        </article>
      ))}
    </div>
  );
}

function Insumos() {
  const [comprado, setComprado] = useState<Record<string, boolean>>({});
  const lista = SUPPLIES.map((x) => {
    const lvl = comprado[x.id] ? 100 : x.level;
    return { ...x, lvl, low: lvl <= 20, amount: comprado[x.id] ? "Repuesto" : x.amount };
  });
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[13px] text-muted">{lista.filter((x) => x.low).length} insumos por comprar</div>
      {lista.map((s) => (
        <article key={s.id} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3.5 py-[11px]">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex justify-between text-[14px]"><span className="font-medium">{s.name}</span><span className="text-[12px] text-muted">{s.amount}</span></div>
            <div className="h-[7px] overflow-hidden rounded bg-sand">
              <div className="h-[7px] rounded" style={{ width: `${Math.max(s.lvl, 3)}%`, background: s.low ? "#A84F68" : s.lvl < 50 ? "#D9A866" : "#A8B07A" }} />
            </div>
          </div>
          {s.low && (
            <button type="button" onClick={() => setComprado((c) => ({ ...c, [s.id]: true }))} className="min-h-9 flex-none rounded-[18px] border-none bg-rose px-3 text-[12px] font-semibold text-rose-ink">Comprado</button>
          )}
        </article>
      ))}
    </div>
  );
}

function Resumen({ statuses }: { statuses: Record<number, Estado> }) {
  const orders = ORDERS.map((o) => ({ ...o, status: statuses[o.id] ?? o.status }));
  const total = orders.reduce((a, o) => a + o.price, 0);
  const cobrado = orders.filter((o) => o.status === "entregado").reduce((a, o) => a + o.price, 0);
  const filas = ESTADOS.map((e) => ({ ...e, count: orders.filter((o) => o.status === e.key).length }));
  const max = Math.max(1, ...filas.map((f) => f.count));
  const tarjeta = "rounded-2xl border border-line bg-paper px-3.5 py-3";
  const cifra = "font-display text-[26px] font-semibold";
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">
        <div className={tarjeta}><div className="text-[12px] text-muted">Hoy</div><div className={cifra}>{clp(total)}</div></div>
        <div className={tarjeta}><div className="text-[12px] text-muted">Ya cobrado hoy</div><div className={cifra}>{clp(cobrado)}</div></div>
        <div className={tarjeta}><div className="text-[12px] text-muted">Esta semana</div><div className={cifra}>{VENTAS_EJEMPLO.semana}</div></div>
        <div className={tarjeta}><div className="text-[12px] text-muted">{VENTAS_EJEMPLO.mes}</div><div className={cifra}>{VENTAS_EJEMPLO.totalMes}</div></div>
      </div>
      <div className="text-[11px] text-muted">Semana y mes con cifras de ejemplo.</div>
      <section className="flex flex-col gap-2.5 rounded-2xl border border-line bg-paper px-4 py-3.5">
        <div className="font-display text-[20px] font-semibold">Pedidos de hoy por estado</div>
        {filas.map((f) => (
          <div key={f.key} className="flex flex-col gap-[5px]">
            <div className="flex justify-between text-[13px]"><span>{f.label}</span><span className="font-semibold">{f.count}</span></div>
            <div className="h-[9px] overflow-hidden rounded-[5px] bg-sand">
              <div className="h-[9px] rounded-[5px]" style={{ width: `${Math.round((f.count / max) * 100)}%`, background: f.bar }} />
            </div>
          </div>
        ))}
      </section>
      <section className="flex flex-col gap-1.5 rounded-2xl bg-rose px-4 py-3.5">
        <div className="text-[12px] text-rose-ink">Productos estrella</div>
        <div className="font-display text-[19px] font-semibold">{ESTRELLAS}</div>
      </section>
    </div>
  );
}
