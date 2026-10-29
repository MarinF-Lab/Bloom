// Fechas en formato "2026-10-29" (hora local) y sus textos en español.

import { ymd } from "./cart";

export { ymd };

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function aFecha(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function sumarDias(s: string, n: number): string {
  const d = aFecha(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
}

const mayus = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** "Jueves 29 de octubre" */
export function fechaTitulo(s: string): string {
  const d = aFecha(s);
  return `${mayus(DIAS[d.getDay()]!)} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

/** "Hoy", "Mañana", "Sábado 31". */
export function diaRelativo(s: string, hoy: string): string {
  if (s === hoy) return "Hoy";
  if (s === sumarDias(hoy, 1)) return "Mañana";
  if (s === sumarDias(hoy, -1)) return "Ayer";
  const d = aFecha(s);
  return `${mayus(DIAS[d.getDay()]!)} ${d.getDate()}`;
}

export function diaCorto(s: string): string {
  return DIAS_CORTOS[aFecha(s).getDay()]!;
}

export function nombreDia(s: string): string {
  return DIAS[aFecha(s).getDay()]!;
}

export function nombreMes(s: string): string {
  return mayus(MESES[aFecha(s).getMonth()]!);
}

/** Lunes de la semana de esa fecha. */
export function inicioSemana(s: string): string {
  const d = aFecha(s).getDay();
  return sumarDias(s, d === 0 ? -6 : 1 - d);
}

/** ¿El cumpleaños (cualquier año) cae ese día? */
export function esCumple(cumple: string, s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(cumple) && cumple.slice(5) === s.slice(5);
}

/** "30 oct" a partir de un cumpleaños. */
export function cumpleCorto(cumple: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cumple)) return "Sin fecha";
  const d = aFecha(cumple);
  return `${d.getDate()} ${MESES[d.getMonth()]!.slice(0, 3)}`;
}
