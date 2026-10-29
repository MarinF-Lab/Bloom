// Catálogo de Bloom: lo usan la tienda y la app de gestión.

export type Tipo = "torta" | "pie" | "postre" | "pan";
export type Etiqueta = "Más vendido" | "Sin gluten" | "Nuevo" | "Promoción" | "Agotado";

export interface Producto {
  id: string;
  name: string;
  /** Tamaño completo, para la tienda. */
  size: string;
  /** Tamaño corto, para la app de gestión. */
  sizeShort: string;
  cat: string;
  kind: Tipo;
  price: number;
  tags: Etiqueta[];
  desc: string;
}

export const PRODUCTS: Producto[] = [
  { id: "p1", name: "Torta tres leches", size: "26 cm · 20 a 25 porciones", sizeShort: "26 cm", cat: "Tortas", kind: "torta", price: 30500, tags: ["Más vendido"], desc: "Bizcocho genovés con relleno de manjar, remojo de tres leches y cubierta de crema tipo chantilly." },
  { id: "p2", name: "Torta tres leches sin gluten", size: "26 cm · 20 a 25 porciones", sizeShort: "26 cm", cat: "Tortas", kind: "torta", price: 36500, tags: ["Sin gluten", "Más vendido"], desc: "Bizcocho genovés sin gluten con relleno de manjar, remojo de tres leches y crema tipo chantilly." },
  { id: "p3", name: "Torta chocolate frambuesa", size: "18 cm · 10 porciones aprox.", sizeShort: "18 cm", cat: "Tortas", kind: "torta", price: 25500, tags: [], desc: "Bizcocho húmedo de chocolate, ganache de chocolate y confit de frambuesa, con cobertura de chocolate." },
  { id: "p4", name: "Pie de limón", size: "12 porciones", sizeShort: "12 porciones", cat: "Pies y tartaletas", kind: "pie", price: 17000, tags: ["Más vendido"], desc: "Base de masa casera con relleno de pie de limón, cubierto con merengue o chantilly." },
  { id: "p5", name: "Tartaleta de yogurt y berries", size: "12 porciones", sizeShort: "12 porciones", cat: "Pies y tartaletas", kind: "pie", price: 17500, tags: [], desc: "Base de masa casera con relleno de yogurt, leche condensada y berries." },
  { id: "p6", name: "Tiramisú", size: "15 porciones", sizeShort: "15 porciones", cat: "Postres", kind: "postre", price: 38000, tags: ["Más vendido"], desc: "Soletillas remojadas en café, capas de crema de mascarpone y cacao amargo espolvoreado." },
  { id: "p7", name: "Roles de canela", size: "4 unidades", sizeShort: "4 unidades", cat: "Panadería dulce", kind: "pan", price: 4500, tags: [], desc: "Roles de canela con frosting de queso crema." },
];

export const CATS = ["Todo", "Tortas", "Pies y tartaletas", "Postres", "Panadería dulce"];

/** Fondo de la tarjeta según el tipo de producto. */
export const TINTS: Record<Tipo, string> = { torta: "#F7DDE3", pie: "#F6E9C8", postre: "#EFE3D3", pan: "#E6EAD2" };

/** [fondo, texto] de cada etiqueta. */
export const TAG_STYLE: Record<Etiqueta, [string, string]> = {
  "Más vendido": ["#6B4A33", "#FCF7EC"],
  "Sin gluten": ["#5A6635", "#FFFDF8"],
  Nuevo: ["#A84F68", "#FFFDF8"],
  Promoción: ["#F6E9C8", "#6A4A12"],
  Agotado: ["#ECE6DC", "#5E5248"],
};
