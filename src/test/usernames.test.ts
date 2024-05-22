import { expect, test } from "bun:test";
import makeUsernames from "../util/makeUsernames";
import Result from "../structures/Result";

const data = await Result.fromSearchData({
  username: "j0hn",
  first_name: "John",
  last_name: "Doe",
});

test("usernames-make", () => {
  expect(makeUsernames(data)).toStrictEqual([
    {
      prob: Result.Prob.LIKELY,
      value: "j0hn",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "j0hn_",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "j0hn.",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "j0hn-",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY,
      value: "john_doe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "john_doe_",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "johndoe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "john.doe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "john doe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "john-doe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "john.doe.",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.LIKELY * Result.Prob.LIKELY,
      value: "john-doe-",
      new: true,
    },
    {
      prob: Result.Prob.MAYBE,
      value: "j_doe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE,
      value: "j_doe_",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE,
      value: "jdoe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE,
      value: "j.doe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE,
      value: "j doe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE,
      value: "j-doe",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE * Result.Prob.LIKELY,
      value: "j.doe.",
      new: true,
    },
    {
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE * Result.Prob.LIKELY,
      value: "j-doe-",
      new: true,
    },
  ]);
});
