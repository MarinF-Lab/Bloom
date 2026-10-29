import { useState } from "react";
import { AVISO_MANANA, ORDERS } from "../data/gestion";
import { CUPOS_POR_DIA, ESTADOS, filtrar, infoEstado, siguienteEstado, textoCupos, type Estado, type Filtro } from "../core/orders";
import { clp } from "../core/money";
import { Bell, ChevronRight } from "../ui/icons";

export function Pedidos({ statuses, onStatus }: { statuses: Record<number, Estado>; onStatus: (id: number, s: Estado) => void }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const orders = ORDERS.map((o) => ({ ...o, status: statuses[o.id] ?? o.status }));
  const visibles = filtrar(orders, filtro);
  const total = orders.reduce((a, o) => a + o.price, 0);
  const urgentes = orders.filter((o) => o.urgent).length;
  const filtros: { key: Filtro; label: string }[] = [{ key: "todos", label: "Todos" }, { key: "urgentes", label: "Urgentes" }, ...ESTADOS.map((e) => ({ key: e.key, label: e.label }))];

  return (
    <div className="flex flex-col gap-3">
      <section className="flex flex-col gap-2.5 rounded-[22px] bg-cocoa px-[18px] py-4 text-cream">
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <div className="text-[11px] tracking-[0.14em] text-foam uppercase">Cupos de hoy</div>
            <div className="font-display text-[32px] font-semibold leading-[1.1]">{orders.length} de {CUPOS_POR_DIA} pedidos</div>
            <div className="text-[13px] text-foam">{clp(total)} en ventas</div>
          </div>
          {urgentes > 0 && <span className="rounded-xl bg-rose px-2.5 py-1.5 text-[12px] font-semibold text-rose-ink">{urgentes} urgente{urgentes > 1 ? "s" : ""}</span>}
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: CUPOS_POR_DIA }, (_, i) => (
            <span key={i} className="h-2 flex-1 rounded" style={{ background: i < orders.length ? "#F2B8C6" : "rgba(252,247,236,0.25)" }} />
          ))}
        </div>
        <div className="text-[12px] text-foam">{textoCupos(orders.length)}</div>
      </section>

      <section className="flex items-start gap-2.5 rounded-[18px] bg-olive-soft px-3.5 py-3 text-olive-ink">
        <Bell size={20} className="mt-px flex-none" />
        <div className="text-[13px] leading-[1.45]"><strong className="font-semibold">{AVISO_MANANA.title}</strong> {AVISO_MANANA.text}</div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-0.5">
        {filtros.map((f) => {
          const on = f.key === filtro;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFiltro(f.key)}
              aria-pressed={on}
              className="min-h-10 flex-none rounded-[20px] border px-3.5 text-[13px] font-medium whitespace-nowrap"
              style={on ? { background: "#6B4A33", color: "#FCF7EC", borderColor: "#6B4A33" } : { background: "#FFFDF8", color: "#6B4A33", borderColor: "#EADFCB" }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {visibles.map((o) => {
        const e = infoEstado(o.status);
        return (
          <article key={o.id} className="flex flex-col gap-2 rounded-[18px] border bg-paper px-[15px] py-[13px]" style={{ borderColor: o.urgent ? "#A84F68" : "#EADFCB" }}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-[15px] font-semibold">{o.client}</span>
                {o.urgent && <span className="rounded-[9px] bg-rose-deep px-2 py-0.5 text-[10.5px] font-semibold text-paper">URGENTE</span>}
              </div>
              <div className="text-[15px] font-semibold text-cocoa">{clp(o.price)}</div>
            </div>
            <div className="font-display text-[20px] font-semibold leading-[1.15]">{o.product}</div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-[12px] leading-[1.4] text-muted">
                {o.when} · {o.channel}
                <br />
                {o.delivery}
              </div>
              <button
                type="button"
                onClick={() => onStatus(o.id, siguienteEstado(o.status))}
                aria-label={`Cambiar estado del pedido de ${o.client}: ${e.label}`}
                className="flex min-h-9 flex-none items-center gap-1 rounded-[18px] border-none px-3 text-[12px] font-semibold"
                style={{ background: e.bg, color: e.fg }}
              >
                {e.label}
                <ChevronRight size={12} />
              </button>
            </div>
          </article>
        );
      })}
      {visibles.length === 0 && <div className="px-3 py-7 text-center text-[14px] text-muted">No hay pedidos en este estado.</div>}
      <div className="text-center text-[11px] text-muted">Toca el estado de un pedido para avanzarlo.</div>
    </div>
  );
}
