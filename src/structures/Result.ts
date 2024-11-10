import chalk from "chalk";
import { usernameComplexity } from "../util/makeUsernames";
import verifyEmail from "../util/verifyEmail";
import capitalize from "../util/capitalize";
import roundDecimal from "../util/roundDecimal";
import { getLocation, parseLocation } from "../util/findLocation";
import logger from "../util/logger";
import options, { allowed } from "../options";
import { getPhone } from "../util/findPhones";
import { getGender, nameComplexity } from "../util/findNames";
import { Type } from "./Website";
import unobfuscate from "../util/unobfuscate";

export enum Gender {
	MALE,
	FEMALE,
}

export type ProbValue<T> = T extends object
	? T & { prob: number; new: boolean }
	: { value: T; prob: number; new: boolean };

export type Email = {
	value: string;
	verified: boolean;
};

export type Location = {
	city?: string;
	country: string;
};

export type Phone = {
	value: string;
	country?: string;
};

export type FirstName = {
	value: string;
	gender?: Gender;
};

export type SearchData = {
	first_name?: string;
	last_name?: string;
	location?: string | Location;
	phone?: string;
} & (
	| { username?: string; usernames?: never }
	| { username?: never; usernames?: string[] }
) &
	({ email?: string; emails?: never } | { email?: never; emails?: string[] });

enum LogType {
	ADD = "add",
	UPDATE = "update",
	REMOVE = "remove",
}

enum Prob {
	SURE = 1,
	LIKELY = 0.8,
	MAYBE = 0.5,
	UNLIKELY = 0.2,
	NO = 0,
}

type ResultOptions = {
	id: string;
	title: string;
	type?: Type | null;
	prob?: number;
	username?: string;
	url?: string | null;
	nsfw?: boolean;
	parent?: Result | null;
	fetched?: boolean;
	usernames?: ProbValue<string>[];
	firstNames?: ProbValue<FirstName>[];
	lastNames?: ProbValue<string>[];
	locations?: ProbValue<Location>[];
	emails?: ProbValue<Email>[];
	phones?: ProbValue<Phone>[];
	urls?: Result[];
	copy?: boolean;
};

type URLResult = {
	title: string;
	url: string | null;
	prob: number;
	nsfw: boolean;
	fetched: boolean;
};

type LikelyResult = {
	usernames: ProbValue<string>[];
	firstName: ProbValue<FirstName> | null;
	lastName: ProbValue<string> | null;
	location: ProbValue<Location> | null;
	emails: ProbValue<Email>[];
	phone: ProbValue<Phone> | null;
	urls: URLResult[];
};

type JSONResult = {
	title: string;
	url: string | null;
	nsfw: boolean;
	fetched: boolean;
	prob: number;
	usernames: ProbValue<string>[];
	firstNames: ProbValue<string>[];
	lastNames: ProbValue<string>[];
	locations: ProbValue<Location>[];
	emails: ProbValue<Email>[];
	phones: ProbValue<Phone>[];
	urls: JSONResult[];
};

export default class Result {
	public static Prob = Prob;
	public static LogType = LogType;

	private static stackProbs<T>(values: ProbValue<T>[]): number | null {
		if (values.length === 0) return null;
		return values.reduce((acc, val) => acc + val.prob, 0) / values.length;
	}

