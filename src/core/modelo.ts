// Modelo de datos de Bloom: lo que se guarda en la cuenta (Firestore) y comparten la gestión y la tienda.
// Todo lo leído pasa por normalizar…(): si falta un campo o viene mal, se usa el valor por defecto.

import type { Zona } from "./cart";
import type { Estado } from "./orders";
import type { Ingrediente } from "./recipes";

export type Temporada = "Navidad" | "Año Nuevo" | "San Valentín" | "Fiestas Patrias" | "Primavera" | "Ninguna";
export const TEMPORADAS: Temporada[] = ["Navidad", "Año Nuevo", "San Valentín", "Fiestas Patrias", "Primavera", "Ninguna"];

export type Tipo = "torta" | "pie" | "postre" | "pan";
export const TIPOS: { key: Tipo; label: string }[] = [
  { key: "torta", label: "Torta" },
  { key: "pie", label: "Pie o tartaleta" },
  { key: "postre", label: "Postre" },
  { key: "pan", label: "Panadería" },
];

export type Etiqueta = "Más vendido" | "Sin gluten" | "Nuevo" | "Promoción" | "Agotado";
/** Etiquetas que se eligen a mano ("Agotado" sale solo al apagar un producto). */
export const ETIQUETAS: Etiqueta[] = ["Más vendido", "Sin gluten", "Nuevo", "Promoción"];

/** Configuración de la tienda: se edita en la gestión y la tienda la muestra. Es pública. */
export interface Config {
  nombre: string;
  texto: string;
  /** Solo dígitos, con código de país: 56957973831. */
  whatsapp: string;
  /** Usuario sin "@": _bloompasteleria.cl */
  instagram: string;
  horario: string;
  ubicacion: string;
  zonas: Zona[];
  /** Desde este subtotal el despacho es gratis; 0 = nunca. */
  envioGratisDesde: number;
  /** Si está cerrada, la tienda muestra el catálogo pero no recibe pedidos. */
  abierta: boolean;
  horasMinimas: number;
  abonoPct: number;
  cuposPorDia: number;
  temporada: Temporada;
}

export const CONFIG_INICIAL: Config = {
  nombre: "Bloom Pastelería",
  texto: "Pastelería casera y personalizada, hecha con amor en Retiro. Tortas, pies, tartaletas y postres por encargo para tus celebraciones.",
  whatsapp: "56957973831",
  instagram: "_bloompasteleria.cl",
  horario: "Lunes a sábado, 7:30 a 20:00",
  ubicacion: "Retiro, Región del Maule",
  zonas: [
    { key: "local", label: "Retiro en domicilio de Bloom", fee: 0 },
    { key: "retiro", label: "Despacho en Retiro", fee: 1000 },
    { key: "copihue", label: "Despacho en Copihue", fee: 1500 },
    { key: "parral", label: "Despacho en Parral", fee: 2000 },
  ],
  envioGratisDesde: 40000,
  abierta: true,
  horasMinimas: 24,
  abonoPct: 50,
  cuposPorDia: 5,
  temporada: "Navidad",
};

export interface Producto {
  id: string;
  name: string;
  /** Tamaño completo, para la tienda. */
  size: string;
  /** Tamaño corto, para la gestión. */
  sizeShort: string;
  cat: string;
  kind: Tipo;
  price: number;
  tags: Etiqueta[];
  desc: string;
  /** Apagado = «Agotado» en la tienda. */
  disponible: boolean;
  orden: number;
}

export interface ItemPedido {
  nombre: string;
  cant: number;
  precio: number;
}

