import { useState, type ReactNode } from "react";
import { HOY } from "../data/gestion";
import { PRODUCTS } from "../data/productos";
import type { Estado } from "../core/orders";
import { useFotos } from "../store/useFotos";
import { Book, Cake, Calendar, Clipboard, Dots, Plus } from "../ui/icons";
import { Logo } from "../ui/Logo";
import { Agenda } from "./Agenda";
import { Catalogo } from "./Catalogo";
import { Mas, SEG_TITULOS, type Seg } from "./Mas";
import { Pedidos } from "./Pedidos";
import { Recetas } from "./Recetas";

type Tab = "pedidos" | "agenda" | "catalogo" | "recetas" | "mas";

const TABS: { key: Tab; label: string; icon: ReactNode }[] = [
  { key: "pedidos", label: "Pedidos", icon: <Clipboard /> },
  { key: "agenda", label: "Agenda", icon: <Calendar /> },
  { key: "catalogo", label: "Catálogo", icon: <Cake /> },
  { key: "recetas", label: "Recetas", icon: <Book /> },
  { key: "mas", label: "Más", icon: <Dots /> },
];

const IDS = PRODUCTS.map((p) => p.id);

/** App de gestión de la pastelería: pedidos, agenda, catálogo, recetas, clientes e insumos. */
export function Gestion() {
  const [tab, setTab] = useState<Tab>("pedidos");
  const [seg, setSeg] = useState<Seg>("clientes");
  const [statuses, setStatuses] = useState<Record<number, Estado>>({});
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const fotos = useFotos(IDS);

  const titulo = tab === "mas" ? SEG_TITULOS[seg] : TABS.find((t) => t.key === tab)!.label;

  return (
    <div className="bg-cream">
      <div className="mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden bg-cream font-sans text-ink sm:border-x sm:border-line">
        <header className="flex items-center gap-3 border-b border-line px-5 pt-[max(20px,env(safe-area-inset-top))] pb-3">
          <Logo alt="Logo de Bloom Pastelería" className="size-12 rounded-full border border-line" />
          <div className="min-w-0 flex-1">
            <h1 className="m-0 font-display text-[26px] font-semibold leading-[1.1]">{titulo}</h1>
            <div className="mt-0.5 text-[12px] text-muted">{HOY}</div>
          </div>
          <button type="button" aria-label="Nuevo pedido" className="flex size-11 items-center justify-center rounded-full border-none bg-cocoa p-0 text-cream">
            <Plus size={20} />
          </button>
        </header>

        <main className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-[18px] pt-3.5 pb-[22px]">
          {tab === "pedidos" && <Pedidos statuses={statuses} onStatus={(id, s) => setStatuses((c) => ({ ...c, [id]: s }))} />}
          {tab === "agenda" && <Agenda />}
          {tab === "catalogo" && <Catalogo hidden={hidden} onToggle={(id) => setHidden((c) => ({ ...c, [id]: !c[id] }))} f={fotos} />}
          {tab === "recetas" && <Recetas />}
          {tab === "mas" && <Mas seg={seg} onSeg={setSeg} statuses={statuses} />}
        </main>

        <nav aria-label="Secciones" className="flex border-t border-line bg-paper px-1 pt-1 pb-[max(14px,env(safe-area-inset-bottom))]">
          {TABS.map((t) => {
            const on = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={on ? "page" : undefined}
                className="flex min-h-14 flex-1 flex-col items-center justify-center gap-[3px] border-none bg-transparent text-[11px]"
                style={{ color: on ? "#4E3424" : "#7A6352", fontWeight: on ? 600 : 400 }}
              >
                <span className="flex h-[26px] w-[34px] items-center justify-center rounded-[13px]" style={{ background: on ? "#F7DDE3" : "transparent" }}>
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
