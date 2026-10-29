import { describe, expect, it } from "vitest";
import { etiquetaDia, filtrar, siguienteEstado, textoCupos } from "./orders";

const O = [
  { id: 1, estado: "entregado", urgente: false },
  { id: 2, estado: "horno", urgente: false },
  { id: 3, estado: "pendiente", urgente: true },
  { id: 4, estado: "pendiente", urgente: false },
] as const;

describe("pedidos", () => {
  it("avanza el estado en ciclo", () => {
    expect(siguienteEstado("pendiente")).toBe("horno");
    expect(siguienteEstado("horno")).toBe("listo");
    expect(siguienteEstado("listo")).toBe("entregado");
    expect(siguienteEstado("entregado")).toBe("pendiente");
  });
  it("filtra por estado y urgencia", () => {
    expect(filtrar(O, "todos")).toHaveLength(4);
    expect(filtrar(O, "urgentes").map((o) => o.id)).toEqual([3]);
    expect(filtrar(O, "pendiente").map((o) => o.id)).toEqual([3, 4]);
    expect(filtrar(O, "listo")).toEqual([]);
  });
  it("cuenta los cupos del día", () => {
    expect(textoCupos(4)).toBe("Queda 1 cupo para hoy.");
    expect(textoCupos(2)).toBe("Quedan 3 cupos para hoy.");
    expect(textoCupos(5)).toMatch(/^Cupo lleno/);
    expect(etiquetaDia(3)).toBe("3/5");
    expect(etiquetaDia(5)).toBe("Lleno · 5/5");
    expect(etiquetaDia(0, true)).toBe("Cerrado");
  });
});
