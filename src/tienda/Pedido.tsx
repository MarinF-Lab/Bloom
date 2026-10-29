import { useState } from "react";
import { PRODUCTS } from "../data/productos";
import { INSTAGRAM, WHATSAPP, ZONES } from "../data/tienda";
import { fechaMinima, linkWhatsApp, mensajePedido, resumen, type Cantidades } from "../core/cart";
import { clp } from "../core/money";
import { Chat } from "../ui/icons";
import { Gatito } from "../ui/Logo";
import { Eyebrow, area, campo, externo } from "./comun";

export function Pedido({ qty, onQty, zone, onZone }: { qty: Cantidades; onQty: (id: string, n: number) => void; zone: string; onZone: (z: string) => void }) {
  const [fecha, setFecha] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoListo, setCodigoListo] = useState(false);
  const [dedicatoria, setDedicatoria] = useState("");

  const z = ZONES.find((x) => x.key === zone) ?? ZONES[0]!;
  const r = resumen(PRODUCTS, qty, z);
  const cart = PRODUCTS.filter((p) => qty[p.id]);
  const vacio = cart.length === 0;
  const texto = mensajePedido(PRODUCTS, qty, z, { fecha, codigo: codigoListo ? codigo : "", dedicatoria });

  return (
    <section id="pedido" className="border-y border-line bg-paper">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-7 px-6 py-[72px]">
        <div className="flex min-w-0 flex-[1.3_1_440px] flex-col gap-4">
          <div>
            <Eyebrow>TU PEDIDO</Eyebrow>
            <h2 className="mt-1.5 mb-0 font-display text-[36px] font-semibold leading-[1.05] sm:text-[44px]">Arma tu caja dulce</h2>
          </div>
          {vacio && (
            <div className="flex flex-col items-center gap-2.5 rounded-[22px] bg-cream p-[26px] text-center">
              <Gatito width={96} />
              <div className="text-[15px] text-muted">Tu caja está vacía. El gatito está esperando algo dulce.</div>
              <a href="#catalogo" className="text-[14px] font-medium underline">Ir al catálogo</a>
            </div>
          )}
          {cart.map((p) => {
            const q = qty[p.id] ?? 0;
            return (
              <div key={p.id} className="flex items-center gap-3 border-b border-sand py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[21px] font-semibold leading-[1.15]">{p.name}</div>
                  <div className="text-[13px] text-muted">{clp(p.price)} c/u</div>
                </div>
                <div className="flex items-center rounded-[22px] border border-line">
                  <button type="button" onClick={() => onQty(p.id, q - 1)} aria-label={`Quitar uno de ${p.name}`} className="size-11 border-none bg-transparent p-0 text-[20px] text-cocoa">−</button>
                  <span className="min-w-[22px] text-center font-semibold">{q}</span>
                  <button type="button" onClick={() => onQty(p.id, q + 1)} aria-label={`Agregar otro ${p.name}`} className="size-11 border-none bg-transparent p-0 text-[20px] text-cocoa">+</button>
                </div>
                <div className="w-[90px] text-right font-semibold">{clp(p.price * q)}</div>
              </div>
            );
          })}
          <div className="mt-1.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ped-fecha" className="text-[13px] font-medium">Fecha de entrega</label>
              <input id="ped-fecha" type="date" min={fechaMinima()} value={fecha} onChange={(e) => setFecha(e.target.value)} className={campo} />
              <span className="text-[12px] text-muted">Mínimo 24 h de anticipación.</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ped-codigo" className="text-[13px] font-medium">Código de descuento</label>
              <div className="flex gap-2">
                <input
                  id="ped-codigo"
                  type="text"
                  placeholder="Ej: BLOOM10"
                  value={codigo}
                  onChange={(e) => { setCodigo(e.target.value); setCodigoListo(false); }}
                  className={campo + " min-w-0 flex-1 uppercase"}
                />
                <button type="button" onClick={() => setCodigoListo(codigo.trim() !== "")} className="min-h-[46px] rounded-[14px] border border-cocoa bg-transparent px-3.5 text-[13px] font-medium text-cocoa">
                  Aplicar
                </button>
              </div>
              {codigoListo && <span role="status" className="text-[12px] text-olive-ink">Código recibido: se aplica al confirmar tu pedido.</span>}
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="ped-regalo" className="text-[13px] font-medium">Mensaje de regalo o dedicatoria (opcional)</label>
              <textarea id="ped-regalo" rows={2} placeholder="Para: … De: … Mensaje: …" value={dedicatoria} onChange={(e) => setDedicatoria(e.target.value)} className={area} />
            </div>
          </div>
        </div>
        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-[28px] border border-line bg-cream p-6">
          <div className="text-[15px] font-semibold">Entrega</div>
          <div role="group" aria-label="Forma de entrega" className="flex flex-col gap-2">
            {ZONES.map((x) => {
              const on = x.key === zone;
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => onZone(x.key)}
                  aria-pressed={on}
                  className="flex min-h-12 items-center justify-between gap-2.5 rounded-2xl border-[1.5px] px-4 text-left text-[14px] text-ink"
                  style={{ background: on ? "#FBEAEE" : "#FFFDF8", borderColor: on ? "#A84F68" : "#EADFCB" }}
                >
                  <span>{x.label}</span>
                  <span className="font-semibold">{x.fee === 0 || r.gratis ? "Gratis" : clp(x.fee)}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 pt-1.5">
            <div className="flex justify-between text-[14px]"><span className="text-muted">Subtotal</span><span>{clp(r.subtotal)}</span></div>
            <div className="flex justify-between text-[14px]"><span className="text-muted">Despacho</span><span>{r.despacho === 0 ? "Gratis" : clp(r.despacho)}</span></div>
            {r.subtotal > 0 && (
              <div className="rounded-[10px] bg-olive-soft px-2.5 py-2 text-[12px] text-olive-ink">
                {r.gratis ? "Tu pedido tiene despacho gratis." : `Te faltan ${clp(r.faltaParaGratis)} para el despacho gratis.`}
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-line pt-2.5">
              <span className="font-semibold">Total</span>
              <span className="font-display text-[34px] font-semibold">{clp(r.total)}</span>
            </div>
            <div className="flex justify-between rounded-xl bg-rose px-3 py-2.5 text-[14px] text-rose-ink">
              <span>Abono para reservar (50%)</span>
              <span className="font-semibold">{clp(r.abono)}</span>
            </div>
            <div className="text-[12px] text-muted">Pagos por transferencia o en efectivo.</div>
          </div>
          {vacio ? (
            <a href="#catalogo" className="flex min-h-[50px] items-center justify-center gap-2 rounded-[25px] bg-sand font-medium text-muted">
              Agrega productos para pedir
            </a>
          ) : (
            <a href={linkWhatsApp(WHATSAPP, texto)} {...externo} className="flex min-h-[50px] items-center justify-center gap-2 rounded-[25px] bg-cocoa font-medium text-cream">
              <Chat size={18} />
              Enviar pedido por WhatsApp
            </a>
          )}
          <a href={INSTAGRAM} {...externo} className="flex min-h-12 items-center justify-center rounded-3xl border-[1.5px] border-cocoa text-[14px] font-medium text-cocoa">
            Pedir por Instagram
          </a>
        </aside>
      </div>
    </section>
  );
}
