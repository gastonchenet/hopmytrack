import tool from "../tool.json";
import Result from "./structures/Result";
import websites from "./websites";
import fs from "fs";
import path from "path";
import Website from "./structures/Website";
import logger from "./util/logger";
import chalk from "chalk";
import parseArgs, { OptionPayloadType } from "./options";

const optionList = {
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
};

const options = parseArgs(Bun.argv.slice(2), optionList);

if (options.version) {
	console.log(tool.version);
	process.exit(0);
}

if (options.help) {
	console.log("Options:");

	for (const [name, option] of Object.entries(optionList)) {
		console.log(
			`  ${name.padEnd(10)} -${option.alias}, ${option.usage.padEnd(20)} ${
				option.description
			}`
		);
	}

	process.exit(0);
}

const result = await Result.fromSearchData({
	username: "wonderhunter",
	location: "France, Paris",
});

if (!options.verbose) {
	logger.log("Searching for data...");
}

function handleResult(result: Result) {
	console.log();
	logger.writeResult(result);

	if (options.output) {
		const outFile = path.join(__dirname, options.output);
		const outDir = path.dirname(outFile);

		if (!fs.existsSync(outDir)) {
			fs.mkdirSync(outDir, { recursive: true });
		}

		fs.writeFileSync(outFile, result.toString());

		if (options.verbose) {
			logger.log(
				options.colors
					? chalk.green(`Data successfully written to '${outFile}'`)
					: `Data successfully written to '${outFile}'`
			);
		}
	}
}

async function recursion(result: Result, iteration = 0) {
	if (options.depth !== null && iteration >= options.depth) {
		handleResult(result);
		return;
	}

	if (options.verbose) {
		logger.log(
			`Recursion ${options.colors ? chalk.cyan(iteration + 1) : iteration + 1}`
		);
	}

	const previousResult = result.copy();

	await Promise.all(
		websites.map(async (w) => {
			if (!w.fetchFunction) return [];

			const website: Website = require(path.join(
				__dirname,
				w.fetchFunction
			)).default;

			const results = await website.execute(result);
			results.forEach((r) => result.addUrl(r));

			return results;
		})
	);

	if (previousResult.equals(result)) {
		handleResult(result);
		return;
	} else {
		recursion(result, iteration + 1);
	}
}

recursion(result);

export { options };
