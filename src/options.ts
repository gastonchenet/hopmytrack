import parseArgs, { OptionPayloadType } from "./parseArgs";
import fs from "fs";
import path from "path";
import type { Type } from "./structures/Website";

export const optionList = {
  help: {
    alias: "h",
    unique: true,
    type: OptionPayloadType.BOOLEAN,
    description: "Show help about how to use the tool.",
    usage: "--help",
    default: false,
  },
  version: {
    alias: "v",
    unique: true,
    type: OptionPayloadType.BOOLEAN,
    description: "Show the version.",
    usage: "--version",
    default: false,
  },
  update: {
    alias: "u",
    unique: true,
    type: OptionPayloadType.BOOLEAN,
    description: "Update the tool.",
    usage: "--update",
    default: false,
  },
  output: {
    alias: "o",
    unique: false,
    type: OptionPayloadType.STRING,
    description: "Output file.",
    usage: "--output=<file>",
    default: null,
  },
  verbose: {
    alias: "V",
    unique: false,
    type: OptionPayloadType.BOOLEAN,
    description: "Show verbose output.",
    usage: "--verbose",
    default: false,
  },
  nsfw: {
    alias: "!",
    unique: false,
    type: OptionPayloadType.BOOLEAN,
    description: "Enable NSFW content.",
    usage: "--nsfw",
    default: false,
  },
  "no-color": {
    alias: "c",
    unique: false,
    type: OptionPayloadType.BOOLEAN,
    description: "Disable colored output.",
    usage: "--no-color",
    default: false,
  },
  depth: {
    alias: "d",
    unique: false,
    type: OptionPayloadType.NUMBER,
    description: "Set the depth of the recursion.",
    usage: "--depth=<number>",
    default: null,
  },
  whitelist: {
    alias: "w",
    unique: false,
    type: OptionPayloadType.ARRAY,
    description: "Set a list of websites to search through.",
    usage: "--whitelist=<website1>,<website2>,...",
    default: null,
  },
  blacklist: {
    alias: "b",
    unique: false,
    type: OptionPayloadType.ARRAY,
    description: "Set a list of websites to ignore.",
    usage: "--blacklist=<website1>,<website2>,...",
    default: null,
  },
  proxy: {
    alias: "p",
    unique: false,
    type: OptionPayloadType.STRING,
    description: "Set a proxy.",
    usage: "--proxy=<proxy>",
    default: null,
  },
};

const options = parseArgs(Bun.argv.slice(2), optionList);

if (options.proxy && !options.proxy.startsWith("http")) {
  options.proxy = `http://${options.proxy}`;
}

const whitelist = [...new Set(options.whitelist ?? [])];
const blacklist = [...new Set(options.blacklist ?? [])];

function allowed(id: string, type: Type) {
  if (id === "root") return true;

  if (
    whitelist.length > 0 &&
    !whitelist.includes(id) &&
    !whitelist.includes(type)
  )
    return false;

  if (blacklist.includes(id) || blacklist.includes(type)) return false;

  return true;
}

export { whitelist, blacklist, allowed };
export default options;
