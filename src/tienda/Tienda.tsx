import { useCallback, useEffect, useState } from "react";
import { TORTA_INICIAL } from "../data/tienda";
import { setCantidad, totalUnidades, type Cantidades } from "../core/cart";
import type { Producto } from "../core/modelo";
import { useTiendaPublica } from "../store/useTiendaPublica";
import { ArmaTorta } from "./ArmaTorta";
import { AvisoTemporada, Cabecera, Portada, Urgente } from "./Cabecera";
import { Catalogo } from "./Catalogo";
import { DetalleProducto } from "./DetalleProducto";
import { TiendaCtx } from "./contexto";
import { Pedido } from "./Pedido";
import { Encargos, Packs, Pie, Preguntas, Sobre } from "./Secciones";

/** Tienda pública: catálogo, caja dulce, "Arma tu torta" y encargos. Lo pedido llega a la gestión y por WhatsApp. */
export function Tienda() {
  const datos = useTiendaPublica();
  const [cat, setCat] = useState("Todo");
  const [qty, setQty] = useState<Cantidades>({});
  const [cake, setCake] = useState(TORTA_INICIAL);
  const [zone, setZone] = useState("");
  const [abierto, setAbierto] = useState<Producto | null>(null);
  const [aviso, setAviso] = useState("");

  // Zona por defecto: el primer despacho con costo (o la primera zona).
  useEffect(() => {
    if (!datos.config.zonas.some((z) => z.key === zone)) setZone((datos.config.zonas.find((z) => z.fee > 0) ?? datos.config.zonas[0])?.key ?? "");
  }, [datos.config.zonas, zone]);

  useEffect(() => {
    document.title = datos.config.nombre;
  }, [datos.config.nombre]);

  const cambiar = (id: string, n: number) => setQty((q) => setCantidad(q, id, n));
  const cerrarFicha = useCallback(() => setAbierto(null), []);

  // El aviso de "agregado" se va solo.
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(""), 5000);
    return () => clearTimeout(t);
  }, [aviso]);

  function confirmar(p: Producto, n: number) {
    const antes = qty[p.id] ?? 0;
    cambiar(p.id, n);
    setAbierto(null);
    setAviso(n === 0 ? `Quitaste ${p.name} de tu pedido` : antes > 0 ? `Pedido actualizado: ${n} × ${p.name}` : `Agregado a tu pedido: ${n} × ${p.name}`);
  }

  return (
    <TiendaCtx.Provider value={datos}>
      <div className="min-h-screen bg-cream font-sans text-ink">
        <AvisoTemporada />
        <Cabecera cartCount={totalUnidades(qty)} />
        <main>
          <Portada />
          <Urgente />
          <Catalogo cat={cat} onCat={setCat} qty={qty} onAbrir={setAbierto} />
          <Packs />
          <ArmaTorta cake={cake} onCake={setCake} />
          <Pedido qty={qty} onQty={cambiar} zone={zone} onZone={setZone} onEnviado={() => setQty({})} />
          <Encargos />
          <Sobre />
          <Preguntas />
        </main>
        <Pie />
      </div>
      {abierto && <DetalleProducto producto={abierto} enCaja={qty[abierto.id] ?? 0} onConfirmar={(n) => confirmar(abierto, n)} onCerrar={cerrarFicha} />}
      {aviso && (
        <div role="status" className="fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-[520px] items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-[14px] text-cream shadow-[0_6px_24px_rgba(78,52,36,0.35)]">
          <span className="min-w-0 flex-1">{aviso}</span>
          {totalUnidades(qty) > 0 && (
            <a href="#pedido" onClick={() => setAviso("")} className="flex min-h-10 flex-none items-center rounded-[20px] bg-rose px-4 text-[13px] font-semibold text-rose-ink">
              Ver mi pedido
            </a>
          )}
        </div>
      )}
    </TiendaCtx.Provider>
  );
}
