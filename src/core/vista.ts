// Qué pantalla abrir según la dirección.

export type Vista = "tienda" | "gestion";

/**
 * La gestión se abre con /gestion/ (dirección propia, no depende del "#"), con #gestion o con ?gestion.
 * "#tienda" fuerza la tienda. Sin nada de eso: la tienda.
 */
export function vistaInicial(url: string): Vista {
  const u = new URL(url);
  if (u.hash === "#tienda") return "tienda";
  if (u.hash === "#gestion" || u.searchParams.has("gestion") || enPaginaGestion(u.pathname)) return "gestion";
  return "tienda";
}

/** Al cambiar el "#" ya abierta la página: solo #gestion y #tienda cambian de pantalla. */
export function vistaDesdeHash(hash: string, actual: Vista): Vista {
  if (hash === "#gestion") return "gestion";
  if (hash === "#tienda") return "tienda";
  return actual;
}

export function enPaginaGestion(pathname: string): boolean {
  return /\/gestion(\/(index\.html)?)?$/.test(pathname);
}
