// Contenido de la tienda pública.

import type { Zona } from "../core/cart";

/** WhatsApp de Bloom, sin "+" ni espacios. */
export const WHATSAPP = "56957973831";
export const INSTAGRAM = "https://instagram.com/_bloompasteleria.cl";

export type Temporada = "Navidad" | "Año Nuevo" | "San Valentín" | "Fiestas Patrias" | "Primavera" | "Ninguna";

/** Aviso de temporada arriba de la tienda. Cámbialo aquí ("Ninguna" lo oculta). */
export const TEMPORADA: Temporada = "Navidad";

export const SEASONS: Record<Exclude<Temporada, "Ninguna">, { bg: string; fg: string; title: string; text: string }> = {
  Navidad: { bg: "#5A6635", fg: "#FFFDF8", title: "Navidad en Bloom", text: "Reserva tus tortas, cajas dulces y mesas de postres para diciembre." },
  "Año Nuevo": { bg: "#F6E9C8", fg: "#6A4A12", title: "Recibe el año con algo dulce", text: "Postres y mesas dulces para tu celebración de fin de año." },
  "San Valentín": { bg: "#A84F68", fg: "#FFFDF8", title: "San Valentín en Bloom", text: "Cajas de desayuno dulce y tortas para regalar con dedicatoria." },
  "Fiestas Patrias": { bg: "#F7DDE3", fg: "#7E2F47", title: "Fiestas Patrias dulces", text: "Pies, tortas y postres para compartir en septiembre." },
  Primavera: { bg: "#E6EAD2", fg: "#3F4A1F", title: "Llegó la primavera", text: "Tartaletas de berries y postres frescos de temporada." },
};

export const PACKS = [
  { name: "Mesa dulce", desc: "Tortas, postres y dulces coordinados para tu celebración." },
  { name: "Cajas de galletas para regalar", desc: "Galletas en caja de regalo, ideales para un detalle." },
  { name: "Caja de desayuno dulce", desc: "Desayuno sorpresa con mini tortas y algo rico para empezar el día." },
];

export type ParteTorta = "size" | "sponge" | "filling" | "cover";

export const STEPS: { key: ParteTorta; title: string; options: string[] }[] = [
  { key: "size", title: "Tamaño", options: ["18 cm · 10 porciones", "26 cm · 20 a 25 porciones", "Otro tamaño"] },
  { key: "sponge", title: "Bizcocho", options: ["Genovés", "Chocolate húmedo", "Genovés sin gluten"] },
  { key: "filling", title: "Relleno", options: ["Manjar", "Ganache de chocolate", "Confit de frambuesa", "Tres leches"] },
  { key: "cover", title: "Cobertura", options: ["Crema tipo chantilly", "Chocolate", "Merengue"] },
];

export const TORTA_INICIAL: Record<ParteTorta, string> = {
  size: "26 cm · 20 a 25 porciones",
  sponge: "Genovés",
  filling: "Manjar",
  cover: "Crema tipo chantilly",
};

export const ZONES: Zona[] = [
  { key: "local", label: "Retiro en domicilio de Bloom", fee: 0 },
  { key: "retiro", label: "Despacho en Retiro", fee: 1000 },
  { key: "copihue", label: "Despacho en Copihue", fee: 1500 },
  { key: "parral", label: "Despacho en Parral", fee: 2000 },
];

export const FAQ = [
  { q: "¿Con cuánta anticipación debo pedir?", a: "Con al menos 24 horas. Si necesitas algo urgente, escríbenos: si tenemos los insumos, te hacemos un espacio." },
  { q: "¿Cómo reservo mi pedido?", a: "Con un abono del 50% del total. El resto se paga al recibir o retirar." },
  { q: "¿Qué formas de pago aceptan?", a: "Transferencia y efectivo." },
  { q: "¿Hacen despacho?", a: "Sí: Retiro $1.000, Copihue $1.500 y Parral $2.000. Gratis en pedidos sobre $40.000." },
  { q: "¿Tienen opciones sin gluten?", a: "Sí, nuestra torta tres leches también se prepara sin gluten." },
  { q: "¿Puedo pedir una torta personalizada?", a: "Sí. Usa Arma tu torta o el formulario de encargos y la diseñamos contigo." },
];

export const ENCARGO_TIPOS = ["Torta personalizada", "Mesa dulce", "Caja de regalo", "Pedido urgente", "Otro"];

/** Fondos de los espacios para fotos de la galería. */
export const GAL = ["#F7DDE3", "#F6E9C8", "#E6EAD2", "#FBEAEE", "#EFE3D3", "#F7DDE3"];

export const REVIEWS = ["Torta tres leches", "Tiramisú", "Pie de limón"];
