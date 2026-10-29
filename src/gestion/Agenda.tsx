import { useState } from "react";
import type { Pedido } from "../core/modelo";
import { agenda, etiquetaDia } from "../core/orders";
import { diaCorto, diaRelativo, sumarDias, aFecha } from "../core/fechas";
import { REMINDERS } from "../data/gestion";
import type { UsoDatos } from "../store/useDatos";
import { Switch } from "../ui/Switch";

export function Agenda({ d, hoy, onEditar }: { d: UsoDatos; hoy: string; onEditar: (p: Pedido) => void }) {
  const [abierto, setAbierto] = useState<string | null>(hoy);
  const cupos = d.config.cuposPorDia;
  const dias = agenda(d.pedidos, hoy, 7, cupos, sumarDias);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[13px] text-muted">Próximos 7 días. Toca un día para ver sus entregas. Máximo {cupos} pedidos por día.</div>
      {dias.map((dia) => {
        const open = abierto === dia.fecha;
        const n = dia.pedidos.length;
        return (
          <div key={dia.fecha} className="overflow-hidden rounded-2xl border bg-paper" style={{ borderColor: dia.lleno ? "#E7B9C6" : "#EADFCB" }}>
            <button type="button" onClick={() => setAbierto(open ? null : dia.fecha)} aria-expanded={open} className="flex w-full items-center gap-3 border-none bg-transparent px-3.5 py-[11px] text-left text-ink">
              <div className="w-11 flex-none text-center">
                <div className="text-[11px] text-muted uppercase">{diaCorto(dia.fecha)}</div>
                <div className="text-[20px] font-semibold leading-[1.1]">{aFecha(dia.fecha).getDate()}</div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex justify-between text-[13px]">
                  <span>{diaRelativo(dia.fecha, hoy)}</span>
                  <span className="font-semibold" style={{ color: dia.lleno ? "#A84F68" : "#4E3424" }}>{etiquetaDia(n, false, cupos)}</span>
                </div>
                <div className="h-[7px] overflow-hidden rounded bg-sand">
                  <div className="h-[7px] rounded" style={{ width: `${Math.min(100, (n / cupos) * 100)}%`, background: dia.lleno ? "#A84F68" : "#A8B07A" }} />
                </div>
              </div>
            </button>
            {open && (
              <div className="flex flex-col gap-1 pr-3.5 pb-3 pl-[70px]">
                {dia.pedidos.map((p) => (
                  <button key={p.id} type="button" onClick={() => onEditar(p)} className="border-0 border-b border-dashed border-line bg-transparent py-1.5 text-left text-[13px] text-ink">
                    {p.hora ? p.hora + " · " : ""}{p.cliente} · {p.producto}{p.urgente ? " (urgente)" : ""}
                  </button>
                ))}
                {n === 0 && <div className="text-[13px] text-muted">Sin entregas. Quedan {cupos} cupos.</div>}
              </div>
            )}
          </div>
        );
      })}

      <section className="flex flex-col gap-1 rounded-[18px] border border-line bg-paper px-4 py-3.5">
        <div className="font-display text-[21px] font-semibold">Recordatorios</div>
        <p className="m-0 text-[12px] text-muted">Se muestran arriba en Pedidos.</p>
        {REMINDERS.map((r) => {
          const on = d.ajustes.recordatorios[r.key];
          return (
            <div key={r.key} className="flex items-center gap-2.5">
              <span className="flex-1 text-[14px]">{r.label}</span>
              <Switch on={on} label={r.label} onToggle={() => d.guardarAjustes({ ...d.ajustes, recordatorios: { ...d.ajustes.recordatorios, [r.key]: !on } })} />
            </div>
          );
        })}
      </section>
    </div>
  );
}
