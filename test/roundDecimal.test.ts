import { test, expect } from "bun:test";
import roundDecimal from "../src/util/roundDecimal";

test("Invalid round value", () => {
	expect(() => roundDecimal(Math.random(), 0)).toThrowError();
	expect(() => roundDecimal(Math.random(), -1)).toThrowError();
});

test("Round integer", () => {
	expect(roundDecimal(1, 1)).toBe(1);
	expect(roundDecimal(1, 2)).toBe(1);
	expect(roundDecimal(1, 3)).toBe(1);
});

test("Round decimal", () => {
	expect(roundDecimal(Math.PI, 1)).toBe(3.1);
	expect(roundDecimal(Math.PI, 2)).toBe(3.14);
	expect(roundDecimal(Math.PI, 3)).toBe(3.142);
});
