import { useEffect, useState } from "react";
import { PRODUCTS } from "../data/productos";
import { TORTA_INICIAL } from "../data/tienda";
import { setCantidad, totalUnidades, type Cantidades } from "../core/cart";
import { leerFotosPublicas } from "../store/firebase";
import { ArmaTorta } from "./ArmaTorta";
import { AvisoTemporada, Cabecera, Portada, Urgente } from "./Cabecera";
import { Catalogo } from "./Catalogo";
import { Pedido } from "./Pedido";
import { Contacto, Encargos, Galeria, Opiniones, Packs, Pie, Preguntas, Sobre } from "./Secciones";

/** Tienda pública: catálogo, caja dulce, "Arma tu torta" y encargos. Todo se envía por WhatsApp. */
export function Tienda() {
  const [cat, setCat] = useState("Todo");
  const [qty, setQty] = useState<Cantidades>({});
  const [cake, setCake] = useState(TORTA_INICIAL);
  const [zone, setZone] = useState("retiro");
  const [fotos, setFotos] = useState<Record<string, string>>({});

  // Fotos que la dueña subió desde la app de gestión. Sin internet o sin fotos, quedan los dibujos.
  useEffect(() => {
    let vivo = true;
    leerFotosPublicas(PRODUCTS.map((p) => p.id))
      .then((f) => { if (vivo) setFotos(f); })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  const cambiar = (id: string, n: number) => setQty((q) => setCantidad(q, id, n));

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <AvisoTemporada />
      <Cabecera cartCount={totalUnidades(qty)} />
      <main>
        <Portada />
        <Urgente />
        <Catalogo cat={cat} onCat={setCat} qty={qty} onAdd={(p) => cambiar(p.id, (qty[p.id] ?? 0) + 1)} fotos={fotos} />
        <Packs />
        <ArmaTorta cake={cake} onCake={setCake} />
        <Pedido qty={qty} onQty={cambiar} zone={zone} onZone={setZone} />
        <Encargos />
        <Galeria />
        <Opiniones />
        <Sobre />
        <Preguntas />
        <Contacto />
      </main>
      <Pie />
    </div>
  );
}
