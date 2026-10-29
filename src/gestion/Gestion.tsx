import { useState, type ReactNode } from "react";
import { ymd, fechaTitulo } from "../core/fechas";
import type { Pedido, Producto, Receta } from "../core/modelo";
import { categorias } from "../data/productos";
import { useCuenta, type Sesion } from "../store/useCuenta";
import { useDatos } from "../store/useDatos";
import { Book, Cake, Calendar, Clipboard, Dots, Gear, Plus } from "../ui/icons";
import { Logo } from "../ui/Logo";
import { Agenda } from "./Agenda";
import { Catalogo } from "./Catalogo";
import { Configuracion } from "./Configuracion";
import { EditorPedido, pedidoNuevo } from "./EditorPedido";
import { EditorProducto, productoNuevo } from "./EditorProducto";
import { EditorReceta, recetaNueva } from "./EditorReceta";
import { Entrar } from "./Entrar";
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

/** App de gestión: entrar con Google (o modo ejemplo) y trabajar con los datos de la cuenta. */
export function Gestion() {
  const c = useCuenta();
  if (c.sesion.modo === "cuenta" || c.sesion.modo === "ejemplo") {
    return <Panel sesion={c.sesion} avisoCuenta={c.aviso} onEntrar={c.iniciarSesion} onSalir={c.cerrarSesion} />;
  }
  return <Entrar cargando={c.sesion.modo === "cargando"} aviso={c.aviso} onEntrar={c.iniciarSesion} onEjemplo={c.verEjemplo} />;
}

type Hojita =
  | { tipo: "config" }
  | { tipo: "pedido"; p: Pedido; nuevo: boolean }
  | { tipo: "producto"; p: Producto; nuevo: boolean }
  | { tipo: "receta"; r: Receta; nueva: boolean }
  | null;