	public static async fromSearchData(data: SearchData): Promise<Result> {
		const result = new Result({
			id: "root",
			title: "Root",
			fetched: true,
		});

		if (data.username) {
			result.usernames.push({
				value: data.username?.toLowerCase().trim(),
				prob: usernameComplexity(data.username),
				new: true,
			});
		} else if (data.usernames) {
			result.usernames.push(
				...data.usernames.map((u) => ({
					value: u?.toLowerCase().trim(),
					prob: usernameComplexity(u),
					new: true,
				}))
			);
		}

		if (data.email) {
			const verified = await verifyEmail(data.email);

			result.emails.push({
				value: data.email?.toLowerCase().trim(),
				prob: verified ? Prob.SURE : Prob.LIKELY,
				new: true,
				verified,
			});
		} else if (data.emails) {
			for (const email of data.emails) {
				const verified = await verifyEmail(email);

				result.emails.push({
					value: email?.toLowerCase().trim(),
					prob: verified ? Prob.SURE : Prob.LIKELY,
					new: true,
					verified,
				});
			}
		}

		if (data.first_name) {
			result.firstNames.push({
				value: data.first_name?.toLowerCase().trim(),
				prob: Prob.SURE,
				new: true,
			});
		}

		if (data.last_name) {
			result.lastNames.push({
				value: data.last_name?.toLowerCase().trim(),
				prob: Prob.SURE,
				new: true,
			});
		}

		let location: Location | null = null;

		if (data.location && typeof data.location === "string") {
			location = getLocation(data.location?.toLowerCase().trim());
		} else if (data.location) {
			location = data.location as Location;
		}

		if (location) {
			result.locations.push({
				country: location.country?.toLowerCase().trim(),
				city: location.city?.toLowerCase().trim(),
				prob: Prob.SURE,
				new: true,
			});
		}

		if (data.phone) {
			const phone = getPhone(data.phone);

			if (phone) {
				result.phones.push({
					...phone,
					prob: Prob.SURE,
					new: true,
				});
			}
		}

		result.nextTurn();

		return result;
	}

	public id: string;
	public title: string;
	public type: Type | null;
	public url: string | null;
	public nsfw: boolean;
	public parent: Result | null;
	public fetched: boolean;

	public usernames: ProbValue<string>[] = [];
	public firstNames: ProbValue<FirstName>[] = [];
	public lastNames: ProbValue<string>[] = [];
	public locations: ProbValue<Location>[] = [];
	public emails: ProbValue<Email>[] = [];
	public phones: ProbValue<Phone>[] = [];
	public urls: Result[] = [];
	private used: Set<string> = new Set();

	public constructor(options: ResultOptions) {
		this.id = options.id;
		this.title = options.title;
		this.type = options.type ?? null;
		this.url = options.url ?? null;
		this.nsfw = options.nsfw ?? false;
		this.parent = options.parent ?? null;
		this.fetched = options.fetched ?? false;

		if (options.usernames) this.usernames = options.usernames;
		if (options.firstNames) this.firstNames = options.firstNames;
		if (options.lastNames) this.lastNames = options.lastNames;
		if (options.locations) this.locations = options.locations;
		if (options.emails) this.emails = options.emails;
		if (options.phones) this.phones = options.phones;
		if (options.urls) this.urls = options.urls;

		if (options.username && options.prob)
			this.usernames.push({
				value: options.username,
				prob: options.prob * usernameComplexity(options.username),
				new: true,
			});

		if (this.parent && !options.copy) this.parent.addUrl(this);
	}

	public get isRoot(): boolean {
		return this.id === "root";
	}

	public get root(): Result {
		return this.isRoot ? this : this.parent!.root;
	}

	public get new(): boolean {
		return this.usernames.some((u) => u.new);
	}

	public get username(): ProbValue<string> | null {
		return this.usernames[0] ?? null;
	}

	public hasInfoInUsername(values: ProbValue<string>[]) {
		for (const { value } of values) {
			if (this.root.usernames.some((u) => u.value.includes(value))) return true;
		}

		return false;
	}

	public get prob(): number {
		if (this.isRoot) return Prob.SURE;
		let prob = Result.stackProbs(
			this.usernames.filter((u) => u.prob >= this.username!.prob)
		)!;

		if (this.firstNames.length > 0) {
			prob = Math.max(prob, (prob + Result.stackProbs(this.firstNames)!) / 2);
		}

		if (this.lastNames.length > 0) {
			prob = Math.max(prob, (prob + Result.stackProbs(this.lastNames)!) / 2);
		}

		if (this.locations.length > 0) {
			prob = Math.max(prob, (prob + Result.stackProbs(this.locations)!) / 2);
		}

		if (this.emails.length > 0) {
			prob = Math.max(prob, (prob + Result.stackProbs(this.emails)!) / 2);
		}

		if (this.phones.length > 0) {
			prob = Math.max(prob, (prob + Result.stackProbs(this.phones)!) / 2);
		}

		return isFinite(prob) ? prob : Prob.SURE;
	}

