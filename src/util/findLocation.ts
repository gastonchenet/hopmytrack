import type { Location, ProbValue } from "../structures/Result";
import Result from "../structures/Result";
import findInPage from "./findInPage";
import { detect } from "country-in-text-detector";
import unobfuscate from "./unobfuscate";

export function parseLocation(location: Location): string {
  return location.city
    ? `${location.city.toLowerCase()}, ${location.country.toLowerCase()}`
    : location.country.toLowerCase();
}

export function getLocation(text: string): Location {
  const matches = detect(text);
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

  const locations: ProbValue<Location>[] = [];
  const matches = detect(html);

  const locationCounts: { [key: string]: number } = {};

  matches.forEach((match) => {
    const { type, name, countryName } = match;
    const city = type === "city" ? name : undefined;
    const country = type === "country" ? name : countryName;

    if (country) {
      const locationKey = city ? `${country}, ${city}` : country;
      locationCounts[locationKey] = (locationCounts[locationKey] || 0) + 1;
    }
  });

  const totalOccurrences = Object.values(locationCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  Object.entries(locationCounts).forEach(([locationKey, count]) => {
    const [country, city] = locationKey.split("-");
    const prob = (count / totalOccurrences) * Result.Prob.LIKELY;

    const location: Location = { country: country.toLowerCase() };
    if (city) location.city = city.toLowerCase();

    locations.push({ ...location, prob });
  });

  return locations;
}
