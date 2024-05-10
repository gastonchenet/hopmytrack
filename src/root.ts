import lookup from "./cli";
import tool from "../tool.json";
import options, { optionList } from "./options";
import logger from "./util/logger";

process.on("unhandledRejection", (reason) => {
  process.stdout.write("\r\x1b[K\u001B[?25h");
  logger.error(reason as Error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  process.stdout.write("\r\x1b[K\u001B[?25h");
  logger.error(error as Error);
  process.exit(1);
});

process.on("SIGINT", function () {
  process.stdout.write("\r\x1b[K\u001B[?25h");
  logger.log("Caught interrupt signal, exiting...");
  process.exit(1);
});

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

lookup({
  username: "wonderhunter",
});