	public get firstName(): string | null {
		return (
			this.firstNames.find((name) => name.prob === Prob.SURE)?.value ?? null
		);
	}

	public get lastName(): string | null {
		return (
			this.lastNames.find((name) => name.prob === Prob.SURE)?.value ?? null
		);
	}

	public get location(): string | null {
		const location = this.locations.find((l) => l.prob === Prob.SURE);
		if (!location) return null;
		return parseLocation(location);
	}

	public get email(): string | null {
		return this.emails.find((email) => email.prob === Prob.SURE)?.value ?? null;
	}

	public get phone(): string | null {
		return this.phones.find((phone) => phone.prob === Prob.SURE)?.value ?? null;
	}

	private get likelyLocation(): ProbValue<Location> | null {
		const sorted = this.locations.sort((a, b) => b.prob - a.prob);
		if (sorted.length === 0) return null;

		let result = sorted[0];

		if (!result.city) {
			for (const location of sorted) {
				if (location.city && location.country === result.country) {
					result = location;
					break;
				}
			}
		}

		return result;
	}

	public get likely(): LikelyResult {
		return {
			usernames: this.usernames.filter(
				(u) => u.prob > (Prob.LIKELY + Prob.MAYBE) / 2 && !u.new
			),
			firstName:
				this.firstNames
					.filter((n) => !n.new)
					.sort((a, b) => b.prob - a.prob)[0] ?? null,
			lastName:
				this.lastNames
					.filter((n) => !n.new)
					.sort((a, b) => b.prob - a.prob)[0] ?? null,
			location: this.likelyLocation,
			emails: this.emails.filter((u) => u.prob >= Prob.MAYBE),
			phone: this.phones.sort((a, b) => b.prob - a.prob)[0] ?? null,
			urls: this.urls
				.sort((a, b) => b.prob - a.prob)
				.map((r) => ({
					title: r.title,
					url: r.url,
					prob: r.prob,
					nsfw: r.nsfw,
					fetched: r.fetched,
				})),
		};
	}

	public equals(result: Result): boolean {
		if (this.title !== result.title) return false;
		if (this.url !== result.url) return false;
		if (this.nsfw !== result.nsfw) return false;
		if (this.fetched !== result.fetched) return false;
		if (this.prob !== result.prob) return false;
		if (this.usernames.length !== result.usernames.length) return false;
		if (this.firstNames.length !== result.firstNames.length) return false;
		if (this.lastNames.length !== result.lastNames.length) return false;
		if (this.locations.length !== result.locations.length) return false;
		if (this.emails.length !== result.emails.length) return false;
		if (this.phones.length !== result.phones.length) return false;
		if (this.urls.length !== result.urls.length) return false;

		if (
			this.usernames.some(
				(u) => !result.usernames.some((r) => r.value === u.value)
			)
		)
			return false;

		if (
			this.firstNames.some(
				(n) => !result.firstNames.some((r) => r.value === n.value)
			)
		)
			return false;

		if (
			this.lastNames.some(
				(n) => !result.lastNames.some((r) => r.value === n.value)
			)
		)
			return false;

		if (
			this.locations.some(
				(l) => !result.locations.some((r) => r.country === l.country)
			)
		)
			return false;

		if (
			this.emails.some((e) => !result.emails.some((r) => r.value === e.value))
		)
			return false;

		if (
			this.phones.some((p) => !result.phones.some((r) => r.value === p.value))
		)
			return false;

		if (this.urls.some((r) => !result.urls.some((u) => r.equals(u))))
			return false;

		return true;
	}

	public copy(): Result {
		return new Result({
			id: this.id,
			title: this.title,
			type: this.type,
			url: this.url,
			nsfw: this.nsfw,
			fetched: this.fetched,
			parent: this.parent,
			usernames: this.usernames,
			firstNames: this.firstNames,
			lastNames: this.lastNames,
			locations: this.locations,
			emails: this.emails,
			phones: this.phones,
			urls: this.urls.map((url) => url.copy()),
			copy: true,
		});
	}

