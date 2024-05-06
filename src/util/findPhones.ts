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

	const regex = /\+?(?:[0-9] ?){6,14}[0-9]/g;
	let match;

	while ((match = regex.exec(html))) {
		const phone = match[0];

		if (!phones[phone]) phones[phone] = 0;
		phones[phone]++;
	}

	const maxMatches = Math.max(...Object.values(phones));

	for (const [phone, count] of Object.entries(phones)) {
		results.push({
			value: phone,
			prob: (count / maxMatches) * Result.Prob.LIKELY,
		});
	}

	return results;
}
