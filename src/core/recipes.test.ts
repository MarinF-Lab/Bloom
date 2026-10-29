import { describe, expect, it } from "vitest";
import { costoPorPorcion, costoReceta, margen } from "./recipes";
import { RECIPES } from "../data/gestion";

describe("recetas", () => {
  it("suma el costo de los ingredientes", () => {
    expect(costoReceta([["Huevos", "10 unid", 2500], ["Harina", "300 g", 450]])).toBe(2950);
  });
  it("calcula costo por porción y margen", () => {
    expect(costoPorPorcion(16500, 22)).toBe(750);
    expect(margen(30500, 16500)).toBe(46);
    expect(costoPorPorcion(100, 0)).toBe(0);
    expect(margen(0, 100)).toBe(0);
  });
  it("las recetas de ejemplo dan los números del diseño", () => {
    const tres = RECIPES.find((r) => r.id === "r1")!;
    const c = costoReceta(tres.ingredients);
    expect(c).toBe(16500);
    expect(margen(tres.price, c)).toBe(46);
  });
});