	public toJSON(): JSONResult {
		return {
			title: this.title,
			url: this.url,
			nsfw: this.nsfw,
			fetched: this.fetched,
			prob: this.prob,
			usernames: this.usernames,
			firstNames: this.firstNames,
			lastNames: this.lastNames,
			locations: this.locations,
			emails: this.emails,
			phones: this.phones,
			urls: this.urls.map((url) => url.toJSON()),
		};
	}

	public log(type: LogType) {
		logger.log(
			`${!options["no-color"] ? chalk.gray("(") : "("}${
				type === LogType.ADD
					? !options["no-color"]
						? chalk.green("+")
						: "+"
					: type === LogType.UPDATE
					? !options["no-color"]
						? chalk.yellow("↻")
						: "~"
					: !options["no-color"]
					? chalk.red("-")
					: "-"
			}${!options["no-color"] ? chalk.gray(")") : ")"} ${this.title}${
				this.nsfw
					? ` ${!options["no-color"] ? chalk.gray("(") : "("}${
							!options["no-color"] ? chalk.red("!") : "!"
					  }${!options["no-color"] ? chalk.gray(")") : ")"}`
					: ""
			}${chalk.gray(":")} ${
				!options["no-color"] ? chalk.underline.cyan(this.url) : this.url
			} ${!options["no-color"] ? chalk.gray("(") : "("}${this.getPath()
				.map((e) => chalk[e.fetched ? "green" : "red"](e.id.toUpperCase()))
				.join(!options["no-color"] ? chalk.gray(" > ") : " > ")}${
				!options["no-color"] ? chalk.gray(")") : ")"
			} ${
				!options["no-color"]
					? (this.prob >= Result.Prob.LIKELY
							? chalk.green
							: this.prob >= Result.Prob.MAYBE
							? chalk.yellow
							: chalk.red)(roundDecimal(this.prob * 100, 3))
					: roundDecimal(this.prob * 100, 3)
			}${!options["no-color"] ? chalk.gray("%") : "%"}`
		);
	}

	private getPath() {
		const path: Result[] = [];
		let current: Result | null = this;

		while (current) {
			path.unshift(current);
			current = current.parent;
		}

		return path;
	}

