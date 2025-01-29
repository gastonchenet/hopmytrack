import type { Location, ProbValue } from "../structures/Result";
import Result from "../structures/Result";
import capitalize from "./capitalize";
import detectCountries from "./detectCountries";
import findInPage from "./findInPage";
import unobfuscate from "./unobfuscate";

function removeDuplicateCountries(probs: ProbValue<Location>[]) {
	const uniqueCountries = [...new Set(probs.map((p) => p.country))];
	const newProbs: ProbValue<Location>[] = [];

	for (const country of uniqueCountries) {
		const countryProbs = probs.filter((p) => p.country === country);
		const maxProb = Math.max(...countryProbs.map((p) => p.prob));

		const bestProb = countryProbs.find((p) => p.prob === maxProb);
		if (bestProb) newProbs.push(bestProb);
	}

	return newProbs;
}

export function parseLocation(location: Location): string {
	return location.city
		? `${capitalize(location.city)}, ${capitalize(location.country)}`
		: capitalize(location.country)!;
}

export function getLocation(text: string): Location {
	const matches = detectCountries(text);
	const cityMatch = matches.find((match) => match.type === "city");
	const city = cityMatch?.name;

	const country =
		matches.find((match) => match.type === "country")?.name?.toLowerCase() ??
		cityMatch?.countryName?.toLowerCase() ??
		"unknown";

	const result: Location = { country };
	if (city) result.city = city.toLowerCase();

	return result;
}

export default function findLocation(
	html: string,
	selector?: string
): ProbValue<Location>[] {
	html = unobfuscate(html.toLowerCase());
	if (selector) html = findInPage(html, selector.toLowerCase());

	const matches = detectCountries(html);

	const locationMatches = matches.map((match) => {
		if (match.type === "city") {
			return { city: match.name, country: match.countryName };
		}

		return { country: match.name };
	});

	const probs: ProbValue<Location>[] = locationMatches.map((location) => {
		const countryCount = locationMatches.filter(
			(l) => l.country === location.country && !l.city
		).length;

		if (!location.city)
			return {
				...location,
				prob: (countryCount / locationMatches.length) * Result.Prob.LIKELY,
				new: true,
			};

		const cityCount = locationMatches.filter(
			(l) => l.city === location.city && l.country === location.country
		).length;

		return {
			...location,
			prob: (cityCount / countryCount) * Result.Prob.LIKELY,
			new: true,
		};
	});

	return removeDuplicateCountries(probs);
}
