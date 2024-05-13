import Result, { type ProbValue } from "../structures/Result";

export type FindUsernamesOptions = {
  regex?: RegExp;
  excludeUsernames?: boolean;
  excludeNames?: boolean;
};

const SEPARATORS = Object.freeze(["", "_", ".", " ", "-"]);
const DEFAULT_SEPARATOR = SEPARATORS.filter((s) => s.length > 0)[0];
const SEPARATOR_WEIGHT = 2;
const NUMBER_WEIGHT = 5;
const SPECIAL_WEIGHT = 10;

export function usernameComplexity(username: string) {
  const length = username.length;

  const separators =
    (username.match(/[_\-. ]/g)?.length ?? 0) * SEPARATOR_WEIGHT;

  const numbers = (username.match(/[0-9]/g)?.length ?? 0) * NUMBER_WEIGHT;

  const specials =
    (username.match(/[^a-zA-Z0-9_\-. ]/g)?.length ?? 0) * SPECIAL_WEIGHT;

  return (
    Math.max(
      0,
      (length + separators + numbers + specials) /
        (length + separators + numbers + specials + 1) -
        0.5
    ) * 2
  );
}

function removeDuplicateUsernames(usernames: ProbValue<string>[]) {
  const uniqueUsernames: ProbValue<string>[] = [];

  usernames.forEach((username) => {
    if (!uniqueUsernames.some((u) => u.value === username.value)) {
      uniqueUsernames.push(username);
    }
  });

  return uniqueUsernames;
}

function derivateUsername(username: ProbValue<string>) {
  const from = [
    username,
    { value: username.value + "_", prob: username.prob, new: true },
  ];

  const usernames: ProbValue<string>[] = [...from];

  from.forEach((username) => {
    SEPARATORS.forEach((separator) => {
      const newUsername = username.value.replace(
        new RegExp(`[${SEPARATORS.filter((s) => s.length > 0).join("")}]`, "g"),
        separator
      );

      if (!usernames.some((u) => u.value === newUsername.trim())) {
        usernames.push({
          value: newUsername.trim(),
          prob: Result.Prob.SURE,
          new: true,
        });
      }
    });
  });

  return usernames;
}

function derivateNames(firstName: string, lastName: string) {
  const usernames: ProbValue<string>[] = [
    ...derivateUsername({
      value: `${firstName}${DEFAULT_SEPARATOR}${lastName}`,
      prob: Result.Prob.SURE,
      new: true,
    }),
    ...derivateUsername({
      value: `${firstName[0]}${DEFAULT_SEPARATOR}${lastName}`,
      prob: Result.Prob.SURE,
      new: true,
    }),
  ];

  return usernames;
}

export default function makeUsernames(
  previousResult: Result,
  options: FindUsernamesOptions = {}
): ProbValue<string>[] {
  const usernames: ProbValue<string>[] = [];

  if (!options.excludeUsernames) {
    previousResult.usernames
      .filter((u) => !u.new)
      .forEach((username) => {
        derivateUsername(username).forEach((username) => {
          if (!usernames.some((u) => u.value === username.value)) {
            usernames.push(username);
          }
        });
      });
  }

  if (!options.excludeNames) {
    const { likely } = previousResult;

    if (likely.firstName && likely.lastName)
      derivateNames(likely.firstName.value, likely.lastName.value).forEach(
        (username) => {
          if (!usernames.some((u) => u.value === username.value)) {
            usernames.push(username);
          }
        }
      );
  }

  if (options.regex) {
    return removeDuplicateUsernames(
      usernames.filter((username) => options.regex!.test(username.value))
    );
  }

  return removeDuplicateUsernames(usernames);
}
