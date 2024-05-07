import tool from "../tool.json";
import Result from "./structures/Result";
import websites from "./websites";
import fs from "fs";
import path from "path";
import Website from "./structures/Website";
import logger from "./util/logger";
import chalk from "chalk";
import options, { allowed, optionList } from "./options";

if (options.version) {
	console.log(tool.version);
	process.exit(0);
}

if (options.help) {
	console.log("Options:");

	const largestName = Math.max(
		...Object.keys(optionList).map((name) => name.length)
	);

	const largestUsage = Math.max(
		...Object.values(optionList).map((option) => option.usage.length)
	);

	for (const [name, option] of Object.entries(optionList)) {
		console.log(
			`  ${name.padEnd(largestName + 3)} -${
				option.alias
			}, ${option.usage.padEnd(largestUsage + 3)} ${option.description}`
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
		const outFile = path.join(process.cwd(), options.output);
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
			`Recursion ${options.colors ? chalk.cyan(iteration + 1) : iteration + 1}${
				options.colors ? chalk.black("/") : "/"
			}${
				options.colors
					? chalk.cyan(options.depth ?? "∞")
					: options.depth ?? "Inf"
			}`
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

			if (!allowed(website.id)) return [];

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
