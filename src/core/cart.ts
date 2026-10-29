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

/** Despacho a cobrar: gratis al retirar o con subtotal desde `gratisDesde` (0 = nunca gratis). */
export function despacho(zona: Zona, sub: number, gratisDesde: number = ENVIO_GRATIS_DESDE): number {
  return zona.fee === 0 || (gratisDesde > 0 && sub >= gratisDesde) ? 0 : zona.fee;
}

export interface Reglas {
  /** Desde este subtotal el despacho es gratis; 0 = nunca. */
  gratisDesde: number;
  /** Porcentaje del total que se abona para reservar. */
  abonoPct: number;
}

export const REGLAS_INICIALES: Reglas = { gratisDesde: ENVIO_GRATIS_DESDE, abonoPct: 50 };

export interface Resumen {
  subtotal: number;
  despacho: number;
  total: number;
  /** Lo que se abona para reservar (abonoPct del total). */
  abono: number;
  gratis: boolean;
  faltaParaGratis: number;
}

export function resumen(products: readonly ConPrecio[], q: Cantidades, zona: Zona, reglas: Reglas = REGLAS_INICIALES): Resumen {
  const sub = subtotal(products, q);
  const fee = despacho(zona, sub, reglas.gratisDesde);
  const total = sub + fee;
  const conGratis = reglas.gratisDesde > 0;
  return {
    subtotal: sub,
    despacho: fee,
    total,
    abono: Math.round((total * reglas.abonoPct) / 100),
    gratis: conGratis && sub >= reglas.gratisDesde,
    faltaParaGratis: conGratis ? Math.max(0, reglas.gratisDesde - sub) : 0,
  };
}

export interface Extras {
  nombre?: string;
  fecha?: string;
  codigo?: string;
  dedicatoria?: string;
}

/** Texto del pedido que se envía por WhatsApp. */
export function mensajePedido(products: readonly ConPrecio[], q: Cantidades, zona: Zona, extras: Extras = {}, reglas: Reglas = REGLAS_INICIALES): string {
  const items = products.filter((p) => q[p.id]).map((p) => `${q[p.id]} x ${p.name}`);
  const r = resumen(products, q, zona, reglas);
  const partes = [`Hola Bloom, quiero hacer este pedido: ${items.join(", ")}.`, `Entrega: ${zona.label}.`];
  if (extras.nombre?.trim()) partes.push(`Nombre: ${extras.nombre.trim()}.`);
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

/** Fecha mínima de entrega, `horas` después de ahora, en formato de <input type="date">. */
export function fechaMinima(hoy: Date = new Date(), horas = 24): string {
  return ymd(new Date(hoy.getTime() + Math.max(0, horas) * 3600_000));
}

/** Fecha local en formato "2026-10-29". */
export function ymd(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function linkWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