export interface Pedido {
  id: string;
  cliente: string;
  whatsapp: string;
  /** Resumen de lo pedido: "Torta tres leches 26 cm". */
  producto: string;
  items: ItemPedido[];
  /** Total del pedido. */
  precio: number;
  abono: number;
  /** "2026-10-29" */
  fecha: string;
  /** "15:30" o vacío. */
  hora: string;
  canal: string;
  entrega: string;
  notas: string;
  estado: Estado;
  urgente: boolean;
  origen: "gestion" | "tienda";
  /** Llegó de la tienda y aún no se confirma. */
  nuevo: boolean;
  /** Se rechazó: queda guardado pero no se muestra. */
  rechazado: boolean;
  creado: string;
}

export interface Receta {
  id: string;
  name: string;
  kind: Tipo;
  portions: number;
  unit: string;
  price: number;
  ingredients: Ingrediente[];
  steps: string[];
}

export interface Cliente {
  id: string;
  name: string;
  whatsapp: string;
  canal: string;
  /** Cumpleaños "2000-10-30" (solo importan mes y día) o vacío. */
  cumple: string;
}

export interface Insumo {
  id: string;
  name: string;
  amount: string;
  /** 0 a 100. */
  level: number;
}

export interface Ajustes {
  recordatorios: { dia: boolean; cumple: boolean };
}

export const AJUSTES_INICIALES: Ajustes = { recordatorios: { dia: true, cumple: true } };

export const CANALES = ["WhatsApp", "Instagram", "Web", "Presencial", "Otro"];

// ---------- normalización ----------

