import { useEffect, useState } from "react";
import { TORTA_INICIAL } from "../data/tienda";
import { setCantidad, totalUnidades, type Cantidades } from "../core/cart";
import { useTiendaPublica } from "../store/useTiendaPublica";
import { ArmaTorta } from "./ArmaTorta";
import { AvisoTemporada, Cabecera, Portada, Urgente } from "./Cabecera";
import { Catalogo } from "./Catalogo";
import { TiendaCtx } from "./contexto";
import { Pedido } from "./Pedido";
import { Contacto, Encargos, Galeria, Opiniones, Packs, Pie, Preguntas, Sobre } from "./Secciones";

/** Tienda pública: catálogo, caja dulce, "Arma tu torta" y encargos. Lo pedido llega a la gestión y por WhatsApp. */
export function Tienda() {
  const datos = useTiendaPublica();
  const [cat, setCat] = useState("Todo");
  const [qty, setQty] = useState<Cantidades>({});
  const [cake, setCake] = useState(TORTA_INICIAL);
  const [zone, setZone] = useState("");

  // Zona por defecto: el primer despacho con costo (o la primera zona).
  useEffect(() => {
    if (!datos.config.zonas.some((z) => z.key === zone)) setZone((datos.config.zonas.find((z) => z.fee > 0) ?? datos.config.zonas[0])?.key ?? "");
  }, [datos.config.zonas, zone]);

  useEffect(() => {
    document.title = datos.config.nombre;
  }, [datos.config.nombre]);

  const cambiar = (id: string, n: number) => setQty((q) => setCantidad(q, id, n));

  return (
    <TiendaCtx.Provider value={datos}>
      <div className="min-h-screen bg-cream font-sans text-ink">
        <AvisoTemporada />
        <Cabecera cartCount={totalUnidades(qty)} />
        <main>
          <Portada />
          <Urgente />
          <Catalogo cat={cat} onCat={setCat} qty={qty} onAdd={(p) => cambiar(p.id, (qty[p.id] ?? 0) + 1)} />
          <Packs />
          <ArmaTorta cake={cake} onCake={setCake} />
          <Pedido qty={qty} onQty={cambiar} zone={zone} onZone={setZone} onEnviado={() => setQty({})} />
          <Encargos />
          <Galeria />
          <Opiniones />
          <Sobre />
          <Preguntas />
          <Contacto />
        </main>
        <Pie />
      </div>
    </TiendaCtx.Provider>
  );
}
