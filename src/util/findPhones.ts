import type { Phone, ProbValue } from "../structures/Result";
import findInPage from "./findInPage";
import Result from "../structures/Result";
import { findPhoneNumbersInText, parsePhoneNumber } from "libphonenumber-js";

export function getPhone(text: string): Phone | null {
  const phone = parsePhoneNumber(text);
  if (!phone) return null;

  return {
    value: phone.number,
    country: phone.country,
  };
}

export default function findPhones(
  html: string,
  selector?: string
): ProbValue<string>[] {
  if (selector) html = findInPage(html, selector);

  const results: ProbValue<Phone>[] = [];
  const phones: Record<string, Omit<ProbValue<Phone>, "value">> = {};
  const matches = findPhoneNumbersInText(html);

  for (const match of matches) {
    const phone = match.number.number;
    const country = match.number.country;

    if (phones[phone]) {
      phones[phone].prob++;
    } else {
      phones[phone] = { prob: 1, country, new: true };
    }
  }

  const maxMatches = Math.max(...Object.values(phones).map(({ prob }) => prob));

  for (const [phone, { prob, country }] of Object.entries(phones)) {
    let newProb = (prob / maxMatches) * Result.Prob.LIKELY;

    results.push({
      value: phone,
      prob: newProb,
      country,
      new: true,
    });
  }

  return results;
}
