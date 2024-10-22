import lookup from "./lookup";
import tool from "../tool.json";
import options, { blacklist, optionList } from "./options";
import logger from "./util/logger";
import path from "path";
import fs from "fs";
import type Website from "./structures/Website";
import chalk from "chalk";
import readYamlFile from "read-yaml-file";
import type { SearchData } from "./structures/Result";

function randomHex(length: number): string {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

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
  console.log(
    tool.description
      .replace(new RegExp("HopMyTrack", "g"), chalk.magenta.bold("HopMyTrack"))
      .replace(new RegExp("OSINT", "g"), chalk.bold("OSINT"))
  );

  console.log(chalk.bold("\nUsage:"));
  console.log(`  ${chalk.magenta.bold("hmt")} [...flags]`);

  console.log(chalk.bold("\nExamples:"));
  console.log(
    `  ${chalk.magenta.bold("hmt")} -I ${chalk.green(
      '"username:example;first_name:John;last_name:Doe"'
    )} -V! -b github -d 5 -o output.txt\n  ${chalk.gray(
      "# Search for 'John Doe' with the username 'example' in verbose mode with NSFW enabled, blacklist GitHub and search for 5 levels deep, output the results to 'output.txt'."
    )}`
  );

  console.log(
    `\n  ${chalk.magenta.bold(
      "hmt"
    )} -I info.yml -Vc -w github,gitlab -d 3 -p ${chalk.underline.cyan(
      "https://username:password@proxy.example.com:8080"
    )}\n  ${chalk.gray(
      "# Search using the data in 'info.yml' in verbose mode without outputing colors, check GitHub and GitLab, search for 3 levels deep, and use a proxy."
    )}`
  );

  console.log(chalk.bold("\nFlags:"));

  const largestName = Math.max(
    ...Object.keys(optionList).map((name) => name.length)
  );

  const largestDescription = Math.max(
    ...Object.values(optionList).map((option) => option.description.length)
  );

  for (const [name, option] of Object.entries(optionList).sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    console.log(
      `  ${chalk.cyan(`-${option.alias}`)}, ${chalk.cyan(
        `--${name.padEnd(largestName + 3)}`
      )} ${option.description.padEnd(largestDescription + 3)} ${chalk.gray(
        option.usage
      )}`
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
