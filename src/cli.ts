import options, { optionList } from "./options";
import tool from "../tool.json";
import Result from "./structures/Result";
import github from "./websites/github";
import websites from "./websites";
import path from "path";
import Website from "./structures/Website";
import logger from "./util/logger";

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

const result = Result.fromSearchData({});

async function recursion(result: Result, iteration = 0) {
  console.log("Recursion", iteration + 1);
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
    logger.writeResult(result);
    return;
  } else {
    recursion(result, iteration + 1);
  }
}

recursion(result);
