import { expect, test } from "bun:test";
import findInPage from "../util/findInPage";

const PAGE = `<DOCTYPE html>
<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <div class="test-1">Test 1</div>
    <div class="test-2">Test 2</div>
  </body>
</html>`;

test("page-find", () => {
  expect(findInPage(PAGE, ".test-1")).toBe('<div class="test-1">Test 1</div>');

  expect(findInPage(PAGE, ".test-1, .test-2")).toBe(
    '<div class="test-1">Test 1</div><div class="test-2">Test 2</div>'
  );
});
