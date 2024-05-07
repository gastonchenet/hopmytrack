import findInPage from "./findInPage";
import websites from "../websites";
import Result from "../structures/Result";

type RawResult = {
	id: string;
	username: string;
	title: string;
	url: string;
	prob: number;
};

export default function findUrls(
	parent: Result,
	html: string,
	exceptions?: string[],
	selector?: string
): Result[] {
	if (selector) html = findInPage(html, selector);

	const results: RawResult[] = [];

	for (const website of websites) {
		if (!website.regex) continue;
		const matches = [...html.matchAll(website.regex)];
		const filtered = matches.filter(
			(m) => !exceptions?.some((e) => m[0].includes(e))
		);

		if (filtered.length > 0) {
			const firstMatch = filtered[0];
			if (!firstMatch.groups?.username) continue;

			const result: RawResult = {
				id: website.id,
				username: firstMatch.groups?.username,
				title: website.title!,
				url: firstMatch[0],
				prob: filtered.length,
			};

			results.push(result);
		}
	}

	const maxMatches = Math.max(...results.map((result) => result.prob));

	return results.map((r) => {
		const result = new Result({
			id: r.id,
			title: r.title,
			url: r.url,
			prob: ((r.prob * Result.Prob.LIKELY) / maxMatches) * Result.Prob.LIKELY,
		});

		result.setParent(parent);
		result.addUsername(r.username, result.prob);

		return result;
	});
}
