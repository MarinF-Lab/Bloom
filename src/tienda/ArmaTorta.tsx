import { useState } from "react";
import { STEPS, WHATSAPP, type ParteTorta } from "../data/tienda";
import { linkWhatsApp } from "../core/cart";
import { Gatito } from "../ui/Logo";
import { Eyebrow, externo } from "./comun";

const NUMERO = "flex size-[30px] flex-none items-center justify-center rounded-full bg-rose text-[13px] font-semibold text-rose-ink";

export function ArmaTorta({ cake, onCake }: { cake: Record<ParteTorta, string>; onCake: (c: Record<ParteTorta, string>) => void }) {
  const [deco, setDeco] = useState("");
  const partes = STEPS.map((st) => `${st.title}: ${cake[st.key]}`);
  if (deco.trim()) partes.push(`Decoración: ${deco.trim()}`);
  const href = linkWhatsApp(WHATSAPP, "Hola Bloom, quiero cotizar una torta: " + partes.join(" · "));

  return (
    <section id="arma" className="mx-auto flex max-w-[1180px] flex-col gap-[26px] px-6 py-[72px]">
      <div>
        <Eyebrow>ARMA TU TORTA</Eyebrow>
        <h2 className="mt-1.5 mb-0 font-display text-[38px] font-semibold leading-[1.05] sm:text-[46px]">Tu torta, paso a paso</h2>
        <p className="mt-2 mb-0 max-w-[560px] text-[15px] text-muted">Elige cada parte y envíanos tu idea. Te confirmamos precio y disponibilidad por mensaje.</p>
      </div>
      <div className="flex flex-wrap items-start gap-[26px]">
        <div className="flex min-w-0 flex-[1.5_1_480px] flex-col gap-[22px]">
          {STEPS.map((st, i) => (
            <div key={st.key} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className={NUMERO}>{i + 1}</span>
                <span className="text-[16px] font-semibold">{st.title}</span>
              </div>
              <div role="group" aria-label={st.title} className="flex flex-wrap gap-2">
                {st.options.map((o) => {
                  const on = cake[st.key] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => onCake({ ...cake, [st.key]: o })}
                      aria-pressed={on}
                      className="min-h-11 rounded-[22px] border px-4 text-[14px]"
                      style={on ? { background: "#A84F68", color: "#FFFDF8", borderColor: "#A84F68" } : { background: "#FFFDF8", color: "#6B4A33", borderColor: "#DCCDB8" }}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <label htmlFor="arma-deco" className="flex items-center gap-2.5 text-[16px] font-semibold">
              <span className={NUMERO}>5</span>
              Decoración y mensaje
            </label>
            <textarea
              id="arma-deco"
              rows={3}
              value={deco}
              onChange={(e) => setDeco(e.target.value)}
              placeholder="Colores, temática, mensaje en la torta…"
              className="resize-y rounded-[14px] border border-line-2 bg-paper px-3.5 py-3 text-[14px] text-ink"
            />
          </div>
        </div>
        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5 rounded-[28px] border border-line bg-paper p-[22px]">
          <Gatito width={160} className="self-center rounded-[20px]" />
          <div className="text-center font-display text-[26px] font-semibold">Tu torta</div>
          {STEPS.map((st) => (
            <div key={st.key} className="flex justify-between gap-3 border-b border-dashed border-line pb-2 text-[14px]">
              <span className="text-muted">{st.title}</span>
              <span className="text-right font-semibold">{cake[st.key]}</span>
            </div>
          ))}
          <a href={href} {...externo} className="flex min-h-[50px] items-center justify-center gap-2 rounded-[25px] bg-rose-deep font-medium text-paper">
            Cotizar mi torta por WhatsApp
          </a>
          <div className="text-center text-[12px] text-muted">Bloom te confirma el precio y la fecha de entrega.</div>
        </aside>
      </div>
    </section>
  );
}
