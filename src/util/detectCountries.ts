import countries from "../data/countries.json";
import cities from "../data/cities.json";
import unobfuscate from "./unobfuscate";

type Country = {
  iso3166: string;
  name: string;
  type: "country" | "city";
  matches: string[];
  countryName: string;
};

export default function detectCountries(str: string) {
  const clean = unobfuscate(str);
  const result: Country[] = [];

  countries.forEach((country) => {
    if (!country.string_match || !country.country_name) return;
    const matches = clean.match(new RegExp(country.string_match, "gi")) ?? [];
    if (matches.length === 0) return;

    result.push({
      iso3166: country["country_iso_3166-1_alpha-2"],
      name: country.country_name,
      countryName: country.country_name,
      type: "country",
      matches,
    });
  });

  cities.forEach((city) => {
    if (!city.string_match || !city.country_name) return;
    const matches = clean.match(new RegExp(city.string_match, "gi")) ?? [];
    if (matches.length === 0) return;

    result.push({
      iso3166: city["country_iso_3166-1_alpha-2"],
      name: city.city_name,
      countryName: city.country_name,
      type: "city",
      matches,
    });
  });

  return result;
}
