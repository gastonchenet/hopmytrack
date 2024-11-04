import lookup from "./lookup";
import options, { blacklist } from "./options";
import logger from "./util/logger";
import path from "path";
import fs from "fs";
import type Website from "./structures/Website";
import chalk from "chalk";
import readYamlFile from "read-yaml-file";
import type { SearchData } from "./structures/Result";
import help from "./commands/help";
import version from "./commands/version";
import interactive from "./interactive";
import update from "./commands/update";

function randomHex(length: number): string {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

if (Object.values(options).every((value) => !value)) {
  interactive();
} else if (options.update) {
  update();
} else if (options.version) {
  version();
} else if (options.help) {
  help();
} else {
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
        )}${chalk.gray(":")}\n${typeWebsites
          .map(
            (w) =>
              `${chalk.gray("-")} ${w.title} ${chalk.gray(`(id: ${w.id})`)}${
                w.nsfw
                  ? ` ${chalk.gray("(")}${chalk.red("!")}${chalk.gray(")")}`
                  : ""
              }`
          )
          .join("\n")}`
      );
    }

    process.exit(0);
  }

  if (!options.input) {
    logger.error("No input string/file provided.");
    process.exit(1);
  }

  logger.log("Searching for unavailable websites...");

  const blackSheep = await lookup(
    { username: randomHex(16) },
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

  if (/\.ya?ml$/.test(options.input)) {
    lookup(
      await readYamlFile<SearchData>(path.join(process.cwd(), options.input))
    );
  } else {
    const entries = options.input.split(";");

    if (entries.length === 0) {
      logger.error("Invalid input string.");
      process.exit(1);
    }

    const data: SearchData = {};

    entries.forEach((entry: string) => {
      const [key, value] = entry.split(":") as [keyof SearchData, string];

      if (!/^[a-z_]+$/.test(key)) {
        logger.error(`Invalid key '${key}'.`);
        process.exit(1);
      }

      if (!/^[a-zA-Z0-9,._-]+$/.test(value)) {
        logger.error(`Invalid value '${value}'.`);
        process.exit(1);
      }

      if (value.includes(",")) {
        data[key] = value.split(",") as
          | (string & (string | Location) & string[])
          | undefined;
      } else {
        data[key] = value as
          | (string & (string | Location) & string[])
          | undefined;
      }
    });

    lookup(data);
  }
}
