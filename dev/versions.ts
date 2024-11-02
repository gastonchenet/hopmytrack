import { $ } from "bun";
import fs from "fs";
import path from "path";
import parseArgs, { OptionPayloadType } from "../src/parseArgs";

const options = parseArgs(Bun.argv.slice(2), {
  message: {
    alias: "m",
    description: "The message to commit with.",
    type: OptionPayloadType.STRING,
    usage: "--message=<message>",
    unique: false,
    default: null,
  },
  level: {
    alias: "l",
    description: "The level of the version to increment.",
    type: OptionPayloadType.NUMBER,
    usage: "--level=<level>",
    unique: false,
    default: 0,
  },
});

if (!options.message) {
  console.error("You must provide a message to commit with.");
  process.exit(1);
}

const rawTool = fs.readFileSync(
  path.join(__dirname, "../package.json"),
  "utf-8"
);
const tool = JSON.parse(rawTool);

const version = tool.version.split(".").map((v: string) => parseInt(v));

for (let i = version.length - 1; i >= 0; i--) {
  if (options.level === i) {
    version[version.length - 1 - i]++;
  } else if (options.level > i) {
    version[version.length - 1 - i] = 0;
  }
}

fs.writeFileSync(
  path.join(__dirname, "../package.json"),
  JSON.stringify({ ...tool, version: version.join(".") }, null, 2)
);

try {
  await $`git add .`;
  await $`git commit -m "${options.message}"`;
  await $`git push`;
} catch (error) {
  fs.writeFileSync(
    path.join(__dirname, "../tool.json"),
    JSON.stringify(tool, null, 2)
  );

  console.error(error);
  process.exit(1);
}
