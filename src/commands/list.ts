import chalk from "chalk";
import capitalize from "../util/capitalize";
import websites from "../websites";
import readline from "node:readline";
import logger from "../util/logger";
import { makeControlRow } from "../util/makeControlRow";

type Key = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
};

const ITEMS_PER_PAGE = 5;

export default function list() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  const maxWebsiteTitleLength = Math.max(
    ...websites.map((item) => item.title.length)
  );

  let page = 0;
  let maxPage = Math.ceil(websites.length / ITEMS_PER_PAGE);
  let search = "";
  let lastLength = websites.length;
  let lastPage = page;

  const rewrite = (force: boolean = false) => {
    const filtered = websites.filter(
      (w) =>
        w.id.startsWith(search) ||
        w.website?.actions.some((a) => a.startsWith(search)) ||
        w.website?.type.toLowerCase().startsWith(search) ||
        (w.website?.nsfw ? "nsfw".startsWith(search) : false)
    );

    if (!force && filtered.length === lastLength && lastPage === page) {
      process.stdout.write(
        `\r${" ".repeat(process.stdout.columns)}\r${
          chalk.bold("Search:") + " " + search
        }`
      );

      return;
    }

    lastLength = filtered.length;
    lastPage = page;
    maxPage = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    console.clear();
    process.stdout.write(
      `${chalk.gray(`(${page + 1}/${maxPage})`)} ${chalk.bold(
        "Available websites:"
      )}\n\n` +
        filtered
          .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
          .map(
            (item) =>
              `${chalk.gray("-")} ${`${chalk.cyan(item.title)}${
                item.website?.nsfw
                  ? ` ${chalk.gray("(")}${chalk.red("!")}${chalk.gray(")")}`
                  : ""
              }${chalk.gray(":")}${" ".repeat(
                maxWebsiteTitleLength -
                  item.title.length -
                  (item.website?.nsfw ? 4 : 0) +
                  2
              )}`} ${
                item.website
                  ? `${capitalize(item.website.type)}\n  ${chalk.gray("ID:")} ${
                      item.id
                    }${" ".repeat(
                      maxWebsiteTitleLength - item.id.length
                    )}${chalk.gray("Collecting:")} ${
                      item.website.actions
                        .map((a) => chalk.green(a))
                        .join(chalk.gray(",") + " ") || chalk.gray("None")
                    }`
                  : `${chalk.italic.gray("Non fetchable")}\n  ${chalk.gray(
                      "ID: "
                    )}${item.id}`
              }`
          )
          .join("\n\n") +
        (filtered.length > 0 ? "\n\n" : "") +
        chalk.bold("Search:") +
        " " +
        search +
        "\n" +
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
        ]) +
        `\x1b[s\x1b[3A\x1b[${
          Math.min(120, process.stdout.columns) - 8 - search.length
        }D`
    );
  };

  rewrite(true);

  process.stdin.on("keypress", (str: string | undefined, key: Key) => {
    if (
      key.sequence === "\u0003" ||
      key.name === "escape" ||
      key.name === "q"
    ) {
      process.stdout.write("\x1b[u\n\r\x1b[K\u001B[?25h");
      logger.log("Caught interrupt signal, exiting...");
      process.exit(1);
    }

    if (key.name === "up") {
      if (page > 0) page--;
      rewrite();
    }

    if (key.name === "down") {
      if (page < maxPage - 1) page++;
      rewrite();
    }

    if (str && /^[a-zA-Z0-9_]$/.test(str)) {
      page = 0;
      search += str.toLowerCase();
      rewrite();
    }

    if (str && search.length > 0 && "\b\u007F\u0017".includes(str)) {
      page = 0;

      if (key.ctrl || str === "\u007F") {
        search = "";
      } else {
        search = search.slice(0, -1);
      }

      rewrite();
    }
  });
}
