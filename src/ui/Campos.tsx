import { useId, type ReactNode } from "react";
import { Switch } from "./Switch";

const CAJA = "min-h-11 w-full rounded-[14px] border border-line-2 bg-cream px-3.5 text-[16px] text-ink";

function Etiqueta({ id, label, nota, children }: { id: string; label: string; nota?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium">{label}</label>
      {children}
      {nota && <span className="text-[12px] text-muted">{nota}</span>}
    </div>
  );
}

export function Texto(p: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; nota?: string; inputMode?: "text" | "tel" | "numeric" | "email"; autoComplete?: string }) {
  const id = useId();
  return (
    <Etiqueta id={id} label={p.label} nota={p.nota}>
      <input id={id} type={p.type ?? "text"} value={p.value} placeholder={p.placeholder} inputMode={p.inputMode} autoComplete={p.autoComplete} onChange={(e) => p.onChange(e.target.value)} className={CAJA} />
    </Etiqueta>
  );
}

export function Area(p: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; nota?: string }) {
  const id = useId();
  return (
    <Etiqueta id={id} label={p.label} nota={p.nota}>
      <textarea id={id} rows={p.rows ?? 3} value={p.value} placeholder={p.placeholder} onChange={(e) => p.onChange(e.target.value)} className={CAJA + " resize-y py-2.5"} />
    </Etiqueta>
  );
}

/** Número entero (pesos, horas, porciones). Vacío cuenta como 0. */
export function Numero(p: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; nota?: string; prefijo?: string }) {
  const id = useId();
  return (
    <Etiqueta id={id} label={p.label} nota={p.nota}>
      <div className="flex items-center gap-1.5">
        {p.prefijo && <span className="text-[15px] text-muted">{p.prefijo}</span>}
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={p.min ?? 0}
          max={p.max}
          value={Number.isFinite(p.value) ? String(p.value) : ""}
          onChange={(e) => p.onChange(e.target.value === "" ? 0 : Math.round(Number(e.target.value)))}
          className={CAJA}
        />
      </div>
    </Etiqueta>
  );
}

export function Selector<T extends string>(p: { label: string; value: T; opciones: readonly (T | { key: T; label: string })[]; onChange: (v: T) => void; nota?: string }) {
  const id = useId();
  return (
    <Etiqueta id={id} label={p.label} nota={p.nota}>
      <select id={id} value={p.value} onChange={(e) => p.onChange(e.target.value as T)} className={CAJA + " px-3"}>
        {p.opciones.map((o) => {
          const k = typeof o === "string" ? o : o.key;
          return <option key={k} value={k}>{typeof o === "string" ? o : o.label}</option>;
        })}
      </select>
    </Etiqueta>
  );
}

export function Interruptor({ label, on, onChange, nota }: { label: string; on: boolean; onChange: (v: boolean) => void; nota?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="min-w-0 flex-1">
        <div className="text-[14px]">{label}</div>
        {nota && <div className="text-[12px] text-muted">{nota}</div>}
      </div>
      <Switch on={on} label={label} onToggle={() => onChange(!on)} />
    </div>
  );
}

/** Dos campos lado a lado. */
export function Fila({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}
