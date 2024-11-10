import { vice } from "gradient-string";
import readline from "node:readline";
import tool from "../package.json";
import EventEmitter from "events";
import help from "./commands/help";
import version from "./commands/version";
import chalk from "chalk";
import logger from "./util/logger";
import lookup, { FETCHING_MESSAGES, SPINNER_CHARS } from "./lookup";
import events, { EventType } from "./events";
import {
	makeControlRow,
	type Control,
	type Touch,
} from "./util/makeControlRow";
import getBlackSheeps from "./util/getBlackSheeps";
import { blacklist } from "./options";

enum InputType {
	LIST,
	STRING,
}

enum DisplayMode {
	NORMAL,
	LOWERCASE,
	UPPERCASE,
	CAPITALIZE,
	PASSWORD,
}

type Writing = {
	type: InputType;
	pattern?: RegExp;
	displayMode?: DisplayMode;
};

type InputReturnType<T extends InputType> = T extends InputType.STRING
	? string | null
	: string[];

type InputOptions = {
	pattern?: RegExp;
	displayMode?: DisplayMode;
};

type Key = {
	sequence: string;
	name: string;
	ctrl: boolean;
	meta: boolean;
	shift: boolean;
};

type Binding = {
	keys: Touch[];
	action: () => Promise<any>;
};

const TAB = " ".repeat(2);

const HEADER =
	"\n".repeat(2) +
	vice(
		`██╗  ██╗ ██╗ ██╗ ██████╗ ███╗   ███╗██╗   ██╗████████╗██████╗  █████╗  ██████╗██╗  ██╗
██║  ██║██╔╝  ██╗██╔══██╗████╗ ████║╚██╗ ██╔╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝
███████║██║██╗██║██████╔╝██╔████╔██║ ╚████╔╝    ██║   ██████╔╝███████║██║     █████╔╝ 
██╔══██║██║╚═╝██║██╔═══╝ ██║╚██╔╝██║  ╚██╔╝     ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ 
██║  ██║╚██╗ ██╔╝██║     ██║ ╚═╝ ██║   ██║      ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗
╚═╝  ╚═╝ ╚═╝ ╚═╝ ╚═╝     ╚═╝     ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`
	) +
	"\n\n";

const emitter = new EventEmitter();

