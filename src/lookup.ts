import Result, { type SearchData } from "./structures/Result";
import websites from "./websites";
import fs from "fs";
import path from "path";
import logger from "./util/logger";
import chalk from "chalk";
import options, { allowed } from "./options";
import verifyProxy from "./util/verifyProxy";

export type LookupOptions = {
  depth?: number | null;
  log?: boolean;
  derivateUsername?: boolean;
};

const SPINNER_CHARS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const FETCHING_MESSAGES = [
  "Sniffin' the web for you",
  "Sending my gobelins to fetch the data",
  "Looking for the data in the dark web",
  "Hacking the mainframe",
  "Entering the matrix",
  "Searching for the data in the deep web",
];

let interval: Timer | null = null;

const message =
  FETCHING_MESSAGES[Math.floor(Math.random() * FETCHING_MESSAGES.length)];

function handleResult(result: Result, lookupOptions: LookupOptions) {
  if (interval) clearInterval(interval);
  process.stdout.write("\r\x1b[K\u001B[?25h");
  if (options.verbose && lookupOptions.log) console.log();
  if (lookupOptions.log) logger.writeResult(result);

  if (options.output) {
    const outFile = path.join(process.cwd(), options.output);
    const outDir = path.dirname(outFile);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outFile, result.toString());

    if (options.verbose && lookupOptions.log) {
      logger.log(
        !options["no-color"]
          ? chalk.green(`Data successfully written to '${outFile}'`)
          : `Data successfully written to '${outFile}'`
      );
    }
  }

  return result;
}

async function recursion(
  result: Result,
  lookupOptions: LookupOptions = {},
  iteration = 0
) {
  if (!options.verbose && lookupOptions.log && iteration === 0) {
    interval = setInterval(() => {
      process.stdout.write(
        `${
          !options["no-color"]
            ? chalk.cyan(SPINNER_CHARS[Math.floor(Date.now() / 100) % 10])
            : SPINNER_CHARS[Math.floor(Date.now() / 100) % 10]
        } ${message}...\u001B[?25l\r`
      );
    }, 100);
  }

  if (!!lookupOptions.depth && iteration >= lookupOptions.depth) {
    return handleResult(result, lookupOptions);
  }

  if (options.verbose && lookupOptions.log) {
    logger.log(
      `Recursion ${
        !options["no-color"] ? chalk.cyan(iteration + 1) : iteration + 1
      }${!options["no-color"] ? chalk.gray("/") : "/"}${
        !options["no-color"]
          ? chalk.cyan(lookupOptions.depth ?? "∞")
          : lookupOptions.depth ?? "Inf"
      }`
    );
  }

  const previousResult = result.copy();

  await Promise.all(
    websites.map(async ({ website }) => {
      if (!website || !allowed(website.id, website.type)) return [];
      await website.execute(result, lookupOptions);
    })
  );

  result.nextTurn();

  if (previousResult.equals(result)) {
    return handleResult(result, lookupOptions);
  }

  return await recursion(result, lookupOptions, iteration + 1);
}

export default async function lookup(
  searchData: SearchData,
  lookupOptions: LookupOptions = {}
) {
  if (options.proxy && !(await verifyProxy(options.proxy))) {
    logger.error("Invalid proxy, your proxy should be rotative.");
    process.exit(1);
  }

  lookupOptions.depth = lookupOptions.depth ?? options.depth;
  lookupOptions.log = lookupOptions.log ?? true;
  lookupOptions.derivateUsername = lookupOptions.derivateUsername ?? true;

  const result = await recursion(
    await Result.fromSearchData(searchData),
    lookupOptions
  );

  return result;
}
