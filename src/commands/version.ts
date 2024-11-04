import chalk from "chalk";
import tool from "../../package.json";

const TOOL_GIT_FILE =
  "https://raw.githubusercontent.com/gastonchenet/hopmytrack/refs/heads/main/package.json";

type Result = {
  update: boolean;
};

export default async function version(): Promise<Result> {
  console.log(
    tool.config.displayName +
      " version" +
      chalk.gray(":") +
      " " +
      chalk.cyan(tool.version)
  );

  const response = await fetch(TOOL_GIT_FILE);
  const json = await response.json();

  if (json.version !== tool.version) {
    console.log(
      "\n" +
        chalk.italic(
          `${chalk.gray(
            `A new version of ${tool.config.displayName} is available (`
          )}${chalk.red(tool.version)}${chalk.gray(" -> ")}${chalk.green(
            json.version
          )}${chalk.gray(")")}`
        )
    );

    return { update: true };
  }

  return { update: false };
}
