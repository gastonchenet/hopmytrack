import Result, { type ProbValue } from "./Result";
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
import fetch, { type FetchOptions } from "../util/fetch";
import chalk from "chalk";
import type { LookupOptions } from "../lookup";
import events, { EventType } from "../events";

enum ErrorType {
	STATUS_CODE,
	RESPONSE_BODY,
	RESPONSE_URL,
}

export enum Type {
	SOCIAL = "social",
	PROFESSIONAL = "professional",
	GAMING = "gaming",
	VIDEO = "video",
	MUSIC = "music",
	ART = "art",
	BLOG = "blog",
	PERSONAL = "personal",
	DEVELOPMENT = "development",
}

enum Actions {
	PAGE_NAMES = "page_names",
	PAGE_LOCATIONS = "page_locations",
	PAGE_EMAILS = "page_emails",
	PAGE_PHONES = "page_phones",
	PAGE_URLS = "page_urls",
}

type ExecuteFunction = (
	previousResult: Result,
	lookupOptions: LookupOptions
) => Promise<Result[]>;

type WebsiteOptions = {
	title: string;
	type: Type;
	requestUrl: string;
	responseUrl?: string;
	requestInterval?: number;
	nsfw?: boolean;
	headers?: Record<string, string>;
	usernameOptions?: FindUsernamesOptions;
	disableProxy?: boolean;
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

type WebsiteRawOptions = {
	id: string;
	title: string;
	type: Type;
	nsfw: boolean;
	actions: Actions[];
	execute: ExecuteFunction;
};
export default class Website {
	public static ErrorType = ErrorType;
	public static Type = Type;
	public static Actions = Actions;

	public static DEFAULT_HEADERS = {
		"User-Agent": new UserAgent().toString(),
		"Accept-Language": "en-US,en;q=0.9",
	};

	public static fromJSON(id: string, json: WebsiteOptions) {
		const actions: Actions[] = [];

		if (json.findNames) actions.push(Actions.PAGE_NAMES);
		if (json.findLocations) actions.push(Actions.PAGE_LOCATIONS);
		if (json.findEmails) actions.push(Actions.PAGE_EMAILS);
		if (json.findPhones) actions.push(Actions.PAGE_PHONES);
		if (json.findUrls) actions.push(Actions.PAGE_URLS);

		if (!options.nsfw && json.nsfw)
			return new Website({
				id,
				title: json.title,
				type: json.type,
				nsfw: json.nsfw,
				actions,
				execute: async () => [],
			});

		const headers = { ...Website.DEFAULT_HEADERS, ...json.headers };

		return new Website({
			id,
			title: json.title,
			type: json.type,
			nsfw: json.nsfw ?? false,
			actions,
			execute: async (previousResult, lookupOptions) => {
				const results: Result[] = [];
				let usernames: ProbValue<string>[];

				if (lookupOptions.derivateUsername) {
					usernames = makeUsernames(previousResult, json.usernameOptions);
				} else {
					usernames = [previousResult.username!];
				}

				events.emit(EventType.FetchingReady, usernames.length);

				for (const username of usernames) {
					const requestUrl = json.requestUrl.replace(
						/\{username\}/,
						encodeURIComponent(username.value)
					);

					const init: FetchOptions = {
						abortIfCached: true,
						headers,
					};

					if (!json.disableProxy && options.proxy) init.proxy = options.proxy;

					const response = await fetch(requestUrl, init);

					events.emit(EventType.WebsiteFetched);

					if (response.status === 408) continue;

					if (!response.ok) {
						if (json.requestInterval && (!options.proxy || json.disableProxy))
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
						if (json.requestInterval && (!options.proxy || json.disableProxy))
							await new Promise((resolve) =>
								setTimeout(resolve, json.requestInterval)
							);

						continue;
					}

					const responseUrl =
						json.responseUrl?.replace(
							/\{username\}/,
							encodeURIComponent(username.value)
						) ?? requestUrl;

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
						const { firstNames, lastNames } = findNames(
							html,
							json.nameSelector
						);

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
						for (const email of await findEmails(html, json.emailSelector)) {
							result.addEmail(email, email.prob);
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

						findUrls(result, html, exclude, json.urlSelector);
					}

					results.push(result);

					if (json.requestInterval && (!options.proxy || json.disableProxy))
						await new Promise((resolve) =>
							setTimeout(resolve, json.requestInterval)
						);
				}

				return results;
			},
		});
	}

	public id: string;
	public title: string;
	public type: Type;
	public actions: Actions[];
	public nsfw: boolean;
	public execute: ExecuteFunction;

	public constructor(options: WebsiteRawOptions) {
		this.id = options.id;
		this.title = options.title;
		this.type = options.type;
		this.nsfw = options.nsfw;
		this.actions = options.actions;
		this.execute = options.execute;
	}

	public toString() {
		const lines = [];

		lines.push(
			!options["no-color"]
				? `${chalk.bold(this.title)} ${chalk.gray("(id:")} ${
						this.id
				  }${chalk.gray(")")}`
				: `${this.title} (${this.id})`
		);

		lines.push(
			!options["no-color"]
				? `${chalk.gray("Info:")} ${chalk.cyan(
						chalk.italic(this.type.toUpperCase())
				  )}${
						this.nsfw
							? ` ${chalk.gray("(")}${chalk.red("NSFW")}${chalk.gray(")")}`
							: ""
				  }`
				: `Info: ${this.type.toUpperCase()}${this.nsfw ? " (NSFW)" : ""}`
		);

		if (this.actions.length > 0) {
			lines.push("");

			lines.push(
				!options["no-color"] ? chalk.gray("Info taken:") : "Info taken:"
			);

			for (const action of this.actions) {
				lines.push(
					!options["no-color"]
						? `${chalk.gray("-")} ${chalk.cyan(action)}`
						: `- ${action}`
				);
			}
		}

		return lines.join("\n");
	}
}
