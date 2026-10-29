// Punto de partida de la gestión: recetas e insumos para una cuenta nueva, y pedidos y clientes
// de ejemplo (solo para "Ver con datos de ejemplo"). Las fechas se calculan desde hoy.

import type { Cliente, Insumo, Pedido, Receta } from "../core/modelo";
import { sumarDias } from "../core/fechas";

export const REMINDERS = [
  { key: "dia", label: "Avisarme las entregas del día siguiente" },
  { key: "cumple", label: "Avisarme cumpleaños de clientes" },
] as const;

export const RECIPES: Receta[] = [
  {
    id: "r1", name: "Torta tres leches 26 cm", kind: "torta", portions: 22, unit: "porciones", price: 30500,
    ingredients: [{ name: "Huevos", qty: "10 unid", cost: 2500 }, { name: "Harina", qty: "300 g", cost: 450 }, { name: "Azúcar", qty: "500 g", cost: 750 }, { name: "Manjar", qty: "500 g", cost: 2200 }, { name: "Leche evaporada", qty: "2 tarros", cost: 2600 }, { name: "Leche condensada", qty: "2 tarros", cost: 3800 }, { name: "Leche entera", qty: "500 ml", cost: 600 }, { name: "Crema", qty: "600 ml", cost: 3600 }],
    steps: ["Preparar el bizcocho genovés y hornear a 180 °C por 35 minutos.", "Cortar en capas y rellenar con manjar.", "Remojar con la mezcla de tres leches.", "Cubrir con crema tipo chantilly y refrigerar 6 horas."],
  },
  {
    id: "r2", name: "Pie de limón 12 porciones", kind: "pie", portions: 12, unit: "porciones", price: 17000,
    ingredients: [{ name: "Harina", qty: "250 g", cost: 375 }, { name: "Mantequilla", qty: "125 g", cost: 1400 }, { name: "Limones", qty: "6 unid", cost: 1200 }, { name: "Leche condensada", qty: "2 tarros", cost: 3800 }, { name: "Huevos", qty: "4 unid", cost: 1000 }, { name: "Azúcar", qty: "150 g", cost: 225 }],
    steps: ["Preparar la masa, forrar el molde y hornear en blanco.", "Mezclar jugo de limón, leche condensada y yemas; rellenar.", "Cubrir con merengue o chantilly."],
  },
  {
    id: "r3", name: "Tiramisú 15 porciones", kind: "postre", portions: 15, unit: "porciones", price: 38000,
    ingredients: [{ name: "Soletillas", qty: "400 g", cost: 3200 }, { name: "Mascarpone", qty: "500 g", cost: 6500 }, { name: "Crema", qty: "400 ml", cost: 2400 }, { name: "Huevos", qty: "4 unid", cost: 1000 }, { name: "Azúcar", qty: "120 g", cost: 180 }, { name: "Café", qty: "300 ml", cost: 900 }, { name: "Cacao amargo", qty: "20 g", cost: 400 }],
    steps: ["Batir yemas con azúcar e integrar el mascarpone y la crema.", "Remojar las soletillas en café e intercalar con la crema.", "Espolvorear cacao y refrigerar 8 horas."],
  },
];

export const SUPPLIES: Insumo[] = [
  { id: "s1", name: "Mascarpone", amount: "0 g", level: 0 },
  { id: "s2", name: "Crema", amount: "200 ml", level: 15 },
  { id: "s3", name: "Huevos", amount: "6 unid", level: 20 },
  { id: "s4", name: "Chocolate", amount: "400 g", level: 40 },
  { id: "s5", name: "Manjar", amount: "1 kg", level: 50 },
  { id: "s6", name: "Harina", amount: "3 kg", level: 60 },
  { id: "s7", name: "Leche condensada", amount: "7 tarros", level: 70 },
];

const pedido = (p: Partial<Pedido> & Pick<Pedido, "id" | "cliente" | "producto" | "precio" | "fecha">): Pedido => ({
  whatsapp: "", items: [], abono: 0, hora: "", canal: "WhatsApp", entrega: "", notas: "", estado: "pendiente",
  urgente: false, origen: "gestion", nuevo: false, rechazado: false, creado: "", ...p,
});

export function pedidosEjemplo(hoy: string): Pedido[] {
  const d = (n: number) => sumarDias(hoy, n);
  return [
    pedido({ id: "e1", cliente: "Camila R.", producto: "Torta tres leches 26 cm", precio: 31500, fecha: hoy, hora: "11:00", entrega: "Despacho en Retiro", estado: "entregado" }),
    pedido({ id: "e2", cliente: "Javiera M.", producto: "Tiramisú 15 porciones", precio: 40000, fecha: hoy, hora: "15:30", canal: "Instagram", entrega: "Despacho en Parral", estado: "horno" }),
    pedido({ id: "e3", cliente: "Diego S.", producto: "Pie de limón 12 porciones", precio: 17000, fecha: hoy, hora: "17:00", canal: "Web", entrega: "Retiro en domicilio de Bloom", urgente: true }),
    pedido({ id: "e4", cliente: "Fernanda L.", producto: "Roles de canela x4 (2 cajas)", precio: 10500, fecha: hoy, hora: "19:00", entrega: "Despacho en Copihue" }),
    pedido({ id: "e5", cliente: "Paula G.", producto: "Torta chocolate frambuesa", precio: 25500, fecha: d(1), hora: "10:00" }),
    pedido({ id: "e6", cliente: "Tomás V.", producto: "Tartaleta de yogurt y berries", precio: 17500, fecha: d(1), hora: "13:00", canal: "Instagram" }),
    pedido({ id: "e7", cliente: "Ignacia P.", producto: "Torta tres leches sin gluten", precio: 36500, fecha: d(2), hora: "18:00" }),
    pedido({
      id: "e8", cliente: "Rocío A.", whatsapp: "56911112222", producto: "1 x Tiramisú, 1 x Roles de canela", precio: 43500, abono: 21750,
      items: [{ nombre: "Tiramisú", cant: 1, precio: 38000 }, { nombre: "Roles de canela", cant: 1, precio: 4500 }],
      fecha: d(3), canal: "Web", entrega: "Despacho en Retiro", origen: "tienda", nuevo: true,
    }),
  ];
}

export function clientesEjemplo(hoy: string): Cliente[] {
  const manana = sumarDias(hoy, 1);
  return [
    { id: "camila-r", name: "Camila R.", whatsapp: "", canal: "WhatsApp", cumple: "1992" + manana.slice(4) },
    { id: "fernanda-l", name: "Fernanda L.", whatsapp: "", canal: "WhatsApp", cumple: "1988-11-02" },
    { id: "javiera-m", name: "Javiera M.", whatsapp: "", canal: "Instagram", cumple: "1995-12-14" },
    { id: "diego-s", name: "Diego S.", whatsapp: "", canal: "Web", cumple: "" },
  ];
}
