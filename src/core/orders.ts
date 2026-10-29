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
  estado: Estado;
  urgente: boolean;
}

export function filtrar<T extends ConEstado>(orders: readonly T[], filtro: Filtro): T[] {
  if (filtro === "todos") return [...orders];
  if (filtro === "urgentes") return orders.filter((o) => o.urgente);
  return orders.filter((o) => o.estado === filtro);
}

export function textoCupos(pedidos: number, cupos: number = CUPOS_POR_DIA): string {
  return pedidos >= cupos
    ? "Cupo lleno: los pedidos nuevos pasan a otro día o se marcan como urgentes."
    : cupos - pedidos === 1
      ? "Queda 1 cupo para hoy."
      : `Quedan ${cupos - pedidos} cupos para hoy.`;
}

export function etiquetaDia(pedidos: number, cerrado = false, cupos: number = CUPOS_POR_DIA): string {
  if (cerrado) return "Cerrado";
  return pedidos >= cupos ? `Lleno · ${cupos}/${cupos}` : `${pedidos}/${cupos}`;
}

// ---------- con pedidos reales ----------

export interface PedidoBase {
  id: string;
  fecha: string;
  hora: string;
  estado: Estado;
  precio: number;
  urgente: boolean;
  rechazado: boolean;
  nuevo: boolean;
  producto: string;
  items: { nombre: string; cant: number }[];
}

/** Por fecha y hora; sin fecha al final. */
export function ordenar<T extends PedidoBase>(pedidos: readonly T[]): T[] {
  const k = (p: T) => (p.fecha || "9999-99-99") + " " + (p.hora || "99:99");
  return [...pedidos].sort((a, b) => k(a).localeCompare(k(b)));
}

/** Los que cuentan: ni rechazados ni sin confirmar. */
export function confirmados<T extends PedidoBase>(pedidos: readonly T[]): T[] {
  return pedidos.filter((p) => !p.rechazado && !p.nuevo);
}

/** Lista de trabajo: de hoy en adelante, más los atrasados que no se han entregado. */
export function porHacer<T extends PedidoBase>(pedidos: readonly T[], hoy: string): T[] {
  return ordenar(confirmados(pedidos).filter((p) => !p.fecha || p.fecha >= hoy || p.estado !== "entregado"));
}

export function delDia<T extends PedidoBase>(pedidos: readonly T[], fecha: string): T[] {
  return ordenar(confirmados(pedidos).filter((p) => p.fecha === fecha));
}

export interface DiaAgenda<T> {
  fecha: string;
  pedidos: T[];
  lleno: boolean;
}

export function agenda<T extends PedidoBase>(pedidos: readonly T[], hoy: string, dias: number, cupos: number, sumarDias: (s: string, n: number) => string): DiaAgenda<T>[] {
  return Array.from({ length: dias }, (_, i) => {
    const fecha = sumarDias(hoy, i);
    const del = delDia(pedidos, fecha);
    return { fecha, pedidos: del, lleno: del.length >= cupos };
  });
}

const suma = (ps: readonly PedidoBase[]) => ps.reduce((a, p) => a + p.precio, 0);

export interface Ventas {
  hoy: number;
  cobradoHoy: number;
  semana: number;
  mes: number;
  porEstado: { key: Estado; label: string; bar: string; count: number }[];
  estrellas: string[];
}

/** Ventas por fecha de entrega. `lunes` = inicio de la semana de hoy. */
export function ventas(pedidos: readonly PedidoBase[], hoy: string, lunes: string, domingo: string): Ventas {
  const ok = confirmados(pedidos);
  const deHoy = ok.filter((p) => p.fecha === hoy);
  const conteo = new Map<string, number>();
  for (const p of ok) {
    const nombres = p.items.length ? p.items.map((i) => [i.nombre, i.cant] as const) : p.producto ? [[p.producto, 1] as const] : [];
    for (const [n, c] of nombres) conteo.set(n, (conteo.get(n) ?? 0) + c);
  }
  return {
    hoy: suma(deHoy),
    cobradoHoy: suma(deHoy.filter((p) => p.estado === "entregado")),
    semana: suma(ok.filter((p) => p.fecha >= lunes && p.fecha <= domingo)),
    mes: suma(ok.filter((p) => p.fecha.slice(0, 7) === hoy.slice(0, 7))),
    porEstado: ESTADOS.map((e) => ({ key: e.key, label: e.label, bar: e.bar, count: deHoy.filter((p) => p.estado === e.key).length })),
    estrellas: [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n),
  };
}