	public toString(colored = false) {
		const { likely } = this;
		const lines: string[] = [];

		if (likely.usernames.length > 0) {
			lines.push(
				`${colored ? chalk.gray("[") : "["}Usernames${
					colored ? chalk.gray("]") : "]"
				} ${likely.usernames
					.sort((a, b) => b.prob - a.prob)
					.map(
						(u) =>
							`${colored ? chalk.cyan(u.value) : u.value} ${
								colored
									? (u.prob >= Result.Prob.LIKELY
											? chalk.green
											: u.prob >= Result.Prob.MAYBE
											? chalk.yellow
											: chalk.red)(roundDecimal(u.prob * 100, 3))
									: roundDecimal(u.prob * 100, 3)
							}${colored ? chalk.gray("%") : "%"}`
					)
					.join(colored ? chalk.gray(", ") : ", ")}`
			);
		}

		if (likely.firstName) {
			lines.push(
				`${colored ? chalk.gray("[") : "["}First Name${
					colored ? chalk.gray("]") : "]"
				} ${
					colored
						? chalk.cyan(capitalize(likely.firstName.value))
						: capitalize(likely.firstName.value)
				}${
					likely.firstName.gender !== undefined
						? ` ${colored ? chalk.gray("(") : "("}${
								(likely.firstName.gender as Gender) === Gender.MALE
									? colored
										? chalk.blue("♂")
										: "Male"
									: colored
									? chalk.red("♀")
									: "Female"
						  }${colored ? chalk.gray(")") : ")"}`
						: ""
				} ${
					colored
						? (likely.firstName.prob >= Result.Prob.LIKELY
								? chalk.green
								: likely.firstName.prob >= Result.Prob.MAYBE
								? chalk.yellow
								: chalk.red)(roundDecimal(likely.firstName.prob * 100, 3))
						: roundDecimal(likely.firstName.prob * 100, 3)
				}${colored ? chalk.gray("%") : "%"}`
			);
		}

		if (likely.lastName) {
			lines.push(
				`${colored ? chalk.gray("[") : "["}Last Name${
					colored ? chalk.gray("]") : "]"
				} ${
					colored
						? chalk.cyan(capitalize(likely.lastName.value, true))
						: capitalize(likely.lastName.value, true)
				} ${
					colored
						? (likely.lastName.prob >= Result.Prob.LIKELY
								? chalk.green
								: likely.lastName.prob >= Result.Prob.MAYBE
								? chalk.yellow
								: chalk.red)(roundDecimal(likely.lastName.prob * 100, 3))
						: roundDecimal(likely.lastName.prob * 100, 3)
				}${colored ? chalk.gray("%") : "%"}`
			);
		}

		if (likely.location) {
			lines.push(
				`${colored ? chalk.gray("[") : "["}Location${
					colored ? chalk.gray("]") : "]"
				} ${
					colored
						? chalk.cyan(capitalize(parseLocation(likely.location), true))
						: capitalize(parseLocation(likely.location), true)
				} ${
					colored
						? (likely.location.prob >= Result.Prob.LIKELY
								? chalk.green
								: likely.location.prob >= Result.Prob.MAYBE
								? chalk.yellow
								: chalk.red)(roundDecimal(likely.location.prob * 100, 3))
						: roundDecimal(likely.location.prob * 100, 3)
				}${colored ? chalk.gray("%") : "%"}`
			);
		}

		if (likely.emails.length > 0) {
			lines.push(
				`${colored ? chalk.gray("[") : "["}Emails${
					colored ? chalk.gray("]") : "]"
				} ${likely.emails
					.sort((a, b) => b.prob - a.prob)
					.map(
						(e) =>
							`${colored ? chalk.cyan(e.value) : e.value}${
								e.verified
									? `${colored ? chalk.gray(" (") : " ("}${
											colored ? chalk.green("✓ Valid SMTP") : "Valid SMTP"
									  }${colored ? chalk.gray(")") : ")"}`
									: ""
							} ${
								colored
									? (e.prob >= Result.Prob.LIKELY
											? chalk.green
											: e.prob >= Result.Prob.MAYBE
											? chalk.yellow
											: chalk.red)(roundDecimal(e.prob * 100, 3))
									: roundDecimal(e.prob * 100, 3)
							}${colored ? chalk.gray("%") : "%"}`
					)
					.join(colored ? chalk.gray(", ") : ", ")}`
			);
		}

		if (likely.phone) {
			lines.push(
				`${colored ? chalk.gray("[") : "["}Phone Number${
					colored ? chalk.gray("]") : "]"
				} ${colored ? chalk.cyan(likely.phone.value) : likely.phone.value} ${
					colored
						? (likely.phone.prob >= Result.Prob.LIKELY
								? chalk.green
								: likely.phone.prob >= Result.Prob.MAYBE
								? chalk.yellow
								: chalk.red)(roundDecimal(likely.phone.prob * 100, 3))
						: roundDecimal(likely.phone.prob * 100, 3)
				}${colored ? chalk.gray("%") : "%"}`
			);
		}

		if (likely.urls.length > 0) {
			lines.push("");

			for (const website of likely.urls) {
				lines.push(
					`${colored ? chalk.gray("[") : "["}${website.title}${
						colored ? chalk.gray("]") : "]"
					}${
						website.nsfw
							? ` ${colored ? chalk.gray("(") : "("}${
									colored ? chalk.red("!") : "!"
							  }${colored ? chalk.gray(")") : ")"}`
							: ""
					} ${colored ? chalk.underline.cyan(website.url) : website.url} ${
						colored
							? (website.prob >= Result.Prob.LIKELY
									? chalk.green
									: website.prob >= Result.Prob.MAYBE
									? chalk.yellow
									: chalk.red)(roundDecimal(website.prob * 100, 3))
							: roundDecimal(website.prob * 100, 3)
					}${colored ? chalk.gray("%") : "%"}${
						website.fetched
							? colored
								? `${chalk.gray(" (")}${chalk.green("✓ Fetched")}${chalk.gray(
										")"
								  )}`
								: " (Fetched)"
							: colored
							? `${chalk.gray(" (")}${chalk.red("✗ Not Fetched")}${chalk.gray(
									")"
							  )}`
							: " (Not Fetched)"
					}`
				);
			}
		}

		return lines.join("\n");
	}

