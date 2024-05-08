import letters from "../data/letters.json";

export default function unobfuscate(text: string) {
  Object.entries(letters).forEach(([unobfuscated, obfuscated]) => {
    text = text.replace(new RegExp(`[${obfuscated}]`, "g"), unobfuscated);
  });

  return text;
}
