import { describe, expect, it } from "vitest";
import { despacho, fechaLarga, fechaMinima, linkWhatsApp, mensajePedido, resumen, setCantidad, subtotal, totalUnidades, type Zona } from "./cart";

const P = [
  { id: "p1", name: "Torta tres leches", price: 30500 },
  { id: "p4", name: "Pie de limón", price: 17000 },
  { id: "p7", name: "Roles de canela", price: 4500 },
];
const RETIRO: Zona = { key: "retiro", label: "Despacho en Retiro", fee: 1000 };
const LOCAL: Zona = { key: "local", label: "Retiro en domicilio de Bloom", fee: 0 };

describe("cantidades", () => {
  it("suma, resta y quita en cero", () => {
    let q = setCantidad({}, "p1", 1);
    q = setCantidad(q, "p7", 2);
    expect(totalUnidades(q)).toBe(3);
    q = setCantidad(q, "p7", 0);
    expect(q).toEqual({ p1: 1 });
  });
  it("no cambia el original", () => {
    const q = { p1: 1 };
    setCantidad(q, "p1", 3);
    expect(q).toEqual({ p1: 1 });
  });
});

describe("totales", () => {
  it("calcula el subtotal", () => {
    expect(subtotal(P, { p1: 1, p7: 2 })).toBe(39500);
  });
  it("cobra despacho bajo $40.000 y lo regala desde ahí", () => {
    expect(despacho(RETIRO, 39999)).toBe(1000);
    expect(despacho(RETIRO, 40000)).toBe(0);
    expect(despacho(LOCAL, 100)).toBe(0);
  });
  it("arma el resumen con abono del 50 %", () => {
    const r = resumen(P, { p1: 1, p7: 1 }, RETIRO);
    expect(r).toEqual({ subtotal: 35000, despacho: 1000, total: 36000, abono: 18000, gratis: false, faltaParaGratis: 5000 });
    const g = resumen(P, { p1: 1, p4: 1 }, RETIRO);
    expect(g.despacho).toBe(0);
    expect(g.gratis).toBe(true);
    expect(g.faltaParaGratis).toBe(0);
  });
});

describe("mensaje de WhatsApp", () => {
  it("lista productos, entrega y total", () => {
    expect(mensajePedido(P, { p1: 1, p7: 2 }, RETIRO)).toBe(
      "Hola Bloom, quiero hacer este pedido: 1 x Torta tres leches, 2 x Roles de canela. Entrega: Despacho en Retiro. Total: $40.500.",
    );
  });
  it("agrega fecha, código y dedicatoria si los hay", () => {
    const m = mensajePedido(P, { p4: 1 }, LOCAL, { fecha: "2026-10-31", codigo: " bloom10 ", dedicatoria: "Para Ana" });
    expect(m).toContain("Fecha: 31/10/2026.");
    expect(m).toContain("Código de descuento: BLOOM10.");
    expect(m).toContain("Dedicatoria: Para Ana.");
  });
  it("arma el link con el texto codificado", () => {
    expect(linkWhatsApp("56957973831", "Hola Bloom")).toBe("https://wa.me/56957973831?text=Hola%20Bloom");
  });
});

describe("fechas", () => {
  it("la fecha mínima es mañana, también a fin de mes", () => {
    expect(fechaMinima(new Date(2026, 9, 29))).toBe("2026-10-30");
    expect(fechaMinima(new Date(2026, 11, 31))).toBe("2027-01-01");
  });
  it("muestra la fecha en formato chileno", () => {
    expect(fechaLarga("2026-11-02")).toBe("02/11/2026");
    expect(fechaLarga("mañana")).toBe("mañana");
  });
});
