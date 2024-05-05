import type { ProbValue } from "../structures/Result";
import countries from "../data/countries.json";
import findInPage from "./findInPage";
import Result from "../structures/Result";

export default function findCountries(
  html: string,
  selector?: string
): ProbValue<string>[] {
  if (selector) html = findInPage(html, selector);

  const results: ProbValue<string>[] = [];

  for (const country of countries) {
    const regex = new RegExp(`\\b${country}\\b`, "i");
    const matches = html.match(regex);

    if (matches) {
      results.push({
        value: country,
        prob: matches.length,
      });
    }
  }

  const maxMatches = Math.max(...results.map((result) => result.prob));

  return results.map((result) => ({
    value: result.value,
    prob: (result.prob / maxMatches) * Result.Prob.LIKELY,
  }));
}