	public nextTurn() {
		this.usernames.forEach((username) => (username.new = false));
		this.firstNames.forEach((firstName) => (firstName.new = false));
		this.lastNames.forEach((lastName) => (lastName.new = false));
		this.locations.forEach((location) => (location.new = false));
		this.emails.forEach((email) => (email.new = false));
		this.phones.forEach((phone) => (phone.new = false));
		this.urls.forEach((url) => url.nextTurn());
	}

	public addUrl(result: Result) {
		if (
			!allowed(result.id, result.type!) ||
			this.used.has("url:" + result.url!)
		)
			return;

		const oldProb = this.prob;
		const existing = this.root.urls.find((r) => r.url === result.url);
		if (existing?.prob === Prob.SURE) return;

		if (existing) {
			const startProb = Math.max(existing.username!.prob, result.prob);

			existing.username!.prob =
				(Math.max(existing.username!.prob, result.prob) + Prob.SURE) / 2;

			if (result.fetched) existing.fetched = true;
			if (startProb < existing.username!.prob && options.verbose)
				existing.log(LogType.UPDATE);

			this.used.add("url:" + result.url!);
		} else {
			this.urls.push(result);

			const existingUsername = this.root.usernames.find(
				(u) => result.username && u.value === result.username.value
			);

			if (existingUsername) {
				if (existingUsername.prob !== Prob.SURE)
					existingUsername.prob = (existingUsername.prob + result.prob) / 2;
			} else {
				this.usernames.push({
					value: result.username!.value.toLowerCase().trim(),
					prob: result.prob,
					new: true,
				});
			}

			if (options.verbose && this.isRoot) {
				result.log(LogType.ADD);
				if (oldProb !== this.prob) this.log(LogType.UPDATE);
			}
		}

		this.parent?.addUrl(result);
	}

	public addFirstName(
		firstName: string,
		prob: number,
		prepare: boolean = true
	) {
		if (prepare) {
			firstName = firstName.toLowerCase().trim();
			prob *= nameComplexity(firstName);
		}

		if (this.used.has("firstName:" + firstName)) return;

		prob *= this.prob;

		const oldProb = this.prob;
		const existing = this.root.firstNames.find((n) => n.value === firstName);

		if (existing) {
			if (existing.prob !== Prob.SURE)
				existing.prob = (existing.prob + prob) / 2;

			prob = this.prob + (Prob.SURE - this.prob) * existing.prob;
			this.used.add("firstName:" + firstName);
		}

		prob = isFinite(prob) ? prob : Prob.SURE;

		const data: ProbValue<FirstName> = {
			value: firstName,
			prob,
			new: true,
			gender: getGender(firstName),
		};

		this.firstNames.push(data);

		this.root.usernames
			.filter((u) => unobfuscate(u.value).includes(firstName))
			.forEach((u) => {
				if (prob === Prob.SURE) return;
				data.prob += ((Prob.SURE - data.prob) * u.prob) / 2;
			});

		if (options.verbose && !this.isRoot && oldProb < this.prob)
			this.log(LogType.UPDATE);

		this.parent?.addFirstName(firstName, prob, false);
	}

	public addLastName(lastName: string, prob: number, prepare: boolean = true) {
		if (prepare) {
			lastName = lastName.toLowerCase().trim();
			prob *= nameComplexity(lastName);
		}

		if (this.used.has("lastName:" + lastName)) return;

		prob *= this.prob;

		const oldProb = this.prob;
		const existing = this.root.lastNames.find((n) => n.value === lastName);

		if (existing) {
			if (existing.prob !== Prob.SURE)
				existing.prob = (existing.prob + prob) / 2;

			prob = this.prob + (Prob.SURE - this.prob) * existing.prob;
			this.used.add("lastName:" + lastName);
		}

		prob = isFinite(prob) ? prob : Prob.SURE;

		const data: ProbValue<string> = {
			value: lastName,
			prob,
			new: true,
		};

		this.lastNames.push(data);

		this.root.usernames
			.filter((u) => unobfuscate(u.value).includes(lastName))
			.forEach((u) => {
				if (prob === Prob.SURE) return;
				data.prob += ((Prob.SURE - data.prob) * u.prob) / 2;
			});

		if (options.verbose && !this.isRoot && oldProb < this.prob)
			this.log(LogType.UPDATE);

		this.parent?.addLastName(lastName, prob, false);
	}

