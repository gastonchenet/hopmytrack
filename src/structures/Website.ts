import Result from "./Result";
import options from "../options";
import UserAgent from "user-agents";
import makeUsernames, {
  type FindUsernamesOptions,
} from "../util/makeUsernames";
import findLocation from "../util/findLocation";
import findNames from "../util/findNames";
import findEmails from "../util/findEmails";
import findPhones from "../util/findPhones";
import findUrls from "../util/findUrls";
import fetch from "../util/fetch";

enum ErrorType {
  STATUS_CODE,
  RESPONSE_BODY,
  RESPONSE_URL,
}

type ExecuteFunction = (previousResult: Result) => Promise<Result[]>;

type WebsiteOptions = {
  title: string;
  requestUrl: string;
  responseUrl?: string;
  requestInterval?: number;
  nsfw?: boolean;
  headers?: Record<string, string>;
  usernameOptions?: FindUsernamesOptions;
} & (
  | { errorType: ErrorType.STATUS_CODE; errorBody?: never; errorUrl?: never }
  | {
      errorType: ErrorType.RESPONSE_BODY;
      errorBody: string | string[];
      errorUrl?: never;
    }
  | { errorType: ErrorType.RESPONSE_URL; errorBody?: never; errorUrl?: string }
) &
  (
    | { findNames: true; nameSelector?: string }
    | { findNames?: false; nameSelector?: never }
  ) &
  (
    | { findLocations: true; locationSelector?: string }
    | { findLocations?: false; locationSelector?: never }
  ) &
  (
    | { findEmails: true; emailSelector?: string }
    | { findEmails?: false; emailSelector?: never }
  ) &
  (
    | { findPhones: true; phoneSelector?: string }
    | { findPhones?: false; phoneSelector?: never }
  ) &
  (
    | { findUrls: true; urlSelector?: string; urlExclude?: string[] }
    | { findUrls?: false; urlSelector?: never; urlExclude?: never }
  );

export default class Website {
  public static ErrorType = ErrorType;
  public static DEFAULT_HEADERS = {
    "User-Agent": new UserAgent().toString(),
    "Accept-Language": "en-US,en;q=0.9",
  };

  public static fromJSON(id: string, json: WebsiteOptions) {
    if (!options.nsfw && json.nsfw) return new Website(id, async () => []);

    const headers = { ...Website.DEFAULT_HEADERS, ...json.headers };

    return new Website(id, async (previousResult) => {
      const results: Result[] = [];
      const usernames = makeUsernames(previousResult, json.usernameOptions);

      for (const username of usernames) {
        const requestUrl = json.requestUrl.replace(
          /\{username\}/,
          username.value
        );

        const response = await fetch(requestUrl, {
          abortIfCached: true,
          headers,
        });

        if (response?.status === 408) continue;

        if (!response?.ok) {
          if (json.requestInterval && !options.proxy)
            await new Promise((resolve) =>
              setTimeout(resolve, json.requestInterval)
            );

          continue;
        }

        const html = await response.text();

        if (
          (json.errorType === ErrorType.RESPONSE_BODY &&
            ((typeof json.errorBody === "string" &&
              html.includes(json.errorBody)) ||
              (Array.isArray(json.errorBody) &&
                json.errorBody.some((body) => html.includes(body))))) ||
          (json.errorType === ErrorType.RESPONSE_URL &&
            response.url === json.errorUrl)
        ) {
          if (json.requestInterval && !options.proxy)
            await new Promise((resolve) =>
              setTimeout(resolve, json.requestInterval)
            );

          continue;
        }

        const responseUrl =
          json.responseUrl?.replace(/\{username\}/, username.value) ??
          requestUrl;

        const result = new Result({
          id,
          title: json.title,
          url: responseUrl,
          username: username.value,
          prob: username.prob,
          nsfw: json.nsfw ?? false,
          fetched: true,
          parent: previousResult,
        });

        if (json.findNames) {
          const { firstNames, lastNames } = findNames(html, json.nameSelector);

          firstNames.forEach((firstName) => {
            result.addFirstName(firstName.value, firstName.prob);
          });

          lastNames.forEach((lastName) => {
            result.addLastName(lastName.value, lastName.prob);
          });
        }

        if (json.findLocations) {
          findLocation(html, json.locationSelector).forEach((location) => {
            result.addLocation(location, location.prob);
          });
        }

        if (json.findEmails) {
          for (const email of findEmails(html, json.emailSelector)) {
            await result.addEmail(email.value, email.prob);
          }
        }

        if (json.findPhones) {
          findPhones(html, json.phoneSelector).forEach((phone) => {
            result.addPhone(phone, phone.prob);
          });
        }

        if (json.findUrls) {
          const exclude = [
            ...(json.urlExclude ?? []),
            new URL(requestUrl).hostname,
          ];

          if (json.responseUrl) exclude.push(new URL(responseUrl).hostname);

          const urls = findUrls(result, html, exclude, json.urlSelector);
          urls.forEach((url) => result.addUrl(url));
        }

        results.push(result);
        if (options.verbose) result.log();

        if (json.requestInterval && !options.proxy)
          await new Promise((resolve) =>
            setTimeout(resolve, json.requestInterval)
          );
      }

      return results;
    });
  }

  public id: string;
  public execute: ExecuteFunction;

  public constructor(id: string, execute: ExecuteFunction) {
    this.id = id;
    this.execute = execute;
  }
}
