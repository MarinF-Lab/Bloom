import { useState } from "react";
import { DAYS, REMINDERS } from "../data/gestion";
import { CUPOS_POR_DIA, etiquetaDia } from "../core/orders";
import { Switch } from "../ui/Switch";

export function Agenda() {
  const [abierto, setAbierto] = useState<number | null>(29);
  const [rem, setRem] = useState<Record<string, boolean>>({ dia: true, cumple: true });

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[13px] text-muted">Toca un día para ver sus entregas. Máximo {CUPOS_POR_DIA} pedidos por día.</div>
      {DAYS.map((d) => {
        const open = abierto === d.num;
        const lleno = d.count >= CUPOS_POR_DIA;
        return (
          <div key={d.num} className="overflow-hidden rounded-2xl border bg-paper" style={{ borderColor: lleno ? "#E7B9C6" : "#EADFCB" }}>
            <button
              type="button"
              onClick={() => setAbierto(open ? null : d.num)}
              aria-expanded={open}
              className="flex w-full items-center gap-3 border-none bg-transparent px-3.5 py-[11px] text-left text-ink"
            >
              <div className="w-11 flex-none text-center">
                <div className="text-[11px] text-muted uppercase">{d.dow}</div>
                <div className="text-[20px] font-semibold leading-[1.1]">{d.num}</div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex justify-between text-[13px]">
                  <span>{d.label}</span>
                  <span className="font-semibold" style={{ color: lleno ? "#A84F68" : d.closed ? "#6E5644" : "#4E3424" }}>{etiquetaDia(d.count, d.closed)}</span>
                </div>
                <div className="h-[7px] overflow-hidden rounded bg-sand">
                  <div className="h-[7px] rounded" style={{ width: `${(d.count / CUPOS_POR_DIA) * 100}%`, background: lleno ? "#A84F68" : "#A8B07A" }} />
                </div>
              </div>
            </button>
            {open && (
              <div className="flex flex-col gap-1.5 pr-3.5 pb-3 pl-[70px]">
                {d.items.map((t) => (
                  <div key={t} className="border-b border-dashed border-line py-1.5 text-[13px]">{t}</div>
                ))}
                {d.items.length === 0 && <div className="text-[13px] text-muted">{d.closed ? "Día de descanso." : `Sin entregas. Quedan ${CUPOS_POR_DIA} cupos.`}</div>}
              </div>
            )}
          </div>
        );
      })}

      <section className="flex flex-col gap-1 rounded-[18px] border border-line bg-paper px-4 py-3.5">
        <div className="font-display text-[21px] font-semibold">Recordatorios</div>
        {REMINDERS.map((r) => (
          <div key={r.key} className="flex items-center gap-2.5">
            <span className="flex-1 text-[14px]">{r.label}</span>
            <Switch on={rem[r.key] !== false} label={r.label} onToggle={() => setRem((c) => ({ ...c, [r.key]: !(c[r.key] !== false) }))} />
          </div>
        ))}
      </section>
    </div>
  );
}
