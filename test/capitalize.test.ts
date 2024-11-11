import { expect, test } from "bun:test";
import capitalize from "../src/util/capitalize";

test("Capitalize null", () => {
	expect(capitalize()).toBeNull();
	expect(capitalize(null)).toBeNull();
	expect(capitalize(null, true)).toBeNull();
});

test("Capitalize text", () => {
	expect(capitalize("hello")).toBeString();

	expect(capitalize("hi, how are you ?")).toBe("Hi, how are you ?");
	expect(capitalize("hi, how are you ?", true)).toBe("Hi, How Are You ?");
});
