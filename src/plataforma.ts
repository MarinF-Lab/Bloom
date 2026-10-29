/** ¿Corre dentro de la app de Android? (La web también puede tener window.Capacitor, sin ser la app.) */
export function enApp(): boolean {
  const c = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return typeof c?.isNativePlatform === "function" && c.isNativePlatform();
}
