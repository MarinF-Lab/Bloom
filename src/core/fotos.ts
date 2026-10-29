// Fotos de productos, como en la tienda Shop: se achican en el teléfono y van a Firestore
// (sin Firebase Storage). Aquí va la parte de cálculo, sin navegador.

/** Lado mayor de una foto de producto, en px. */
export const FOTO_MAX = 800;
/** Firestore acepta hasta 1 MB por documento: la foto (en data URL) queda bajo esto. */
export const FOTO_LIMITE = 700000;
export const CALIDAD_INICIAL = 0.82;
export const CALIDAD_MINIMA = 0.4;

/** Medidas achicadas para que el lado mayor no pase de `max`. Nunca agranda. */
export function medidasAchicadas(w: number, h: number, max: number = FOTO_MAX): { w: number; h: number } {
  const k = Math.min(1, max / Math.max(w, h, 1));
  return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)) };
}

/** Calidades JPG que se prueban, de mayor a menor, hasta que la foto entre en el límite. */
export function calidades(): number[] {
  const out: number[] = [];
  for (let q = CALIDAD_INICIAL; q > CALIDAD_MINIMA - 1e-9; q -= 0.12) out.push(Math.round(q * 100) / 100);
  return out;
}

/** Id del documento de la foto. Con prefijo, para no mezclarse con otras tiendas de la misma cuenta. */
export function idFoto(productoId: string): string {
  return "bloom-" + productoId;
}
