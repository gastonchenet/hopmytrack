import { test, expect } from "bun:test";
import findEmails from "../util/findEmails";
import Result from "../structures/Result";

test("email-find", () => {
  expect(findEmails("My email address is john@doe.com")).toStrictEqual([
    {
      value: "john@doe.com",
      prob: Result.Prob.LIKELY,
      verified: false,
    },
  ]);

  expect(
    findEmails("Contact us at contact@exemple.com or social@exemple.com")
  ).toStrictEqual([
    {
      value: "contact@exemple.com",
      prob: Result.Prob.LIKELY,
      verified: false,
    },
    {
      value: "social@exemple.com",
      prob: Result.Prob.LIKELY,
      verified: false,
    },
  ]);
});
