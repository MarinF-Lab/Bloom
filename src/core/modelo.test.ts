import { describe, expect, it } from "vitest";
import { CONFIG_INICIAL, idCliente, normalizarConfig, normalizarPedido, normalizarProducto, normalizarReceta, telefonoLegible } from "./modelo";

describe("normalizar", () => {
  it("completa la configuración con los valores iniciales", () => {
    expect(normalizarConfig(null)).toEqual(CONFIG_INICIAL);
    const c = normalizarConfig({ whatsapp: "+56 9 1111 2222", instagram: "@bloom", abonoPct: 150, cuposPorDia: 0, zonas: [{ label: "  " }], temporada: "Halloween" });
    expect(c.whatsapp).toBe("56911112222");
    expect(c.instagram).toBe("bloom");
    expect(c.abonoPct).toBe(100);
    expect(c.cuposPorDia).toBe(1);
    expect(c.zonas).toEqual(CONFIG_INICIAL.zonas);
    expect(c.temporada).toBe("Navidad");
  });
  it("limpia un producto", () => {
    const p = normalizarProducto("x", { name: " Kuchen ", price: -5, tags: ["Nuevo", "Raro"], kind: "otro" });
    expect(p).toMatchObject({ id: "x", name: "Kuchen", price: 0, tags: ["Nuevo"], kind: "torta", disponible: true, cat: "Otros" });
  });
  it("arma el resumen del pedido desde sus ítems", () => {
    const p = normalizarPedido("a", { cliente: "Ana", items: [{ nombre: "Tiramisú", cant: 2, precio: 38000 }], origen: "tienda", fecha: "mal" });
    expect(p.producto).toBe("2 x Tiramisú");
    expect(p.canal).toBe("Web");
    expect(p.fecha).toBe("");
    expect(p.estado).toBe("pendiente");
  });
  it("lee recetas con ingredientes como objetos", () => {
    const r = normalizarReceta("r", { name: "Pie", portions: 0, ingredients: [{ name: "Harina", qty: "1 kg", cost: 900 }, { name: "" }] });
    expect(r.portions).toBe(1);
    expect(r.ingredients).toEqual([{ name: "Harina", qty: "1 kg", cost: 900 }]);
  });
});

describe("ayudas", () => {
  it("muestra el teléfono chileno con espacios", () => {
    expect(telefonoLegible("56957973831")).toBe("+56 9 5797 3831");
    expect(telefonoLegible("")).toBe("");
  });
  it("arma el id del cliente desde el nombre", () => {
    expect(idCliente("Camila R.")).toBe("camila-r");
    expect(idCliente("Íñigo Pérez")).toBe("inigo-perez");
  });
});
