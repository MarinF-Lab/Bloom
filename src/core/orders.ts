// Pedidos del día: estados, filtros y cupos.

/** Pedidos que se aceptan por día. */
export const CUPOS_POR_DIA = 5;

export const ESTADOS = [
  { key: "pendiente", label: "Pendiente", bg: "#F7DDE3", fg: "#7E2F47", bar: "#D98AA0" },
  { key: "horno", label: "En horno", bg: "#F6E3C8", fg: "#6A4A12", bar: "#D9A866" },
  { key: "listo", label: "Listo", bg: "#E3E8CC", fg: "#4E5A26", bar: "#A8B07A" },
  { key: "entregado", label: "Entregado", bg: "#ECE6DC", fg: "#5E5248", bar: "#A8998A" },
] as const;

export type Estado = (typeof ESTADOS)[number]["key"];
export type Filtro = "todos" | "urgentes" | Estado;

export function infoEstado(key: Estado) {
  return ESTADOS.find((e) => e.key === key) ?? ESTADOS[0];
}

/** Pendiente → En horno → Listo → Entregado → Pendiente. */
export function siguienteEstado(key: Estado): Estado {
  const i = ESTADOS.findIndex((e) => e.key === key);
  return ESTADOS[(i + 1) % ESTADOS.length]!.key;
}

export interface ConEstado {
  status: Estado;
  urgent: boolean;
}

export function filtrar<T extends ConEstado>(orders: readonly T[], filtro: Filtro): T[] {
  if (filtro === "todos") return [...orders];
  if (filtro === "urgentes") return orders.filter((o) => o.urgent);
  return orders.filter((o) => o.status === filtro);
}

export function textoCupos(pedidos: number): string {
  return pedidos >= CUPOS_POR_DIA
    ? "Cupo lleno: los pedidos nuevos pasan a otro día o se marcan como urgentes."
    : CUPOS_POR_DIA - pedidos === 1
      ? "Queda 1 cupo para hoy."
      : `Quedan ${CUPOS_POR_DIA - pedidos} cupos para hoy.`;
}

export function etiquetaDia(pedidos: number, cerrado = false): string {
  if (cerrado) return "Cerrado";
  return pedidos >= CUPOS_POR_DIA ? `Lleno · ${CUPOS_POR_DIA}/${CUPOS_POR_DIA}` : `${pedidos}/${CUPOS_POR_DIA}`;
}
