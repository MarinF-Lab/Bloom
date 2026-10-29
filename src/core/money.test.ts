import { describe, expect, it } from "vitest";
import { clp } from "./money";

describe("clp", () => {
  it("pone punto de miles", () => {
    expect(clp(0)).toBe("$0");
    expect(clp(950)).toBe("$950");
    expect(clp(4500)).toBe("$4.500");
    expect(clp(30500)).toBe("$30.500");
    expect(clp(1386500)).toBe("$1.386.500");
  });
  it("redondea y marca negativos", () => {
    expect(clp(1234.6)).toBe("$1.235");
    expect(clp(-2000)).toBe("-$2.000");
  });
});
