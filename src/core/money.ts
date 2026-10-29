/** Pesos chilenos con punto de miles: 30500 → "$30.500". */
export function clp(n: number): string {
  const digits = String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 ? "-$" : "$") + digits;
}
