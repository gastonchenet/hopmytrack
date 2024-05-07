import { test, expect } from "bun:test";
import roundDecimal from "../util/roundDecimal";

test("math-round-decimal", () => {
  expect(roundDecimal(Math.PI, 3)).toBe(3.142);

  expect(roundDecimal(Math.E, 6)).toBe(2.718282);
});
