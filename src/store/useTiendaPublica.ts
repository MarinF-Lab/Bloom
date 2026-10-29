// Lo que muestra la tienda: Configuración, catálogo y fotos de la cuenta de la dueña.
// Sin conexión, o si aún no se vincula una cuenta, usa los valores iniciales.

import { useEffect, useState } from "react";
import { CONFIG_INICIAL, limpio, normalizarConfig, normalizarProducto, type Config, type Pedido, type Producto } from "../core/modelo";
import { PRODUCTS } from "../data/productos";
import { ejemploActivo } from "./almacen";
import { crearPedidoPublico, leerTiendaPublica } from "./firebase";

export interface TiendaDatos {
  config: Config;
  productos: Producto[];
  fotos: Record<string, string>;
  /** Hay una cuenta donde dejar pedidos (o el modo ejemplo). */
  conCuenta: boolean;
}

/** Campos que la tienda puede escribir en un pedido (deben coincidir con firestore.rules). */
export type PedidoTienda = Pick<Pedido, "cliente" | "whatsapp" | "items" | "producto" | "precio" | "abono" | "fecha" | "entrega" | "notas">;

const orden = (ps: Producto[]) => [...ps].sort((a, b) => a.orden - b.orden);

let uidTienda: string | null = null;

export function useTiendaPublica(): TiendaDatos {
  const [t, setT] = useState<TiendaDatos>({ config: CONFIG_INICIAL, productos: PRODUCTS, fotos: {}, conCuenta: false });

  useEffect(() => {
    const ej = ejemploActivo();
    if (ej) {
      // Modo ejemplo en esta pestaña: la tienda muestra lo editado en la gestión.
      const quitar = [
        ej.escucharDoc("config", (c) => setT((x) => ({ ...x, config: normalizarConfig(c), conCuenta: true }))),
        ej.escuchar("catalogo", (rs) => setT((x) => ({ ...x, productos: orden(rs.map((r) => normalizarProducto(r.id, r))) }))),
        ej.escuchar("fotos", (rs) => setT((x) => ({ ...x, fotos: Object.fromEntries(rs.map((r) => [r.id, String(r.img)])) }))),
      ];
      return () => quitar.forEach((q) => q());
    }
    let vivo = true;
    leerTiendaPublica()
      .then((pub) => {
        if (!vivo || !pub) return;
        uidTienda = pub.uid;
        setT({
          config: normalizarConfig(pub.config),
          productos: pub.catalogo.length ? orden(pub.catalogo.map((c) => normalizarProducto(c.id, c.datos))) : PRODUCTS,
          fotos: pub.fotos,
          conCuenta: true,
        });
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  return t;
}

/** Deja el pedido en la gestión. Devuelve false si no se pudo (igual sale por WhatsApp). */
export async function enviarPedidoTienda(p: PedidoTienda): Promise<boolean> {
  const datos = limpio({ ...p, canal: "Web", estado: "pendiente", origen: "tienda", nuevo: true, urgente: false, creado: new Date().toISOString() });
  try {
    const ej = ejemploActivo();
    if (ej) {
      await ej.guardar("pedidos", "t" + Date.now().toString(36), datos);
      return true;
    }
    if (!uidTienda) return false;
    await crearPedidoPublico(uidTienda, datos);
    return true;
  } catch {
    return false;
  }
}
