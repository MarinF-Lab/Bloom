import { useState } from "react";
import type { Pedido } from "../core/modelo";
import { ESTADOS, delDia, filtrar, infoEstado, porHacer, siguienteEstado, textoCupos, type Filtro } from "../core/orders";
import { diaRelativo, esCumple, nombreDia, sumarDias } from "../core/fechas";
import { clp } from "../core/money";
import type { UsoDatos } from "../store/useDatos";
import { Bell, ChevronRight } from "../ui/icons";

export function Pedidos({ d, hoy, onEditar }: { d: UsoDatos; hoy: string; onEditar: (p: Pedido) => void }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const cupos = d.config.cuposPorDia;
  const nuevos = d.pedidos.filter((p) => p.nuevo && !p.rechazado).sort((a, b) => a.creado.localeCompare(b.creado));
  const deHoy = delDia(d.pedidos, hoy);
  const lista = filtrar(porHacer(d.pedidos, hoy), filtro);
  const urgentes = deHoy.filter((o) => o.urgente).length;
  const manana = sumarDias(hoy, 1);
  const entregasManana = delDia(d.pedidos, manana).length;
  const cumpleanos = d.ajustes.recordatorios.cumple ? d.clientes.filter((c) => esCumple(c.cumple, manana)).map((c) => c.name) : [];
  const avisoManana = d.ajustes.recordatorios.dia || cumpleanos.length > 0;
  const filtros: { key: Filtro; label: string }[] = [{ key: "todos", label: "Todos" }, { key: "urgentes", label: "Urgentes" }, ...ESTADOS.map((e) => ({ key: e.key, label: e.label }))];

  return (
    <div className="flex flex-col gap-3">
      <section className="flex flex-col gap-2.5 rounded-[22px] bg-cocoa px-[18px] py-4 text-cream">
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <div className="text-[11px] tracking-[0.14em] text-foam uppercase">Cupos de hoy</div>
            <div className="font-display text-[32px] font-semibold leading-[1.1]">{deHoy.length} de {cupos} pedidos</div>
            <div className="text-[13px] text-foam">{clp(deHoy.reduce((a, o) => a + o.precio, 0))} en ventas</div>
          </div>
          {urgentes > 0 && <span className="rounded-xl bg-rose px-2.5 py-1.5 text-[12px] font-semibold text-rose-ink">{urgentes} urgente{urgentes > 1 ? "s" : ""}</span>}
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: Math.min(cupos, 12) }, (_, i) => (
            <span key={i} className="h-2 flex-1 rounded" style={{ background: i < deHoy.length ? "#F2B8C6" : "rgba(252,247,236,0.25)" }} />
          ))}
        </div>
        <div className="text-[12px] text-foam">{textoCupos(deHoy.length, cupos)}</div>
      </section>

      {avisoManana && (
        <section className="flex items-start gap-2.5 rounded-[18px] bg-olive-soft px-3.5 py-3 text-olive-ink">
          <Bell size={20} className="mt-px flex-none" />
          <div className="text-[13px] leading-[1.45]">
            <strong className="font-semibold">Mañana {nombreDia(manana)}:</strong> {entregasManana === 1 ? "1 entrega" : `${entregasManana} entregas`}
            {cumpleanos.length > 0 && ` · cumpleaños de ${cumpleanos.join(", ")}`}
          </div>
        </section>
      )}

      {nuevos.length > 0 && (
        <section className="flex flex-col gap-2.5 rounded-[22px] border-[1.5px] border-rose-deep bg-rose-soft p-3">
          <h2 className="m-0 px-1 text-[13px] font-semibold text-rose-ink">{nuevos.length === 1 ? "1 pedido nuevo de la tienda" : `${nuevos.length} pedidos nuevos de la tienda`}</h2>
          {nuevos.map((o) => (
            <article key={o.id} className="flex flex-col gap-2 rounded-2xl bg-paper px-3.5 py-3">
              <button type="button" onClick={() => onEditar(o)} className="flex flex-col gap-1 border-none bg-transparent p-0 text-left text-ink">
                <span className="flex w-full justify-between gap-2"><span className="text-[15px] font-semibold">{o.cliente}</span><span className="text-[15px] font-semibold text-cocoa">{clp(o.precio)}</span></span>
                <span className="font-display text-[19px] font-semibold leading-tight">{o.producto}</span>
                <span className="text-[12px] text-muted">{o.fecha ? diaRelativo(o.fecha, hoy) : "Sin fecha"} · {o.entrega || "Sin entrega"}{o.notas ? ` · ${o.notas}` : ""}</span>
              </button>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => d.confirmar(o)} className="min-h-10 flex-1 rounded-[20px] border-none bg-cocoa px-4 text-[13px] font-semibold text-cream">Confirmar</button>
                <button type="button" onClick={() => confirm(`¿Rechazar el pedido de ${o.cliente}?`) && d.rechazar(o)} className="min-h-10 rounded-[20px] border border-line-2 bg-transparent px-4 text-[13px] font-semibold text-muted">Rechazar</button>
                {o.whatsapp && <a href={`https://wa.me/${o.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center rounded-[20px] border border-line-2 px-4 text-[13px] font-semibold">WhatsApp</a>}
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="flex gap-2 overflow-x-auto pb-0.5">
        {filtros.map((f) => {
          const on = f.key === filtro;
          return (
            <button key={f.key} type="button" onClick={() => setFiltro(f.key)} aria-pressed={on} className="min-h-10 flex-none rounded-[20px] border px-3.5 text-[13px] font-medium whitespace-nowrap" style={on ? { background: "#6B4A33", color: "#FCF7EC", borderColor: "#6B4A33" } : { background: "#FFFDF8", color: "#6B4A33", borderColor: "#EADFCB" }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {lista.map((o) => {
        const e = infoEstado(o.estado);
        const atrasado = o.fecha && o.fecha < hoy;
        return (
          <article key={o.id} className="flex flex-col gap-2 rounded-[18px] border bg-paper px-[15px] py-[13px]" style={{ borderColor: o.urgente ? "#A84F68" : "#EADFCB" }}>
            <button type="button" onClick={() => onEditar(o)} aria-label={`Editar pedido de ${o.cliente}`} className="flex flex-col gap-2 border-none bg-transparent p-0 text-left text-ink">
              <span className="flex w-full items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-[15px] font-semibold">{o.cliente}</span>
                  {o.urgente && <span className="rounded-[9px] bg-rose-deep px-2 py-0.5 text-[10.5px] font-semibold text-paper">URGENTE</span>}
                </span>
                <span className="text-[15px] font-semibold text-cocoa">{clp(o.precio)}</span>
              </span>
              <span className="font-display text-[20px] font-semibold leading-[1.15]">{o.producto}</span>
            </button>
            <div className="flex items-center justify-between gap-2">
              <div className="text-[12px] leading-[1.4] text-muted">
                <span className={atrasado ? "font-semibold text-rose-deep" : ""}>{o.fecha ? diaRelativo(o.fecha, hoy) : "Sin fecha"}{o.hora ? " " + o.hora : ""}</span> · {o.canal}
                {o.entrega && <><br />{o.entrega}</>}
              </div>
              <button type="button" onClick={() => d.cambiarEstado(o, siguienteEstado(o.estado))} aria-label={`Cambiar estado del pedido de ${o.cliente}: ${e.label}`} className="flex min-h-9 flex-none items-center gap-1 rounded-[18px] border-none px-3 text-[12px] font-semibold" style={{ background: e.bg, color: e.fg }}>
                {e.label}
                <ChevronRight size={12} />
              </button>
            </div>
          </article>
        );
      })}
      {lista.length === 0 && <div className="px-3 py-7 text-center text-[14px] text-muted">{filtro === "todos" ? "No hay pedidos por hacer. Toca + para anotar uno." : "No hay pedidos en este estado."}</div>}
      {lista.length > 0 && <div className="text-center text-[11px] text-muted">Toca el estado para avanzarlo, o el pedido para editarlo.</div>}
    </div>
  );
}
