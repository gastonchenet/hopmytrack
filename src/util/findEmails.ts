import type { Email, ProbValue } from "../structures/Result";
import findInPage from "./findInPage";
import Result from "../structures/Result";
import verifyEmail from "./verifyEmail";

export default async function findEmails(
  html: string,
  selector?: string
): Promise<ProbValue<Email>[]> {
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
      verified: await verifyEmail(email),
      new: true,
    });
  }

  return results;
}
