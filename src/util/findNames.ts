import type { ProbValue } from "../structures/Result";
import males from "../data/males.json";
import females from "../data/females.json";
import findInPage from "./findInPage";
import { Gender } from "../structures/Result";
import unobfuscate from "./unobfuscate";

const REGEX = new RegExp(
  `(?<=^|[^\\w])(?<firstName>${males.join("|")}|${females.join(
    "|"
  )})(?:[\\s\\n](?<lastName>[a-z]{2,}))?(?=$|[^\\w])`,
  "gi"
);

export function nameComplexity(name: string) {
  return name.length / (name.length + 1);
}

export function getGender(firstName: string) {
  let gender;

  if (males.includes(firstName.trim().toLowerCase())) gender = Gender.MALE;
  if (females.includes(firstName.trim().toLowerCase()))
    gender = gender === undefined ? Gender.FEMALE : undefined;

  return gender;
}

export default function findNames(
  html: string,
  selector?: string
): { firstNames: ProbValue<string>[]; lastNames: ProbValue<string>[] } {
  html = unobfuscate(html.toLowerCase());
  if (selector) html = findInPage(html, selector.toLowerCase());

  const firstNames: ProbValue<string>[] = [];
  const lastNames: ProbValue<string>[] = [];

  const firstNameCounts: Record<string, number> = {};
  const lastNameCounts: Record<string, number> = {};

  let match;

  while ((match = REGEX.exec(html))) {
    const firstName = match.groups?.firstName;
    const lastName = match.groups?.lastName;

    if (firstName) {
      if (!firstNameCounts[firstName]) firstNameCounts[firstName] = 0;
      firstNameCounts[firstName]++;
    }

    if (lastName) {
      if (!lastNameCounts[lastName]) lastNameCounts[lastName] = 0;
      lastNameCounts[lastName]++;
    }
  }

  const maxFirstNameCount = Math.max(...Object.values(firstNameCounts));
  const maxLastNameCount = Math.max(...Object.values(lastNameCounts));

  for (const [firstName, count] of Object.entries(firstNameCounts)) {
    firstNames.push({
      value: firstName,
      prob: count / maxFirstNameCount,
      new: true,
    });
  }

  for (const [lastName, count] of Object.entries(lastNameCounts)) {
    lastNames.push({
      value: lastName,
      prob: count / maxLastNameCount,
      new: true,
    });
  }

  return { firstNames, lastNames };
}
