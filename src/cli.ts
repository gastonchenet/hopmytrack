import lookup from "./lookup";
import tool from "../tool.json";
import options, { blacklist, optionList } from "./options";
import logger from "./util/logger";
import path from "path";
import fs from "fs";
import type Website from "./structures/Website";
import chalk from "chalk";
import { randomBytes } from "crypto";
import readYamlFile from "read-yaml-file";
import type { SearchData } from "./structures/Result";

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

if (options.info) {
  const websites: Website[] = fs
    .readdirSync(path.join(__dirname, "websites"))
    .map((file) => {
      return require(path.join(__dirname, "websites", file)).default;
    });

  const website = websites.find(
    (website) =>
      website.id === options.info.toLowerCase() ||
      website.title.toLowerCase().replace(/[^a-z0-9]/g, "") ===
        options.info.toLowerCase().replace(/[^a-z0-9]/g, "")
  );

  const typeWebsites = websites.filter(
    (website) => website.type.toLowerCase() === options.info.toLowerCase()
  );

  if (!website && typeWebsites.length === 0) {
    logger.error(`Website '${options.info}' not found.`);
    process.exit(1);
  }

  if (website) {
    console.log(website.toString());
  }

  if (typeWebsites.length > 0) {
    console.log(
      `Websites of type ${chalk.cyan(
        chalk.italic(options.info.toUpperCase())
      )}${chalk.black(":")}\n${typeWebsites
        .map(
          (w) =>
            `${chalk.black("-")} ${w.title} ${chalk.black(`(id: ${w.id})`)}`
        )
        .join("\n")}`
    );
  }

  process.exit(0);
}

if (!options.input) {
  logger.error("No input file provided.");
  process.exit(1);
}

logger.log("Searching for unavailable websites...");

const blackSheep = await lookup(
  { username: randomBytes(8).toString("hex") },
  { depth: 1, log: false, derivateUsername: false }
);

if (blackSheep.urls.length === 0) {
  logger.log("No unavailable websites found.");
} else {
  logger.log(
    `Found ${blackSheep.urls.length} unavailable website${
      blackSheep.urls.length > 1 ? "s" : ""
    }.`
  );
}

blacklist.push(...new Set(blackSheep.urls.map((r) => r.id)));

lookup(await readYamlFile<SearchData>(path.join(process.cwd(), options.input)));
