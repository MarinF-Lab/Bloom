// Caja de la tienda: cantidades, despacho, total, abono y el mensaje para WhatsApp.

import { clp } from "./money";

/** Desde este subtotal el despacho es gratis. */
export const ENVIO_GRATIS_DESDE = 40000;

export interface Zona {
  key: string;
  label: string;
  /** Costo de despacho; 0 = retiro sin costo. */
  fee: number;
}

export interface ConPrecio {
  id: string;
  name: string;
  price: number;
}

/** Unidades por producto (id → cantidad). Un producto sin unidades no aparece. */
export type Cantidades = Record<string, number>;

/** Devuelve una copia con la cantidad nueva; con 0 o menos quita el producto. */
export function setCantidad(q: Cantidades, id: string, n: number): Cantidades {
  const copy = { ...q };
  if (n <= 0) delete copy[id];
  else copy[id] = n;
  return copy;
}

export function totalUnidades(q: Cantidades): number {
  return Object.values(q).reduce((a, n) => a + n, 0);
}

export function subtotal(products: readonly ConPrecio[], q: Cantidades): number {
  return products.reduce((a, p) => a + (q[p.id] ?? 0) * p.price, 0);
}

/** Despacho a cobrar: gratis al retirar o con subtotal desde $40.000. */
export function despacho(zona: Zona, sub: number): number {
  return zona.fee === 0 || sub >= ENVIO_GRATIS_DESDE ? 0 : zona.fee;
}

export interface Resumen {
  subtotal: number;
  despacho: number;
  total: number;
  /** 50 % para reservar. */
  abono: number;
  gratis: boolean;
  faltaParaGratis: number;
}

export function resumen(products: readonly ConPrecio[], q: Cantidades, zona: Zona): Resumen {
  const sub = subtotal(products, q);
  const fee = despacho(zona, sub);
  const total = sub + fee;
  return {
    subtotal: sub,
    despacho: fee,
    total,
    abono: Math.round(total / 2),
    gratis: sub >= ENVIO_GRATIS_DESDE,
    faltaParaGratis: Math.max(0, ENVIO_GRATIS_DESDE - sub),
  };
}

export interface Extras {
  fecha?: string;
  codigo?: string;
  dedicatoria?: string;
}

/** Texto del pedido que se envía por WhatsApp. */
export function mensajePedido(products: readonly ConPrecio[], q: Cantidades, zona: Zona, extras: Extras = {}): string {
  const items = products.filter((p) => q[p.id]).map((p) => `${q[p.id]} x ${p.name}`);
  const r = resumen(products, q, zona);
  const partes = [`Hola Bloom, quiero hacer este pedido: ${items.join(", ")}.`, `Entrega: ${zona.label}.`];
  if (extras.fecha) partes.push(`Fecha: ${fechaLarga(extras.fecha)}.`);
  if (extras.codigo?.trim()) partes.push(`Código de descuento: ${extras.codigo.trim().toUpperCase()}.`);
  if (extras.dedicatoria?.trim()) partes.push(`Dedicatoria: ${extras.dedicatoria.trim()}.`);
  partes.push(`Total: ${clp(r.total)}.`);
  return partes.join(" ");
}

/** "2026-10-31" → "31/10/2026". Si no tiene ese formato, se deja igual. */
export function fechaLarga(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/** Fecha mínima de entrega (mañana) en formato de <input type="date">. */
export function fechaMinima(hoy: Date = new Date()): string {
  const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function linkWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