type Crudo = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (typeof v === "string" ? v : d);
const num = (v: unknown, d = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const bool = (v: unknown, d: boolean): boolean => (typeof v === "boolean" ? v : d);
const de = <T extends string>(v: unknown, opciones: readonly T[], d: T): T => (opciones.includes(v as T) ? (v as T) : d);
const ESTADOS: Estado[] = ["pendiente", "horno", "listo", "entregado"];

export function normalizarConfig(c: Crudo | null | undefined): Config {
  const x = c ?? {};
  const zonas = Array.isArray(x.zonas)
    ? (x.zonas as Crudo[])
        .map((z, i) => ({ key: str(z?.key) || `z${i}`, label: str(z?.label).trim(), fee: Math.max(0, num(z?.fee)) }))
        .filter((z) => z.label)
    : [];
  const I = CONFIG_INICIAL;
  return {
    nombre: str(x.nombre, I.nombre) || I.nombre,
    texto: str(x.texto, I.texto),
    whatsapp: soloDigitos(str(x.whatsapp, I.whatsapp)),
    instagram: str(x.instagram, I.instagram).replace(/^@/, "").trim(),
    horario: str(x.horario, I.horario),
    ubicacion: str(x.ubicacion, I.ubicacion),
    zonas: zonas.length ? zonas : I.zonas,
    envioGratisDesde: Math.max(0, num(x.envioGratisDesde, I.envioGratisDesde)),
    abierta: bool(x.abierta, I.abierta),
    horasMinimas: Math.max(0, num(x.horasMinimas, I.horasMinimas)),
    abonoPct: Math.min(100, Math.max(0, num(x.abonoPct, I.abonoPct))),
    cuposPorDia: Math.max(1, Math.round(num(x.cuposPorDia, I.cuposPorDia))),
    temporada: de(x.temporada, TEMPORADAS, I.temporada),
  };
}

export function normalizarProducto(id: string, x: Crudo): Producto {
  const tags = Array.isArray(x.tags) ? (x.tags as unknown[]).filter((t): t is Etiqueta => ETIQUETAS.includes(t as Etiqueta)) : [];
  return {
    id,
    name: str(x.name).trim() || "Producto sin nombre",
    size: str(x.size),
    sizeShort: str(x.sizeShort) || str(x.size),
    cat: str(x.cat).trim() || "Otros",
    kind: de(x.kind, ["torta", "pie", "postre", "pan"] as const, "torta"),
    price: Math.max(0, num(x.price)),
    tags,
    desc: str(x.desc),
    disponible: bool(x.disponible, true),
    orden: num(x.orden),
  };
}

export function normalizarPedido(id: string, x: Crudo): Pedido {
  const items = Array.isArray(x.items)
    ? (x.items as Crudo[]).map((i) => ({ nombre: str(i?.nombre), cant: Math.max(1, num(i?.cant, 1)), precio: Math.max(0, num(i?.precio)) })).filter((i) => i.nombre)
    : [];
  return {
    id,
    cliente: str(x.cliente).trim() || "Sin nombre",
    whatsapp: str(x.whatsapp),
    producto: str(x.producto) || items.map((i) => `${i.cant > 1 ? i.cant + " x " : ""}${i.nombre}`).join(", "),
    items,
    precio: Math.max(0, num(x.precio)),
    abono: Math.max(0, num(x.abono)),
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(str(x.fecha)) ? str(x.fecha) : "",
    hora: /^\d{2}:\d{2}$/.test(str(x.hora)) ? str(x.hora) : "",
    canal: str(x.canal) || (x.origen === "tienda" ? "Web" : "WhatsApp"),
    entrega: str(x.entrega),
    notas: str(x.notas),
    estado: de(x.estado, ESTADOS, "pendiente"),
    urgente: bool(x.urgente, false),
    origen: x.origen === "tienda" ? "tienda" : "gestion",
    nuevo: bool(x.nuevo, false),
    rechazado: bool(x.rechazado, false),
    creado: str(x.creado),
  };
}

export function normalizarReceta(id: string, x: Crudo): Receta {
  const ingredients = Array.isArray(x.ingredients)
    ? (x.ingredients as Crudo[]).map((i) => ({ name: str(i?.name), qty: str(i?.qty), cost: Math.max(0, num(i?.cost)) })).filter((i) => i.name)
    : [];
  return {
    id,
    name: str(x.name).trim() || "Receta sin nombre",
    kind: de(x.kind, ["torta", "pie", "postre", "pan"] as const, "torta"),
    portions: Math.max(1, Math.round(num(x.portions, 1))),
    unit: str(x.unit) || "porciones",
    price: Math.max(0, num(x.price)),
    ingredients,
    steps: Array.isArray(x.steps) ? (x.steps as unknown[]).map((s) => str(s).trim()).filter(Boolean) : [],
  };
}

export function normalizarCliente(id: string, x: Crudo): Cliente {
  return { id, name: str(x.name).trim() || "Sin nombre", whatsapp: str(x.whatsapp), canal: str(x.canal), cumple: str(x.cumple) };
}

export function normalizarInsumo(id: string, x: Crudo): Insumo {
  return { id, name: str(x.name).trim() || "Insumo", amount: str(x.amount), level: Math.min(100, Math.max(0, Math.round(num(x.level)))) };
}

export function normalizarAjustes(x: Crudo | null | undefined): Ajustes {
  const r = (x?.recordatorios ?? {}) as Crudo;
  return { recordatorios: { dia: bool(r.dia, true), cumple: bool(r.cumple, true) } };
}

// ---------- ayudas ----------

export function soloDigitos(s: string): string {
  return s.replace(/\D/g, "");
}

/** 56957973831 → "+56 9 5797 3831". Otros largos se muestran con "+" y sin espacios. */
export function telefonoLegible(digitos: string): string {
  const d = soloDigitos(digitos);
  const m = /^56(9)(\d{4})(\d{4})$/.exec(d);
  return m ? `+56 ${m[1]} ${m[2]} ${m[3]}` : d ? "+" + d : "";
}

/** Id corto para documentos nuevos. */
export function nuevoId(prefijo: string, ahora: number = Date.now()): string {
  return prefijo + ahora.toString(36) + Math.floor(Math.random() * 1296).toString(36).padStart(2, "0");
}

/** Id de cliente a partir del nombre: "Camila R." → "camila-r". */
export function idCliente(nombre: string): string {
  return (
    nombre
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "cliente"
  );
}

/** Quita campos undefined (Firestore no los acepta). */
export function limpio<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}
