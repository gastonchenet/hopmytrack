import Result, { type ProbValue } from "../structures/Result";

export type FindUsernamesOptions = {
  regex?: RegExp;
  excludeUsernames?: boolean;
  excludeNames?: boolean;
};

const SEPARATORS = Object.freeze(["", "_", ".", " ", "-"]);
const DEFAULT_SEPARATOR = SEPARATORS.filter((s) => s.length > 0)[0];

function derivateUsername(username: ProbValue<string>) {
  const from = [
    username,
    { value: username.value + "_", prob: username.prob * Result.Prob.LIKELY },
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
          prob: username.prob * Result.Prob.LIKELY,
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
      prob: Result.Prob.LIKELY,
    }),
    ...derivateUsername({
      value: `${firstName[0]}${DEFAULT_SEPARATOR}${lastName}`,
      prob: Result.Prob.MAYBE,
    }),
  ];

  return usernames;
}

export default function makeUsernames(
  previousResult: Result,
  options: FindUsernamesOptions = {}
): ProbValue<string>[] {
  const usernames: ProbValue<string>[] = [];

  if (!options.excludeUsernames)
    previousResult.usernames.forEach((username) => {
      derivateUsername(username).forEach((username) => {
        if (!usernames.some((u) => u.value === username.value)) {
          usernames.push(username);
        }
      });
    });

  if (!options.excludeNames)
    if (previousResult.firstName && previousResult.lastName)
      derivateNames(previousResult.firstName, previousResult.lastName).forEach(
        (username) => {
          if (!usernames.some((u) => u.value === username.value)) {
            usernames.push(username);
          }
        }
      );

  if (options.regex) {
    return usernames.filter((username) => options.regex!.test(username.value));
  }

  return usernames;
}
