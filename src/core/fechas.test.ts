import { describe, expect, it } from "vitest";
import { cumpleCorto, diaRelativo, esCumple, fechaTitulo, inicioSemana, sumarDias } from "./fechas";
import { agenda, porHacer, ventas, type PedidoBase } from "./orders";

describe("fechas", () => {
  it("escribe la fecha en español", () => {
    expect(fechaTitulo("2026-10-29")).toBe("Jueves 29 de octubre");
    expect(diaRelativo("2026-10-29", "2026-10-29")).toBe("Hoy");
    expect(diaRelativo("2026-10-30", "2026-10-29")).toBe("Mañana");
    expect(diaRelativo("2026-10-31", "2026-10-29")).toBe("Sábado 31");
  });
  it("suma días y busca el lunes", () => {
    expect(sumarDias("2026-10-31", 1)).toBe("2026-11-01");
    expect(inicioSemana("2026-10-29")).toBe("2026-10-26");
    expect(inicioSemana("2026-11-01")).toBe("2026-10-26");
  });
  it("reconoce cumpleaños", () => {
    expect(esCumple("1990-10-30", "2026-10-30")).toBe(true);
    expect(esCumple("", "2026-10-30")).toBe(false);
    expect(cumpleCorto("1990-12-14")).toBe("14 dic");
  });
});

const p = (id: string, fecha: string, estado: PedidoBase["estado"], precio: number, extra: Partial<PedidoBase> = {}): PedidoBase => ({
  id, fecha, hora: "", estado, precio, urgente: false, rechazado: false, nuevo: false, producto: "Tiramisú", items: [], ...extra,
});

describe("agenda y ventas", () => {
  const ps = [
    p("1", "2026-10-29", "entregado", 30000),
    p("2", "2026-10-29", "pendiente", 10000),
    p("3", "2026-10-30", "pendiente", 5000, { producto: "Pie de limón" }),
    p("4", "2026-10-20", "entregado", 7000),
    p("5", "2026-10-28", "listo", 2000),
    p("6", "2026-10-29", "pendiente", 99000, { rechazado: true }),
    p("7", "2026-10-29", "pendiente", 99000, { nuevo: true }),
  ];
  it("agrupa por día y marca el cupo lleno", () => {
    const a = agenda(ps, "2026-10-29", 3, 2, sumarDias);
    expect(a.map((d) => [d.fecha, d.pedidos.length, d.lleno])).toEqual([["2026-10-29", 2, true], ["2026-10-30", 1, false], ["2026-10-31", 0, false]]);
  });
  it("lista por hacer: futuros y atrasados sin entregar", () => {
    expect(porHacer(ps, "2026-10-29").map((x) => x.id)).toEqual(["5", "1", "2", "3"]);
  });
  it("suma ventas sin rechazados ni nuevos", () => {
    const v = ventas(ps, "2026-10-29", "2026-10-26", "2026-11-01");
    expect(v.hoy).toBe(40000);
    expect(v.cobradoHoy).toBe(30000);
    expect(v.semana).toBe(47000);
    expect(v.mes).toBe(54000);
    expect(v.estrellas[0]).toBe("Tiramisú");
  });
});
