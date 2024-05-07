import { expect, test } from "bun:test";
import makeUsernames from "../util/makeUsernames";
import Result from "../structures/Result";

const data = await Result.fromSearchData({
  username: "j0hn",
  firstName: "John",
  lastName: "Doe",
});

test("usernames-make", () => {
  expect(makeUsernames(data)).toStrictEqual([
    { prob: Result.Prob.LIKELY, value: "j0hn" },
    { prob: Result.Prob.LIKELY * Result.Prob.LIKELY, value: "j0hn_" },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "j0hn.",
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "j0hn-",
    },
    { prob: Result.Prob.LIKELY, value: "john_doe" },
    { prob: Result.Prob.LIKELY * Result.Prob.LIKELY, value: "john_doe_" },
    { prob: Result.Prob.LIKELY * Result.Prob.LIKELY, value: "johndoe" },
    { prob: Result.Prob.LIKELY * Result.Prob.LIKELY, value: "john.doe" },
    { prob: Result.Prob.LIKELY * Result.Prob.LIKELY, value: "john doe" },
    { prob: Result.Prob.LIKELY * Result.Prob.LIKELY, value: "john-doe" },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "john.doe.",
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "john-doe-",
    },
    { prob: Result.Prob.MAYBE, value: "j_doe" },
    { prob: Result.Prob.LIKELY * Result.Prob.MAYBE, value: "j_doe_" },
    { prob: Result.Prob.LIKELY * Result.Prob.MAYBE, value: "jdoe" },
    { prob: Result.Prob.LIKELY * Result.Prob.MAYBE, value: "j.doe" },
    { prob: Result.Prob.LIKELY * Result.Prob.MAYBE, value: "j doe" },
    { prob: Result.Prob.LIKELY * Result.Prob.MAYBE, value: "j-doe" },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE * Result.Prob.LIKELY,
      value: "j.doe.",
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE * Result.Prob.LIKELY,
      value: "j-doe-",
    },
  ]);
});
