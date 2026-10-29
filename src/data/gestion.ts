// Datos de ejemplo de la app de gestión.

import type { Estado } from "../core/orders";
import type { Ingrediente } from "../core/recipes";
import type { Tipo } from "./productos";

export const HOY = "Jueves 29 de octubre";
export const AVISO_MANANA = { title: "Mañana viernes 30:", text: "3 entregas · cumpleaños de Camila R." };

export interface Pedido {
  id: number;
  client: string;
  product: string;
  price: number;
  when: string;
  channel: string;
  delivery: string;
  status: Estado;
  urgent: boolean;
}

export const ORDERS: Pedido[] = [
  { id: 1, client: "Camila R.", product: "Torta tres leches 26 cm", price: 31500, when: "Hoy 11:00", channel: "WhatsApp", delivery: "Despacho en Retiro", status: "entregado", urgent: false },
  { id: 2, client: "Javiera M.", product: "Tiramisú 15 porciones", price: 40000, when: "Hoy 15:30", channel: "Instagram", delivery: "Despacho en Parral", status: "horno", urgent: false },
  { id: 3, client: "Diego S.", product: "Pie de limón 12 porciones", price: 17000, when: "Hoy 17:00", channel: "Web", delivery: "Retiro en domicilio", status: "pendiente", urgent: true },
  { id: 4, client: "Fernanda L.", product: "Roles de canela x4 (2 cajas)", price: 10500, when: "Hoy 19:00", channel: "WhatsApp", delivery: "Despacho en Copihue", status: "pendiente", urgent: false },
];

export interface Dia {
  dow: string;
  num: number;
  label: string;
  count: number;
  closed?: boolean;
  items: string[];
}

export const DAYS: Dia[] = [
  { dow: "Jue", num: 29, label: "Hoy", count: 4, items: ["11:00 · Camila R. · Torta tres leches", "15:30 · Javiera M. · Tiramisú", "17:00 · Diego S. · Pie de limón (urgente)", "19:00 · Fernanda L. · Roles de canela"] },
  { dow: "Vie", num: 30, label: "Mañana", count: 3, items: ["10:00 · Paula G. · Torta chocolate frambuesa", "13:00 · Tomás V. · Tartaleta de berries", "18:00 · Ignacia P. · Torta tres leches sin gluten"] },
  { dow: "Sáb", num: 31, label: "Sábado", count: 5, items: ["09:00 · Mesa dulce cumpleaños", "11:00 · Caja desayuno dulce", "12:30 · Tiramisú", "16:00 · Torta tres leches", "18:00 · Pie de limón"] },
  { dow: "Dom", num: 1, label: "Domingo", count: 0, closed: true, items: [] },
  { dow: "Lun", num: 2, label: "Lunes", count: 1, items: ["12:00 · Fernanda L. · Torta de cumpleaños"] },
  { dow: "Mar", num: 3, label: "Martes", count: 2, items: ["10:30 · Pie de limón", "17:00 · Roles de canela"] },
  { dow: "Mié", num: 4, label: "Miércoles", count: 0, items: [] },
];

export const REMINDERS = [
  { key: "dia", label: "Avisarme las entregas del día siguiente" },
  { key: "cumple", label: "Avisarme cumpleaños de clientes" },
];

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

export const RECIPES: Receta[] = [
  {
    id: "r1", name: "Torta tres leches 26 cm", kind: "torta", portions: 22, unit: "porciones", price: 30500,
    ingredients: [["Huevos", "10 unid", 2500], ["Harina", "300 g", 450], ["Azúcar", "500 g", 750], ["Manjar", "500 g", 2200], ["Leche evaporada", "2 tarros", 2600], ["Leche condensada", "2 tarros", 3800], ["Leche entera", "500 ml", 600], ["Crema", "600 ml", 3600]],
    steps: ["Preparar el bizcocho genovés y hornear a 180 °C por 35 minutos.", "Cortar en capas y rellenar con manjar.", "Remojar con la mezcla de tres leches.", "Cubrir con crema tipo chantilly y refrigerar 6 horas."],
  },
  {
    id: "r2", name: "Pie de limón 12 porciones", kind: "pie", portions: 12, unit: "porciones", price: 17000,
    ingredients: [["Harina", "250 g", 375], ["Mantequilla", "125 g", 1400], ["Limones", "6 unid", 1200], ["Leche condensada", "2 tarros", 3800], ["Huevos", "4 unid", 1000], ["Azúcar", "150 g", 225]],
    steps: ["Preparar la masa, forrar el molde y hornear en blanco.", "Mezclar jugo de limón, leche condensada y yemas; rellenar.", "Cubrir con merengue o chantilly."],
  },
  {
    id: "r3", name: "Tiramisú 15 porciones", kind: "postre", portions: 15, unit: "porciones", price: 38000,
    ingredients: [["Soletillas", "400 g", 3200], ["Mascarpone", "500 g", 6500], ["Crema", "400 ml", 2400], ["Huevos", "4 unid", 1000], ["Azúcar", "120 g", 180], ["Café", "300 ml", 900], ["Cacao amargo", "20 g", 400]],
    steps: ["Batir yemas con azúcar e integrar el mascarpone y la crema.", "Remojar las soletillas en café e intercalar con la crema.", "Espolvorear cacao y refrigerar 8 horas."],
  },
];

export const CLIENTS = [
  { name: "Camila R.", orders: 5, channel: "WhatsApp", bday: "Cumple mañana", soon: true },
  { name: "Fernanda L.", orders: 3, channel: "WhatsApp", bday: "Cumple 2 nov", soon: true },
  { name: "Javiera M.", orders: 2, channel: "Instagram", bday: "14 dic", soon: false },
  { name: "Diego S.", orders: 1, channel: "Web", bday: "Sin fecha", soon: false },
];

export const SUPPLIES = [
  { id: "s1", name: "Mascarpone", amount: "0 g", level: 0 },
  { id: "s2", name: "Crema", amount: "200 ml", level: 15 },
  { id: "s3", name: "Huevos", amount: "6 unid", level: 20 },
  { id: "s4", name: "Chocolate", amount: "400 g", level: 40 },
  { id: "s5", name: "Manjar", amount: "1 kg", level: 50 },
  { id: "s6", name: "Harina", amount: "3 kg", level: 60 },
  { id: "s7", name: "Leche condensada", amount: "7 tarros", level: 70 },
];

/** Cifras de ejemplo del resumen. */
export const VENTAS_EJEMPLO = { semana: "$412.000", mes: "Octubre", totalMes: "$1.386.500" };
export const ESTRELLAS = "Tres leches · Tiramisú · Pie de limón";
