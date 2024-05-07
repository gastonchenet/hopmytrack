export enum OptionPayloadType {
	BOOLEAN = "boolean",
	NUMBER = "number",
	STRING = "string",
	ARRAY = "array",
}

type OptionPayload = {
	alias: string;
	unique: boolean;
	type: OptionPayloadType;
	description: string;
	usage: string;
	default: any;
};

function parseArgs(
	rawArgs: string[],
	optionList: Record<string, OptionPayload> = {}
) {
	const options: Record<string, any> = {};

	Object.entries(optionList).forEach(([name, option]) => {
		options[name] = option.default;
	});

	const joinedArgs = rawArgs.join(" ");
	const args: string[] = [];
	let registering = "";

	for (const letter of joinedArgs) {
		if (letter === "-") {
			if (
				registering.length > 0 &&
				registering !== "-" &&
				registering.slice(-1) + letter === " -"
			) {
				args.push(registering.trim());
				registering = "";
			}

			registering += "-";
			continue;
		}

		if (registering.length > 0) {
			registering += letter;
		}
	}

	if (registering.length > 0) {
		args.push(registering.trim());
	}

	let hasUnique = false;

	for (const arg of args) {
		if (arg.startsWith("--")) {
			let [name, ...rawArgs] = arg.slice(2).split(/[= ]/) as [
				keyof typeof optionList,
				...string[]
			];

			const value = rawArgs.join(" ");

			if (!optionList[name]) {
				throw new Error(`Unknown option '${name}'`);
			}

			const type = optionList[name].type;

			if (hasUnique) {
				throw new Error("Usage of multiple unique options is not allowed");
			}

			hasUnique = optionList[name].unique;

			if (name in optionList && type === OptionPayloadType.NUMBER && value) {
				if (isNaN(parseInt(value))) {
					throw new Error(`Invalid value for option '${name}'`);
				}

				options[name] = parseInt(value);
			} else if (name in optionList && value) {
				if (type === OptionPayloadType.BOOLEAN) {
					options[name] = value === "true";
				} else if (type === OptionPayloadType.STRING) {
					options[name] = value;
				} else if (type === OptionPayloadType.ARRAY) {
					options[name] = value.split(/, */);
				} else {
					throw new Error(
						`Invalid type for option '${name}', should be '${type}'`
					);
				}
			} else if (name in optionList) {
				if (type !== "boolean") {
					throw new Error(`Missing value for option '${name}'`);
				}

				options[name] = true;
			} else {
				throw new Error(`Unknown option '${name}'`);
			}
		} else if (arg.startsWith("-")) {
			const foundOptions = [];

			for (let i = 1; i < arg.length; i++) {
				const letter = arg[i];

				for (const [name, option] of Object.entries(optionList)) {
					if (option.alias === letter) {
						if (i === 1 || option.type === OptionPayloadType.BOOLEAN) {
							foundOptions.push({ name, ...option });
							if (option.type !== "boolean") continue;
						} else {
							throw new Error(`Cannot stack non-boolean options '${name}'`);
						}
					}
				}

				if (foundOptions.length === 1 && foundOptions[0].type !== "boolean") {
					if (hasUnique) {
						throw new Error("Usage of multiple unique options is not allowed");
					}

					hasUnique = foundOptions[0].unique;
					let value = "";

					i++;

					if (!/[= ]/.test(arg[i])) {
						throw new Error(
							`Missing value for option '${foundOptions[0].name}'`
						);
					}

					i++;

					for (; i < arg.length; i++) {
						if (!arg[i]) break;
						value += arg[i];
					}

					const optionName = foundOptions[0].name as keyof typeof options;
					const optionType = foundOptions[0].type as OptionPayloadType;

					if (
						optionType === OptionPayloadType.NUMBER &&
						isNaN(parseInt(value))
					) {
						throw new Error(`Invalid value for option '${optionName}'`);
					} else if (optionType === OptionPayloadType.BOOLEAN) {
						options[optionName] = value === "true";
					} else {
						options[optionName] =
							optionType === OptionPayloadType.NUMBER
								? parseInt(value)
								: optionType === OptionPayloadType.STRING
								? value
								: value.split(/, */);
					}
				}
			}

			if (foundOptions.length === 0) {
				throw new Error(`Unknown option '${arg}'`);
			}

			if (foundOptions.length === 1 && foundOptions[0].type !== "boolean") {
				continue;
			}

			foundOptions.forEach((option) => {
				if (hasUnique) {
					throw new Error("Usage of multiple unique options is not allowed");
				}

				hasUnique = option.unique;

				if (option.type === OptionPayloadType.BOOLEAN) {
					options[option.name as keyof typeof options] = true;
				} else if (option.type === OptionPayloadType.STRING) {
					throw new Error(`Missing value for option '${option.name}'`);
				} else {
					throw new Error(
						`Invalid type for option '${option.name}' should be '${option.type}'`
					);
				}
			});
		}
	}

	return options;
}

export default parseArgs;
