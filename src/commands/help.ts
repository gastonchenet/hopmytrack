import chalk from "chalk";
import tool from "../../package.json";
import { optionList } from "../options";

export default function help() {
  console.log(
    tool.description
      .replace(
        new RegExp(tool.config.displayName, "g"),
        chalk.magenta.bold(tool.config.displayName)
      )
      .replace(new RegExp("OSINT", "g"), chalk.bold("OSINT"))
  );

  console.log(chalk.bold("\nUsage:"));
  console.log(
    `  ${chalk.magenta.bold("hmt")} ${chalk.gray(
      "                      # Interactive cli"
    )}\n  ${chalk.magenta.bold("hmt")} <input> [...flags] ${chalk.gray(
      "   # Command line tool"
    )}`
  );

  console.log(chalk.bold("\nExamples:"));
  console.log(
    `  ${chalk.magenta.bold("hmt")} ${chalk.green(
      '"username:example;first_name:John;last_name:Doe"'
    )} -V! -b github -d 5 -o output.txt\n  ${chalk.gray(
      "# Search for 'John Doe' with the username 'example' in verbose mode with NSFW enabled, blacklist GitHub and search for 5 levels deep, output the results to 'output.txt'."
    )}`
  );

  console.log(
    `\n  ${chalk.magenta.bold(
      "hmt"
    )} info.yml -Vc -w github,gitlab -d 3 -p ${chalk.underline.cyan(
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
}
