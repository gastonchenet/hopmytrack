#!/usr/bin/env bun

import lookup from "./lookup";
import options, { blacklist } from "./options";
import logger from "./util/logger";
import readYamlFile from "read-yaml-file";
import type { SearchData } from "./structures/Result";
import help from "./commands/help";
import version from "./commands/version";
import interactive from "./interactive";
import update from "./commands/update";
import list from "./commands/list";
import getBlackSheeps from "./util/getBlackSheeps";

const input = Bun.argv[2];

if (Object.values(options).every((value) => !value) && !input) {
	interactive();
} else if (options.update) {
	update();
} else if (options.version) {
	version();
} else if (options.help) {
	help();
} else if (options.list) {
	list();
} else {
	process.on("unhandledRejection", (reason) => {
		process.stdout.write("\r\x1b[K\u001B[?25h");
		logger.error(reason as Error);
		process.exit(1);
	});

	process.on("uncaughtException", (error) => {
		process.stdout.write("\r\x1b[K\u001B[?25h");
		logger.error(error as Error);
		process.exit(1);
	});

	process.on("SIGINT", function () {
		process.stdout.write("\r\x1b[K\u001B[?25h");
		logger.log("Caught interrupt signal, exiting...");
		process.exit(1);
	});

	if (!input || input.startsWith("-")) {
		logger.error("No input string/file provided.");
		process.exit(1);
	}

	logger.log("Searching for unavailable websites...");

	const blackSheep = await getBlackSheeps();

	if (blackSheep.urls.length === 0) {
		logger.log("No unavailable websites found.");
	} else {
		logger.log(
			`Found ${blackSheep.urls.length} unavailable website${
				blackSheep.urls.length > 1 ? "s" : ""
			}.`
		);
	}

	blacklist.push(...new Set(blackSheep.urls.map((r) => r.id)));

	type YAMLInput = {
		query: SearchData;
		verbose?: boolean;
		depth?: number;
		output?: string;
		proxy?: string;
		blacklist?: string[];
		whitelist?: string[];
	};

	if (/\.ya?ml$/.test(input)) {
		const data = await readYamlFile<YAMLInput>(input);

		if (!options.output && data.output) options.output = data.output;
		if (!options.proxy && data.proxy) options.proxy = data.proxy;

		if (options.verbose === undefined && data.verbose !== undefined)
			options.verbose = data.verbose;

		if (data.depth === undefined && data.depth !== undefined)
			options.depth = data.depth;

		blacklist.push(...(data.blacklist ?? []));
		blacklist.push(...(data.whitelist ?? []));

		lookup(data.query);
	} else {
		const entries = input.split(";");

		if (entries.length === 0) {
			logger.error("Invalid input string.");
			process.exit(1);
		}

		const data: SearchData = {};

		entries.forEach((entry: string) => {
			const [key, value] = entry.split(":") as [keyof SearchData, string];

			if (!/^[a-z_]+$/.test(key)) {
				logger.error(`Invalid key '${key}'.`);
				process.exit(1);
			}

			if (!/^[a-zA-Z0-9,._-]+$/.test(value)) {
				logger.error(`Invalid value '${value}'.`);
				process.exit(1);
			}

			if (value.includes(",")) {
				data[key] = value.split(",") as
					| (string & (string | Location) & string[])
					| undefined;
			} else {
				data[key] = value as
					| (string & (string | Location) & string[])
					| undefined;
			}
		});

		lookup(data);
	}
}
