import { test, expect } from "bun:test";
import findLocation, { getLocation, parseLocation } from "../util/findLocation";
import Result from "../structures/Result";

test("location-get", () => {
  expect(getLocation("Paris, France")).toStrictEqual({
    country: "France",
    city: "Paris",
  });

  expect(getLocation("Rome")).toStrictEqual({
    country: "Italy",
    city: "Rome",
  });

  expect(getLocation("USA")).toStrictEqual({
    country: "United States",
  });
});

test("location-find", () => {
  expect(
    findLocation("I live in Paris, in France and I love it")
  ).toStrictEqual([
    {
      country: "France",
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE,
    },
    {
      country: "France, Paris",
      prob: Result.Prob.LIKELY * Result.Prob.MAYBE,
    },
  ]);
});

test("location-parse", () => {
  expect(
    parseLocation({
      country: "France",
      city: "Paris",
    })
  ).toBe("Paris, France");
});
