import { describe, expect, it } from "vitest";
import { calidades, idFoto, medidasAchicadas } from "./fotos";

describe("fotos", () => {
  it("achica por el lado mayor sin deformar", () => {
    expect(medidasAchicadas(4000, 3000)).toEqual({ w: 800, h: 600 });
    expect(medidasAchicadas(1080, 1920)).toEqual({ w: 450, h: 800 });
  });
  it("no agranda fotos chicas", () => {
    expect(medidasAchicadas(300, 200)).toEqual({ w: 300, h: 200 });
  });
  it("baja la calidad de a poco, como en Shop", () => {
    expect(calidades()).toEqual([0.82, 0.7, 0.58, 0.46]);
  });
  it("usa un id con prefijo", () => {
    expect(idFoto("p1")).toBe("bloom-p1");
  });
});
