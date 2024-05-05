import type { ProbValue } from "../structures/Result";
import findInPage from "./findInPage";
import Result from "../structures/Result";

export default function findPhones(
  html: string,
  selector?: string
): ProbValue<string>[] {
  if (selector) html = findInPage(html, selector);

  const results: ProbValue<string>[] = [];
  const phones: Record<string, number> = {};

  const regex = /(\+?[\d\s\-]{7,})(?:x\d+)?/g;
  let match;

  while ((match = regex.exec(html))) {
    const email = match[0];

    if (!phones[email]) phones[email] = 0;
    phones[email]++;
  }

  const maxMatches = Math.max(...Object.values(phones));

  for (const [email, count] of Object.entries(phones)) {
    results.push({
      value: email,
      prob: (count / maxMatches) * Result.Prob.LIKELY,
    });
  }

  return results;
}
