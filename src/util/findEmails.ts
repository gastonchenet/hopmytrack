import type { Email, ProbValue } from "../structures/Result";
import findInPage from "./findInPage";
import Result from "../structures/Result";

export default function findEmails(
  html: string,
  selector?: string
): ProbValue<Email>[] {
  if (selector) html = findInPage(html, selector);

  const results: ProbValue<Email>[] = [];
  const emails: Record<string, number> = {};

  const regex = /[\w.]+@[\w.]+\.[a-z]{2,}/gi;
  let match;

  while ((match = regex.exec(html))) {
    const email = match[0];

    if (!emails[email]) emails[email] = 0;
    emails[email]++;
  }

  const maxMatches = Math.max(...Object.values(emails));

  for (const [email, count] of Object.entries(emails)) {
    results.push({
      value: email,
      prob: (count / maxMatches) * Result.Prob.LIKELY,
      verified: false,
      new: true,
    });
  }

  return results;
}
