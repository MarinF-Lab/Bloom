import { describe, expect, it } from "vitest";
import { enPaginaGestion, vistaDesdeHash, vistaInicial } from "./vista";

const B = "https://marinf-lab.github.io/Bloom/";

describe("vistaInicial", () => {
  it("abre la tienda en la raíz de la web", () => {
    expect(vistaInicial(B)).toBe("tienda");
    expect(vistaInicial(B + "#catalogo")).toBe("tienda");
  });
  it("abre la gestión con /gestion/, #gestion o ?gestion", () => {
    expect(vistaInicial(B + "gestion/")).toBe("gestion");
    expect(vistaInicial(B + "gestion")).toBe("gestion");
    expect(vistaInicial(B + "gestion/index.html")).toBe("gestion");
    expect(vistaInicial(B + "#gestion")).toBe("gestion");
    expect(vistaInicial(B + "?gestion")).toBe("gestion");
  });
});

describe("vistaDesdeHash", () => {
  it("solo #gestion y #tienda cambian de pantalla", () => {
    expect(vistaDesdeHash("#gestion", "tienda")).toBe("gestion");
    expect(vistaDesdeHash("#tienda", "gestion")).toBe("tienda");
    expect(vistaDesdeHash("#pedido", "tienda")).toBe("tienda");
    expect(vistaDesdeHash("", "gestion")).toBe("gestion");
  });
});

describe("enPaginaGestion", () => {
  it("reconoce la carpeta gestion y nada más", () => {
    expect(enPaginaGestion("/Bloom/gestion/")).toBe(true);
    expect(enPaginaGestion("/Bloom/")).toBe(false);
    expect(enPaginaGestion("/Bloom/gestiones/")).toBe(false);
  });
});
