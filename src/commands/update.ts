import { $, type ShellOutput } from "bun";
import os from "node:os";
import logger from "../util/logger";

export default async function update() {
  let result: ShellOutput;

  switch (os.platform()) {
    case "win32":
      result =
        await $`powershell -c "irm https://gastonchenet.fr/hopmytrack/install.ps1 | iex"`;

      break;

    case "darwin":
    case "linux":
      result =
        await $`curl -fsSL https://gastonchenet.fr/hopmytrack/install.sh | bash`;
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