function Panel({ sesion, avisoCuenta, onEntrar, onSalir }: {
  sesion: Extract<Sesion, { modo: "cuenta" | "ejemplo" }>;
  avisoCuenta: string;
  onEntrar: () => void;
  onSalir: () => void;
}) {
  const d = useDatos(sesion.almacen);
  const [tab, setTab] = useState<Tab>("pedidos");
  const [seg, setSeg] = useState<Seg>("clientes");
  const [hoja, setHoja] = useState<Hojita>(null);
  const hoy = ymd(new Date());
  const cerrar = () => setHoja(null);
  const titulo = tab === "mas" ? SEG_TITULOS[seg] : TABS.find((t) => t.key === tab)!.label;
  const editarPedido = (p: Pedido) => setHoja({ tipo: "pedido", p, nuevo: false });
  const aviso = d.aviso || avisoCuenta;

  return (
    <div className="bg-cream">
      <div className="mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden bg-cream font-sans text-ink sm:border-x sm:border-line">
        <header className="flex items-center gap-3 border-b border-line px-5 pt-[max(20px,env(safe-area-inset-top))] pb-3">
          <Logo alt="Logo de Bloom Pastelería" className="size-12 rounded-full border border-line" />
          <div className="min-w-0 flex-1">
            <h1 className="m-0 font-display text-[26px] font-semibold leading-[1.1]">{titulo}</h1>
            <div className="mt-0.5 text-[12px] text-muted">{fechaTitulo(hoy)}</div>
          </div>
          <button type="button" aria-label="Configuración" onClick={() => setHoja({ tipo: "config" })} className="flex size-11 items-center justify-center rounded-full border border-line bg-paper p-0 text-cocoa">
            <Gear size={20} />
          </button>
          <button type="button" aria-label="Nuevo pedido" onClick={() => setHoja({ tipo: "pedido", p: pedidoNuevo(hoy), nuevo: true })} className="flex size-11 items-center justify-center rounded-full border-none bg-cocoa p-0 text-cream">
            <Plus size={20} />
          </button>
        </header>

        <main className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-[18px] pt-3.5 pb-[22px]">
          {sesion.modo === "ejemplo" && (
            <div className="flex items-center gap-2 rounded-2xl bg-honey px-3.5 py-2.5 text-[12px] text-honey-ink">
              <span className="min-w-0 flex-1">Modo ejemplo: los cambios se pierden al recargar.</span>
              <button type="button" onClick={onEntrar} className="min-h-9 flex-none rounded-[18px] border-none bg-honey-ink px-3 text-[12px] font-semibold text-paper">Entrar con Google</button>
            </div>
          )}
          {aviso && <div role="status" className="rounded-xl bg-rose-soft px-3 py-2 text-[13px] text-rose-ink">{aviso}</div>}
          {!d.listo ? (
            <div role="status" className="py-10 text-center text-[14px] text-muted">Cargando tus datos…</div>
          ) : (
            <>
              {tab === "pedidos" && <Pedidos d={d} hoy={hoy} onEditar={editarPedido} />}
              {tab === "agenda" && <Agenda d={d} hoy={hoy} onEditar={editarPedido} />}
              {tab === "catalogo" && <Catalogo d={d} onEditar={(p) => setHoja({ tipo: "producto", p, nuevo: false })} onNuevo={() => setHoja({ tipo: "producto", p: productoNuevo(d.catalogo.length + 1), nuevo: true })} />}
              {tab === "recetas" && <Recetas recetas={d.recetas} onEditar={(r) => setHoja({ tipo: "receta", r, nueva: false })} onNueva={() => setHoja({ tipo: "receta", r: recetaNueva(), nueva: true })} />}
              {tab === "mas" && <Mas seg={seg} onSeg={setSeg} d={d} hoy={hoy} />}
            </>
          )}
        </main>

        <nav aria-label="Secciones" className="flex border-t border-line bg-paper px-1 pt-1 pb-[max(14px,env(safe-area-inset-bottom))]">
          {TABS.map((t) => {
            const on = t.key === tab;
            const marca = t.key === "pedidos" && d.pedidos.some((p) => p.nuevo && !p.rechazado);
            return (
              <button key={t.key} type="button" onClick={() => setTab(t.key)} aria-current={on ? "page" : undefined} className="relative flex min-h-14 flex-1 flex-col items-center justify-center gap-[3px] border-none bg-transparent text-[11px]" style={{ color: on ? "#4E3424" : "#7A6352", fontWeight: on ? 600 : 400 }}>
                <span className="relative flex h-[26px] w-[34px] items-center justify-center rounded-[13px]" style={{ background: on ? "#F7DDE3" : "transparent" }}>
                  {t.icon}
                  {marca && <span aria-label="Hay pedidos nuevos" className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-rose-deep" />}
                </span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {hoja?.tipo === "config" && <Configuracion config={d.config} sesion={sesion} onGuardar={d.guardarConfig} onSalir={() => { cerrar(); onSalir(); }} onCerrar={cerrar} />}
      {hoja?.tipo === "pedido" && <EditorPedido inicial={hoja.p} esNuevo={hoja.nuevo} catalogo={d.catalogo} config={d.config} onGuardar={d.guardarPedido} onBorrar={d.borrarPedido} onCerrar={cerrar} />}
      {hoja?.tipo === "producto" && (
        <EditorProducto inicial={hoja.p} esNuevo={hoja.nuevo} foto={d.fotos[hoja.p.id]} categorias={categorias(d.catalogo)} onGuardar={d.guardarProducto} onBorrar={d.borrarProducto} onSubirFoto={d.subirFoto} onQuitarFoto={d.quitarFoto} onCerrar={cerrar} />
      )}
      {hoja?.tipo === "receta" && <EditorReceta inicial={hoja.r} esNueva={hoja.nueva} onGuardar={d.guardarReceta} onBorrar={d.borrarReceta} onCerrar={cerrar} />}
    </div>
  );
}
