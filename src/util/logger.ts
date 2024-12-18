import chalk from "chalk";
import moment from "moment";
import Result from "../structures/Result";
import options from "../options";

export default {
  log(message: string): void {
    console.log(
      `${
        !options["no-color"]
          ? chalk.gray(`[${moment().format("HH:mm:ss")}]`)
          : `[${moment().format("HH:mm:ss")}]`
      } ${message}`
    );
  },
  error(error: string | Error): void {
    if (error instanceof Error) {
      error = error.message;
    }

    console.error(
      `${
        !options["no-color"]
          ? chalk.gray(`[${moment().format("HH:mm:ss")}]`)
          : `[${moment().format("HH:mm:ss")}]`
      } ${
        !options["no-color"] ? chalk.red(`Error: ${error}`) : `Error: ${error}`
      }`
    );
  },
  warn(message: string): void {
    console.warn(
      `${
        !options["no-color"]
          ? chalk.gray(`[${moment().format("HH:mm:ss")}]`)
          : `[${moment().format("HH:mm:ss")}]`
      } ${
        !options["no-color"]
          ? chalk.yellow(`Warning: ${message}`)
          : `Warning: ${message}`
      }`
    );
  },
  writeResult(result: Result): void {
    console.log(result.toString(!options["no-color"]));
  },
};
