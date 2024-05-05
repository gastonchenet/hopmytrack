const optionList = Object.freeze({
  help: {
    alias: "h",
    unique: true,
    type: "boolean",
    description: "Show help about how to use the tool.",
    usage: "--help",
  },
  version: {
    alias: "v",
    unique: true,
    type: "boolean",
    description: "Show the version.",
    usage: "--version",
  },
  output: {
    alias: "o",
    unique: false,
    type: "string",
    description: "Output file.",
    usage: "--output=<file>",
  },
  verbose: {
    alias: "V",
    unique: false,
    type: "boolean",
    description: "Show verbose output.",
    usage: "--verbose",
  },
  nsfw: {
    alias: "!",
    unique: false,
    type: "boolean",
    description: "Enable NSFW content.",
    usage: "--nsfw",
  },
  colors: {
    alias: "c",
    unique: false,
    type: "boolean",
    description: "Enable colored output.",
    usage: "--colors",
  },
});

const options: Record<keyof typeof optionList, any> = {
  help: false,
  version: false,
  output: null,
  verbose: false,
  nsfw: false,
  colors: false,
};

const joinedArgs = process.argv.slice(2).join(" ");
const args: string[] = [];
let registering = "";

for (const letter of joinedArgs) {
  if (letter === "-") {
    if (registering.length > 0 && registering !== "-") {
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

for (const arg of args) {
  let hasUnique = false;

  if (arg.startsWith("--")) {
    const [name, value] = arg.slice(2).split(/[= ]/) as [
      keyof typeof optionList,
      string | undefined
    ];

    if (!optionList[name]) {
      throw new Error(`Unknown option '${name}'`);
    }

    const type = optionList[name].type;
    hasUnique = optionList[name].unique;

    if (hasUnique) {
      throw new Error("Usage of multiple unique options is not allowed");
    }

    if (name in optionList && type === "number" && value) {
      if (isNaN(parseInt(value))) {
        throw new Error(`Invalid value for option '${name}'`);
      }

      options[name] = parseInt(value);
    } else if (name in optionList && value) {
      if (type === "boolean") {
        options[name] = value === "true";
      } else if (type === "string") {
        options[name] = value;
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
          if (i === 1 || option.type === "boolean") {
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
          throw new Error(`Missing value for option '${foundOptions[0].name}'`);
        }

        i++;

        for (; i < arg.length; i++) {
          if (arg[i] === " ") break;
          value += arg[i];
        }

        const optionName = foundOptions[0].name as keyof typeof options;
        const optionType = foundOptions[0].type;

        if (optionType === "number" && isNaN(parseInt(value))) {
          throw new Error(`Invalid value for option '${optionName}'`);
        } else if (optionType === "boolean") {
          options[optionName] = value === "true";
        } else {
          options[optionName] =
            optionType === "number" ? parseInt(value) : value;
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

      if (option.type === "boolean") {
        options[option.name as keyof typeof options] = true;
      } else if (option.type === "string") {
        throw new Error(`Missing value for option '${option.name}'`);
      } else {
        throw new Error(
          `Invalid type for option '${option.name}' should be '${option.type}'`
        );
      }
    });
  }
}

export { optionList };
export default options;
