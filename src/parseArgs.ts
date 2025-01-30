import chalk from "chalk";

const hasColors = !/(\s|^)-(-no-color|[^-]*c[^-]*)/.test(Bun.argv.join(" "));

export enum OptionPayloadType {
  BOOLEAN = "boolean",
  NUMBER = "number",
  STRING = "string",
  ARRAY = "array",
}

export type OptionPayload<T extends OptionPayloadType> = {
  alias: string;
  unique: boolean;
  type: T;
  description: string;
  usage: string;
  default:
    | (T extends OptionPayloadType.BOOLEAN
        ? boolean
        : T extends OptionPayloadType.NUMBER
        ? number
        : T extends OptionPayloadType.STRING
        ? string
        : T extends OptionPayloadType.ARRAY
        ? string[]
        : never)
    | null;
};

function parseArgs(
  rawArgs: string[],
  optionList: Record<string, OptionPayload<OptionPayloadType>> = {}
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
				console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Unknown option '${name}'`);
				process.exit(1);
      }

      const type = optionList[name].type;

      if (hasUnique) {
				console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Usage of multiple unique options is not allowed`);
				process.exit(1);
      }

      hasUnique = optionList[name].unique;

      if (name in optionList && type === OptionPayloadType.NUMBER && value) {
        if (isNaN(parseInt(value))) {
					console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Invalid value for option '${name}'`);
					process.exit(1);
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
					console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Invalid type for option '${name}', should be '${type}'`);
					process.exit(1);
				}
      } else if (name in optionList) {
        if (type !== "boolean") {
					console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Missing value for option '${name}'`);
					process.exit(1);
        }

        options[name] = true;
      } else {
				console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Unknown option '${name}'`);
				process.exit(1);
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
							console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Cannot stack non-boolean options '${name}'`);
							process.exit(1);
						}
          }
        }

        if (foundOptions.length === 1 && foundOptions[0].type !== "boolean") {
          if (hasUnique) {
						console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Usage of multiple unique options is not allowed`);
						process.exit(1);
          }

          hasUnique = foundOptions[0].unique;
          let value = "";

          i++;

          if (!/[= ]/.test(arg[i])) {
						console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Missing value for option '${foundOptions[0].name}'`);
						process.exit(1);
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
						console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Invalid value for option '${optionName}'`);
						process.exit(1);
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
				console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Unknown option '${arg}'`);
				process.exit(1);
      }

      if (foundOptions.length === 1 && foundOptions[0].type !== "boolean") {
        continue;
      }

      foundOptions.forEach((option) => {
        if (hasUnique) {
					console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Usage of multiple unique options is not allowed`);
					process.exit(1);
        }

        hasUnique = option.unique;

        if (option.type === OptionPayloadType.BOOLEAN) {
          options[option.name as keyof typeof options] = true;
        } else if (option.type === OptionPayloadType.STRING) {
					console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Missing value for option '${option.name}'`);
					process.exit(1);
        } else {
					console.error(`${hasColors ? chalk.red("Error:") : "Error:"} Cannot stack non-boolean options '${option.name}'`);
					process.exit(1);
        }
      });
    }
  }

  return options;
}

export default parseArgs;