export default async function interactive() {
	let writing: Writing | null = null;
	let buffer = "";
	let done = true;
	let activeBindings: Binding[] = [];

	function input<T extends InputType>(
		type: T,
		options: InputOptions = {}
	): Promise<InputReturnType<T>> {
		writing = {
			type,
			pattern: options.pattern,
			displayMode: options.displayMode,
		};

		buffer = "";

		return new Promise((resolve) => {
			events.once(EventType.TypingEvent, (data) => {
				writing = null;
				if (data === undefined) return;

				switch (type) {
					case InputType.LIST:
						resolve(
							data
								.split(",")
								.map((d) => d.trim())
								.filter((d) => !!d) as InputReturnType<T>
						);

						break;

					case InputType.STRING:
						resolve((data?.trim() || null) as InputReturnType<T>);
						break;

					default:
						throw new Error("Invalid input type.");
				}
			});
		});
	}

	const actions = [
		{
			name: "Lookup",
			description: "Lookup information using the provided data.",
			hovering: false,
			async action() {
				console.clear();
				console.log(HEADER);

				console.log(
					"Lookup information using the provided data.\n" +
						chalk.italic.gray("Leave fields empty to skip.\n")
				);

				blacklist.splice(0, blacklist.length);
				const blackSheep = await getBlackSheeps();
				blacklist.push(...new Set(blackSheep.urls.map((r) => r.id)));

				process.stdout.write(`\r${chalk.cyan("Usernames")}${chalk.gray(":")} `);

				const usernames = await input(InputType.LIST, {
					pattern: /[a-z0-9_.-]/i,
					displayMode: DisplayMode.LOWERCASE,
				});

				if (usernames.length < 1) {
					process.stdout.write(chalk.gray("No usernames provided"));
				}

				process.stdout.write(
					`\n\r${chalk.cyan("First name")}${chalk.gray(":")} `
				);

				let firstName = await input(InputType.STRING, {
					displayMode: DisplayMode.CAPITALIZE,
					pattern: /[a-z -]/i,
				});

				if (!firstName) {
					process.stdout.write(chalk.gray("No first name provided"));
				}

				let lastName: string | null = null;

				if (firstName) {
					process.stdout.write(
						`\n\r${chalk.cyan("Last name")}${chalk.gray(":")} `
					);

					lastName = await input(InputType.STRING, {
						displayMode: DisplayMode.CAPITALIZE,
						pattern: /[a-z -]/i,
					});

					if (!lastName) {
						process.stdout.write(chalk.gray("No last name provided"));
						firstName = null;
					}
				}

				process.stdout.write(
					`\n\r${chalk.cyan("Location")}${chalk.gray(":")} `
				);

				const location = await input(InputType.STRING, {
					displayMode: DisplayMode.CAPITALIZE,
				});

				if (!location) {
					process.stdout.write(chalk.gray("No location provided"));
				}

				console.clear();

				if (usernames.length < 1 && !firstName && !lastName && !location) {
					console.log(f());
				} else {
					console.log(HEADER);
					console.log("\n");

					const message =
						FETCHING_MESSAGES[
							Math.floor(Math.random() * FETCHING_MESSAGES.length)
						];

					let count = 0;
					let recursion = 0;
					let progress = 0;

					const updateProgressBar = (newRecursion: boolean) => {
						const progressLength = 60;
						const progressPercentage = (progress / count) * 100;

						const progressBar = "█".repeat(
							Math.floor((progressPercentage * progressLength) / 100)
						);

						const progressEmpty = "█".repeat(
							progressLength - progressBar.length
						);

						process.stdout.write(
							`\u001b[2A\r${" ".repeat(process.stdout.columns)}\r${chalk.cyan(
								SPINNER_CHARS[Math.floor(Date.now() / 100) % 10]
							)} ${message}`
						);

						process.stdout.write(
							`\n\n${
								newRecursion ? `\r${" ".repeat(process.stdout.columns)}\r` : ""
							}Depth${chalk.gray(":")} ${chalk.cyan(
								recursion.toLocaleString("en")
							)} ${chalk.cyan(progressBar)}${chalk.gray(
								progressEmpty
							)} ${progress.toLocaleString("en")}${chalk.gray(
								"/"
							)}${count.toLocaleString("en")} ${chalk.gray(
								"("
							)}${progressPercentage.toLocaleString("en", {
								maximumFractionDigits: 1,
								minimumFractionDigits: 1,
							})}%${chalk.gray(")")}\u001B[?25l`
						);
					};

					const updateRecursion = () => {
						recursion++;
						count = 0;
						progress = 0;
						updateProgressBar(true);
					};

					const updateCount = (c: number) => {
						count += c;
						updateProgressBar(false);
					};

					const updateProgress = () => {
						progress++;
						updateProgressBar(false);
					};

					const spinnerInterval = setInterval(updateProgressBar, 100, false);

					events.on(EventType.Recursion, updateRecursion);
					events.on(EventType.FetchingReady, updateCount);
					events.on(EventType.WebsiteFetched, updateProgress);

					const result = await lookup(
						{
							usernames,
							first_name: firstName ?? undefined,
							last_name: lastName ?? undefined,
							location: location ?? undefined,
						},
						{ hide: true }
					);

					clearInterval(spinnerInterval);

					events.off(EventType.Recursion, updateRecursion);
					events.off(EventType.FetchingReady, updateCount);
					events.off(EventType.WebsiteFetched, updateProgress);

					const path =
						(result.likely.usernames?.[0]?.value ??
							result.likely.firstName?.value ??
							"unknown") + ".txt";

					const controlRow =
						"\n" +
						makeControlRow([
							{
								label: `Save to '${path}'`,
								binings: [{ touch: "o" }, { touch: "s", control: true }],
							},
							{
								label: "Main menu",
								binings: [{ touch: "m" }, { touch: "z", control: true }],
							},
							{
								label: "Quit",
								binings: [
									{ touch: "q" },
									{ touch: "esc" },
									{ touch: "c", control: true },
								],
							},
						]);

					activeBindings = [
						{
							keys: [{ touch: "o" }, { touch: "s", control: true }],
							async action() {
								console.clear();
								console.log(HEADER);

								const file = Bun.file(path);
								const writer = file.writer();

								writer.write(result.toString());
								writer.end();

								console.log(
									`Data successfully written to ${chalk.cyan(path)}.`
								);

								setTimeout(() => {
									console.clear();
									console.log(HEADER);
									console.log(result.toString(true));
									console.log(controlRow);
								}, 2000);
							},
						},
					];

					console.log(controlRow);
				}

				return;
			},
		},
		{
			name: "Help",
			description: "Display the help menu.",
			hovering: false,
			async action() {
				console.clear();
				console.log(HEADER);
				help();

				console.log(
					"\n" +
						makeControlRow([
							{
								label: "Main menu",
								binings: [{ touch: "m" }, { touch: "z", control: true }],
							},
							{
								label: "Quit",
								binings: [
									{ touch: "q" },
									{ touch: "esc" },
									{ touch: "c", control: true },
								],
							},
						])
				);
			},
		},
		{
			name: "Version",
			description: "Display the version.",
			hovering: false,
			async action() {
				console.clear();
				console.log(HEADER);

				const { update } = await version();

				const controls: Control[] = [
					{
						label: "Main menu",
						binings: [{ touch: "m" }, { touch: "z", control: true }],
					},
					{
						label: "Quit",
						binings: [
							{ touch: "q" },
							{ touch: "esc" },
							{ touch: "c", control: true },
						],
					},
				];

				if (update) {
					controls.unshift({
						label: "Update",
						binings: [{ touch: "u" }],
					});
				}

				console.log("\n" + makeControlRow(controls));
			},
		},
		{
			name: "Quit",
			description: "Quit the program.",
			hovering: false,
			async action() {
				logger.log("Exiting...");
				process.exit(0);
			},
		},
	];

	actions[0].hovering = true;

	const f = () =>
		HEADER +
		tool.description
			.replace(
				new RegExp(tool.config.displayName, "g"),
				chalk.magenta.bold(tool.config.displayName)
			)
			.replace(new RegExp("OSINT", "g"), chalk.bold("OSINT")) +
		"\n\n" +
		actions
			.map(
				(action, index) =>
					`${TAB}${chalk.cyan(index + 1)}${chalk.gray(")")} ${
						action.hovering
							? chalk.gray("> ") + chalk.cyan(action.name)
							: action.name
					}\n${TAB.repeat(action.hovering ? 3 : 2)} ${chalk.italic.gray(
						action.description
					)}`
			)
			.join("\n\n") +
		"\n\n" +
		makeControlRow([
			{
				label: "Navigate",
				binings: [{ touch: "▲" }, { touch: "▼" }],
			},
			{
				label: "Quit",
				binings: [
					{ touch: "q" },
					{ touch: "esc" },
					{ touch: "c", control: true },
				],
			},
		]);
	("\n\u001B[?25l");

	console.clear();
	console.log(f());

	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);

	process.stdin.on("keypress", (str: string | undefined, key: Key) => {
		if (
			key.sequence === "\u0003" ||
			key.name === "escape" ||
			key.name === "q"
		) {
			process.stdout.write("\n\r\x1b[K\u001B[?25h");
			logger.log("Caught interrupt signal, exiting...");
			process.exit(1);
		}

		if (key.sequence === "\u001A") {
			emitter.emit(EventType.TypingEvent);
			done = true;
			activeBindings = [];

			console.clear();
			console.log(f());

			return;
		}

		for (const binding of activeBindings) {
			if (
				binding.keys.some((touch) => {
					if (touch.control && !key.ctrl) return false;
					if (touch.shift && !key.shift) return false;
					return key.name === touch.touch;
				})
			) {
				process.stdout.write("\u001B[?25l");

				binding.action().then(() => {
					process.stdout.write("\u001B[?25l");
				});

				return;
			}
		}

		if (writing) {
			switch (str) {
				case "\b":
				case "\u007F":
				case "\u0017":
					if (buffer.length === 0) break;

					let backspace = 1;

					if (key.ctrl || str === "\u007F") {
						const lastSpace = buffer.lastIndexOf(" ");

						if (lastSpace === -1) {
							backspace = buffer.length;
						} else {
							backspace = buffer.length - lastSpace + 1;
						}
					}

					buffer = buffer.slice(0, -backspace);
					process.stdout.write("\b \b".repeat(backspace));

					break;

				case "\r":
					events.emit(EventType.TypingEvent, buffer);
					break;

				case ",":
				case ";":
				case " ":
					if (writing.type === InputType.LIST) {
						if (buffer.endsWith(", ") || !buffer.length) break;

						str = ", ";
						process.stdout.write(str);
						buffer += str;
						break;
					}

					if (!writing.pattern || writing.pattern?.test(str)) {
						process.stdout.write(str);
						buffer += str;
					}

					break;

				default:
					if (!str || (writing.pattern && !writing.pattern?.test(str))) break;

					switch (writing.displayMode) {
						case DisplayMode.PASSWORD:
							str = "*";
							break;

						case DisplayMode.LOWERCASE:
							str = str.toLowerCase();
							break;

						case DisplayMode.UPPERCASE:
							str = str.toUpperCase();
							break;

						case DisplayMode.CAPITALIZE:
							str =
								buffer.length === 0 || buffer.endsWith(", ")
									? str.toUpperCase()
									: str.toLowerCase();

							break;

						default:
							break;
					}

					process.stdout.write(str);
					buffer += str;
					break;
			}

			return;
		}

		process.stdout.write("\r\x1b[K\u001B[?25h");

		if (key.name === "up" || key.name === "down") {
			const index = actions.findIndex((action) => action.hovering);

			actions[index].hovering = false;

			if (key.name === "up") {
				actions[(index - 1 + actions.length) % actions.length].hovering = true;
			} else {
				actions[(index + 1) % actions.length].hovering = true;
			}

			console.clear();
			console.log(f());

			return;
		}

		if (key.name === "return" && done) {
			done = false;

			actions
				.find((action) => action.hovering)
				?.action()
				?.then(() => {
					done = true;
					process.stdout.write("\u001B[?25l");
				});

			return;
		}

		if (key.name === "m") {
			done = true;
			activeBindings = [];
			console.clear();
			console.log(f());

			return;
		}
	});
}
