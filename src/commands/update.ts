import { $, type ShellOutput } from "bun";
import os from "node:os";
import logger from "../util/logger";
import { TOOL_GIT_FILE } from "./version";
import tool from "../../package.json";
import chalk from "chalk";

export default async function update() {
  const response = await fetch(TOOL_GIT_FILE);
  const json = await response.json();

  if (json.version === tool.version) {
    console.log(
      `${chalk.green("✓")} Already up to date ${chalk.gray(
        `(v${tool.version})`
      )}`
    );

    process.exit(0);
  }

  logger.log("Updating hopmytrack...");
  let result: ShellOutput;

  switch (os.platform()) {
    case "win32":
      result =
        await $`powershell -c "irm https://hopmytrack.vercel.app/install.ps | iex"`;

      break;

    case "darwin":
    case "linux":
      result =
        await $`curl -fsSL https://hopmytrack.vercel.app/install.sh | bash`;

      break;

    default:
      logger.error("Unsupported platform");
      process.exit(1);
  }

  if (!result.exitCode) {
    logger.log("Update successful");
  } else {
    logger.error("Update failed");
  }

  process.exit(result.exitCode);
}
