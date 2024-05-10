import tool from "../tool.json";
import Result from "./structures/Result";
import websites from "./websites";
import fs from "fs";
import path from "path";
import Website from "./structures/Website";
import logger from "./util/logger";
import chalk from "chalk";
import options, { allowed, optionList } from "./options";

const SPINNER_CHARS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

if (options.version) {
  console.log(tool.version);
  process.exit(0);
}

if (options.help) {
  console.log("Options:");

  const largestName = Math.max(
    ...Object.keys(optionList).map((name) => name.length)
  );

  const largestUsage = Math.max(
    ...Object.values(optionList).map((option) => option.usage.length)
  );

  for (const [name, option] of Object.entries(optionList).sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    console.log(
      `  ${name.padEnd(largestName + 3)} -${
        option.alias
      }, ${option.usage.padEnd(largestUsage + 3)} ${option.description}`
    );
  }

  process.exit(0);
}

const result = await Result.fromSearchData({
  username: "du_cassoulet",
});

let interval: Timer | null = null;

if (!options.verbose) {
  interval = setInterval(() => {
    process.stdout.write(
      (!options["no-color"]
        ? chalk.cyan(SPINNER_CHARS[Math.floor(Date.now() / 100) % 10])
        : SPINNER_CHARS[Math.floor(Date.now() / 100) % 10]) +
        " Sniffin' the web for you...\u001B[?25l\r"
    );
  }, 100);
}

function handleResult(result: Result) {
  if (interval) clearInterval(interval);
  process.stdout.write("\r\x1b[K\u001B[?25h");
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

      if (!allowed(website.id)) return [];
      await website.execute(result);
    })
  );

  if (previousResult.equals(result)) {
    handleResult(result);
    return;
  }

  recursion(result, iteration + 1);
}

recursion(result);
