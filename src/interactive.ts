import figlet from "figlet";
import { vice } from "gradient-string";
import readline from "node:readline";
import tool from "../tool.json";
import EventEmitter from "events";
import help from "./commands/help";
import version from "./commands/version";
import chalk from "chalk";
import logger from "./util/logger";
import lookup from "./lookup";

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

type Key = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
};

type Writing = {
  id: string;
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

const TAB = " ".repeat(2);

const HEADER =
  "\n".repeat(2) +
  vice(
    figlet.textSync("HopMyTrack", {
      font: "ANSI Shadow",
    })
  ) +
  "\n";

const emitter = new EventEmitter();

export default function interactive() {
  let writing: Writing | null = null;
  let buffer = "";
  let done = true;

  function input<T extends InputType>(
    id: string,
    type: T,
    options: InputOptions = {}
  ): Promise<InputReturnType<T>> {
    writing = {
      id,
      type,
      pattern: options.pattern,
      displayMode: options.displayMode,
    };

    buffer = "";

    return new Promise((resolve) => {
      emitter.once(id, (data: string) => {
        writing = null;

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

        process.stdout.write(`\r${chalk.cyan("Usernames")}${chalk.gray(":")} `);

        const usernames = await input("USERNAMES", InputType.LIST, {
          pattern: /[a-z0-9_.-]/i,
          displayMode: DisplayMode.LOWERCASE,
        });

        process.stdout.write(
          `\r${chalk.cyan("First name")}${chalk.gray(":")} `
        );

        let firstName = await input("FIRST_NAME", InputType.STRING, {
          displayMode: DisplayMode.CAPITALIZE,
          pattern: /[a-z -]/i,
        });

        let lastName: string | null = null;

        if (firstName) {
          process.stdout.write(
            `\r${chalk.cyan("Last name")}${chalk.gray(":")} `
          );

          lastName = await input("LAST_NAME", InputType.STRING, {
            displayMode: DisplayMode.CAPITALIZE,
            pattern: /[a-z -]/i,
          });

          if (!lastName) firstName = null;
        }

        process.stdout.write(`\r${chalk.cyan("Location")}${chalk.gray(":")} `);
        const location = await input("LOCATION", InputType.STRING, {
          displayMode: DisplayMode.CAPITALIZE,
        });

        console.clear();
        console.log(HEADER);

        await lookup({
          usernames,
          first_name: firstName ?? undefined,
          last_name: lastName ?? undefined,
          location: location ?? undefined,
        });

        console.log(
          "\nPress 'm' to return to the main menu or any other key to exit."
        );

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
          "\nPress 'm' to return to the main menu or any other key to exit."
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
        version();
        console.log(
          "\nPress 'm' to return to the main menu or any other key to exit."
        );
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
      .replace(new RegExp("HopMyTrack", "g"), chalk.magenta.bold("HopMyTrack"))
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
    "\n" +
    "\u001B[?25l";

  console.clear();
  console.log(f());

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", async (str: string | undefined, key: Key) => {
    if (
      key.sequence === "\u0003" ||
      key.sequence === "\u0004" ||
      key.name === "escape"
    ) {
      process.stdout.write("\n\r\x1b[K\u001B[?25h");
      logger.log("Caught interrupt signal, exiting...");
      process.exit(1);
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
          emitter.emit(writing.id, buffer);
          process.stdout.write("\n");
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
      await actions.find((action) => action.hovering)?.action();
      done = true;
      process.stdout.write("\u001B[?25l");

      return;
    }

    if (key.name === "m") {
      done = true;
      console.clear();
      console.log(f());

      return;
    }
  });
}
