import { createContext, useContext } from "react";
import { CONFIG_INICIAL } from "../core/modelo";
import { PRODUCTS } from "../data/productos";
import type { TiendaDatos } from "../store/useTiendaPublica";

/** Configuración, catálogo y fotos que la tienda recibe de la cuenta. */
export const TiendaCtx = createContext<TiendaDatos>({ config: CONFIG_INICIAL, productos: PRODUCTS, fotos: {}, conCuenta: false });
export const useTienda = () => useContext(TiendaCtx);

export const instagramUrl = (usuario: string) => `https://instagram.com/${usuario.replace(/^@/, "")}`;
export const whatsappUrl = (numero: string) => `https://wa.me/${numero}`;

/** "24 h" o "2 días". */
export function textoAnticipacion(horas: number): string {
  return horas >= 48 && horas % 24 === 0 ? `${horas / 24} días` : `${horas} h`;
}