	public addLocation(location: Location, prob: number) {
		location.country = location.country.toLowerCase().trim();
		location.city = location.city?.toLowerCase().trim();

		if (this.used.has("location:" + location.country)) return;

		const oldProb = this.prob;

		const existingCountry = this.root.locations.find(
			(l) => l.country === location.country
		);

		const existingCity = this.root.locations.find(
			(l) => l.city === location.city && l.country === location.country
		);

		if (existingCity) {
			if (existingCity.prob !== Prob.SURE)
				existingCity.prob = (existingCity.prob + prob) / 2;

			prob = this.prob + (Prob.SURE - this.prob) * existingCity.prob;
			this.used.add("location:" + location.country + ":" + location.city);
		} else if (existingCountry && existingCountry.city) {
			if (existingCountry.prob !== Prob.SURE)
				existingCountry.prob = (existingCountry.prob + prob * 0.5) / 1.5;

			prob = this.prob + ((Prob.SURE - this.prob) * existingCountry.prob) / 2;
			this.used.add("location:" + location.country);
		} else if (existingCountry) {
			if (existingCountry.prob !== Prob.SURE)
				existingCountry.prob = (existingCountry.prob + prob) / 2;

			prob = this.prob + (Prob.SURE - this.prob) * existingCountry.prob;
			this.used.add("location:" + location.country);
		}

		prob = isFinite(prob) ? prob : Prob.SURE;

		this.locations.push({
			...location,
			prob,
			new: true,
		});

		if (
			(existingCountry || existingCity) &&
			options.verbose &&
			!this.isRoot &&
			oldProb !== this.prob
		)
			this.log(LogType.UPDATE);

		this.parent?.addLocation(location, prob);
	}

	public addEmail(email: Email, prob: number) {
		email.value = email.value.toLowerCase().trim();
		prob *= this.prob;

		if (this.used.has("email:" + email.value)) return;

		const oldProb = this.prob;
		const existing = this.root.emails.find((e) => e.value === email.value);

		if (existing) {
			if (existing.prob !== Prob.SURE)
				existing.prob = (existing.prob + prob) / 2;

			prob = this.prob + (Prob.SURE - this.prob) * existing.prob;
			this.used.add("email:" + email.value);
		}

		prob = isFinite(prob) ? prob : Prob.SURE;

		const data: ProbValue<Email> = {
			...email,
			prob,
			new: true,
		};

		this.emails.push(data);

		if (options.verbose && !this.isRoot && oldProb !== this.prob)
			this.log(LogType.UPDATE);

		this.parent?.addEmail(email, prob);
	}

	public addPhone(phone: Phone, prob: number) {
		phone.value = phone.value.toLowerCase().trim();
		prob *= this.prob;

		if (this.used.has("phone:" + phone.value)) return;

		const oldProb = this.prob;
		const existing = this.root.phones.find((p) => p.value === phone.value);

		if (existing) {
			if (existing.prob !== Prob.SURE)
				existing.prob = (existing.prob + prob) / 2;

			prob = this.prob + (Prob.SURE - this.prob) * existing.prob;
			this.used.add("phone:" + phone.value);
		}

		prob = isFinite(prob) ? prob : Prob.SURE;

		const data: ProbValue<Phone> = {
			...phone,
			prob,
			new: true,
		};

		this.phones.push(data);

		if (options.verbose && !this.isRoot && oldProb !== this.prob)
			this.log(LogType.UPDATE);

		this.parent?.addPhone(phone, prob);
	}
}
