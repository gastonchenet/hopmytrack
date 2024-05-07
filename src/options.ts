import parseArgs, { OptionPayloadType } from "./parseArgs";
import fs from "fs";
import path from "path";

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
	colors: {
		alias: "c",
		unique: false,
		type: OptionPayloadType.BOOLEAN,
		description: "Enable colored output.",
		usage: "--colors",
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
	"whitelist-file": {
		alias: "W",
		unique: false,
		type: OptionPayloadType.STRING,
		description: "Set a file with a list of websites to search through.",
		usage: "--whitelist-file=<file>",
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
	"blacklist-file": {
		alias: "B",
		unique: false,
		type: OptionPayloadType.STRING,
		description: "Set a file with a list of websites to ignore.",
		usage: "--blacklist-file=<file>",
		default: null,
	},
};

const options = parseArgs(Bun.argv.slice(2), optionList);

const whitelist = [...new Set(options.whitelist || [])];
const blacklist = [...new Set(options.blacklist || [])];

if (options["whitelist-file"]) {
	const file = path.join(process.cwd(), options["whitelist-file"]);
	const data = fs.readFileSync(file, "utf-8");
	whitelist.push(...data.split(/\r?\n/).map((line) => line.trim()));
}

if (options["blacklist-file"]) {
	const file = path.join(process.cwd(), options["blacklist-file"]);
	const data = fs.readFileSync(file, "utf-8");
	blacklist.push(...data.split(/\r?\n/).map((line) => line.trim()));
}

function allowed(website: string) {
	if (whitelist.length > 0 && !whitelist.includes(website)) return false;
	if (blacklist.includes(website)) return false;
	return true;
}

export { whitelist, blacklist, allowed };
export default options;
