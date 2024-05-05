import chalk from "chalk";
import moment from "moment";
import Result from "../structures/Result";
import capitalize from "./capitalize";
import roundDecimal from "./roundDecimal";
import options from "../options";

export default {
  log(message: string): void {
    console.log(
      `${chalk.black(`[${moment().format("HH:mm:ss")}]`)} ${message}`
    );
  },
  error(error: string | Error): void {
    if (error instanceof Error) {
      error = error.message;
    }

    console.error(
      `${chalk.black(`[${moment().format("HH:mm:ss")}]`)} ${chalk.red(
        `Error: ${error}`
      )}`
    );
  },
  warn(message: string): void {
    console.warn(
      `${chalk.black(`[${moment().format("HH:mm:ss")}]`)} ${chalk.yellow(
        `Warning: ${message}`
      )}`
    );
  },
  writeResult(result: Result): void {
    const { likely } = result;
    const lines: string[] = [];

    if (likely.usernames.length > 0) {
      lines.push(
        `${options.colors ? chalk.black("[") : "["}Usernames${
          options.colors ? chalk.black("]") : "]"
        } ${likely.usernames
          .sort((a, b) => b.prob - a.prob)
          .map((u) => (options.colors ? chalk.cyan(u.value) : u.value))
          .join(options.colors ? chalk.black(", ") : ", ")}`
      );
    }

    if (likely.firstName) {
      lines.push(
        `${options.colors ? chalk.black("[") : "["}First Name${
          options.colors ? chalk.black("]") : "]"
        } ${
          options.colors
            ? chalk.cyan(capitalize(likely.firstName.value))
            : capitalize(likely.firstName.value)
        }`
      );
    }

    if (likely.lastName) {
      lines.push(
        `${options.colors ? chalk.black("[") : "["}Last Name${
          options.colors ? chalk.black("]") : "]"
        } ${
          options.colors
            ? chalk.cyan(capitalize(likely.lastName.value, true))
            : capitalize(likely.lastName.value, true)
        }`
      );
    }

    if (likely.emails.length > 0) {
      lines.push(
        `${options.colors ? chalk.black("[") : "["}Emails${
          options.colors ? chalk.black("]") : "]"
        } ${likely.emails
          .sort((a, b) => b.prob - a.prob)
          .map((u) => (options.colors ? chalk.cyan(u.value) : u.value))
          .join(options.colors ? chalk.black(", ") : ", ")}`
      );
    }

    if (likely.phone) {
      lines.push(
        `${options.colors ? chalk.black("[") : "["}Phone${
          options.colors ? chalk.black("]") : "]"
        } ${
          options.colors ? chalk.cyan(likely.phone.value) : likely.phone.value
        }`
      );
    }

    if (likely.country) {
      lines.push(
        `${options.colors ? chalk.black("[") : "["}Country${
          options.colors ? chalk.black("]") : "]"
        } ${
          options.colors
            ? chalk.cyan(capitalize(likely.country.value, true))
            : capitalize(likely.country.value, true)
        }`
      );
    }

    if (likely.urls.length > 0) {
      lines.push("");

      for (const website of likely.urls) {
        lines.push(
          `${options.colors ? chalk.black("[") : "["}${website.title}${
            options.colors ? chalk.black("]") : "]"
          } ${
            options.colors
              ? chalk.cyan(chalk.underline(website.url))
              : website.url
          } ${
            options.colors
              ? (website.prob >= Result.Prob.LIKELY
                  ? chalk.green
                  : website.prob >= Result.Prob.MAYBE
                  ? chalk.yellow
                  : chalk.red)(roundDecimal(website.prob * 100, 3))
              : roundDecimal(website.prob * 100, 3)
          }${options.colors ? chalk.black("%") : "%"}${
            website.fetched
              ? options.colors
                ? `${chalk.black(" (")}${chalk.green("✔ Fetched")}${chalk.black(
                    ")"
                  )}`
                : " (✔ Fetched)"
              : ""
          }`
        );
      }
    }

    console.log(lines.join("\n"));
  },
};
