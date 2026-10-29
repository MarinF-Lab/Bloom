// Costos de recetas: total, por porción y margen sobre el precio de venta.

/** [nombre, cantidad, costo] */
export type Ingrediente = readonly [string, string, number];

export function costoReceta(ingredientes: readonly Ingrediente[]): number {
  return ingredientes.reduce((a, i) => a + i[2], 0);
}

export function costoPorPorcion(costo: number, porciones: number): number {
  return porciones > 0 ? Math.round(costo / porciones) : 0;
}

/** Margen en % redondeado: (precio − costo) / precio. */
export function margen(precio: number, costo: number): number {
  return precio > 0 ? Math.round(((precio - costo) / precio) * 100) : 0;
}
