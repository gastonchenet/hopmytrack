import { test, expect } from "bun:test";
import findNames from "../util/findNames";
import Result from "../structures/Result";

test("names-find", () => {
  expect(findNames("My name is John Doe")).toStrictEqual({
    firstNames: [{ value: "John", prob: Result.Prob.LIKELY }],
    lastNames: [{ value: "Doe", prob: Result.Prob.LIKELY }],
  });

  expect(
    findNames("My name is John Doe and I work with Jane Doe")
  ).toStrictEqual({
    firstNames: [
      { value: "John", prob: Result.Prob.LIKELY },
      { value: "Jane", prob: Result.Prob.LIKELY },
    ],
    lastNames: [{ value: "Doe", prob: Result.Prob.LIKELY }],
  });
});
