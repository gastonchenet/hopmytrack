import Result, { type SearchData } from "./structures/Result";
import websites from "./websites";
import fs from "fs";
import path from "path";
import Website from "./structures/Website";
import logger from "./util/logger";
import chalk from "chalk";
import options, { allowed } from "./options";

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

function handleResult(result: Result) {
  if (interval) clearInterval(interval);
  process.stdout.write("\r\x1b[K\u001B[?25h");
  if (options.verbose) console.log();
  logger.writeResult(result);

  if (options.output) {
    const outFile = path.join(process.cwd(), options.output);
    const outDir = path.dirname(outFile);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outFile, result.toString());

    if (options.verbose) {
      logger.log(
        !options["no-color"]
          ? chalk.green(`Data successfully written to '${outFile}'`)
          : `Data successfully written to '${outFile}'`
      );
    }
  }
}

async function recursion(result: Result, iteration = 0) {
  if (!options.verbose && iteration === 0) {
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

  if (options.depth !== null && iteration >= options.depth) {
    handleResult(result);
    return;
  }

  if (options.verbose) {
    logger.log(
      `Recursion ${
        !options["no-color"] ? chalk.cyan(iteration + 1) : iteration + 1
      }${!options["no-color"] ? chalk.black("/") : "/"}${
        !options["no-color"]
          ? chalk.cyan(options.depth ?? "∞")
          : options.depth ?? "Inf"
      }`
    );
  }

  const previousResult = result.copy();

  await Promise.all(
    websites.map(async (w) => {
      if (!w.fetchFunction) return [];

      const website: Website = require(path.join(
        __dirname,
        w.fetchFunction
      )).default;

      if (!allowed(website.id, website.type)) return [];
      await website.execute(result);
    })
  );

  result.nextTurn();

  if (previousResult.equals(result)) {
    handleResult(result);
    return;
  }

  recursion(result, iteration + 1);
}

export default async function lookup(searchData: SearchData) {
  const result = await Result.fromSearchData(searchData);
  recursion(result);
}
