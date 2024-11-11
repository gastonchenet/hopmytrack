import { test, expect } from "bun:test";
import unobfuscate from "../src/util/unobfuscate";
import letters from "../src/data/letters.json";

function obfuscate(letter: keyof typeof letters) {
	const set = letters[letter];
	const index = Math.floor(Math.random() * set.length);
	return set[index];
}

function randomText(length: number = 10) {
	const text = "abcdefghijklmnopqrstuvwxyz";

	return Array.from({ length }, () =>
		obfuscate(
			text[Math.floor(Math.random() * text.length)] as keyof typeof letters
		)
	).join("");
}

test("Unobfuscate text", () => {
	expect(unobfuscate(randomText())).toBeString();
	expect(unobfuscate(randomText(20))).toHaveLength(20);
	expect(unobfuscate(obfuscate("a"))).toBe("a");
	expect(unobfuscate(randomText())).toMatch(/[a-z]+/);
	expect(unobfuscate("ℌẻḼ⒧0")).toBe("hello");
});
