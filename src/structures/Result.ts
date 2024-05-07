import chalk from "chalk";
import makeUsernames from "../util/makeUsernames";
import verifyEmail from "../util/verifyEmail";
import capitalize from "../util/capitalize";
import roundDecimal from "../util/roundDecimal";
import { getLocation, parseLocation } from "../util/findLocation";
import logger from "../util/logger";
import { options } from "../cli";

export type ProbValue<T> = T extends object
	? T & { prob: number }
	: { value: T; prob: number };

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

type SearchData = {
	firstName?: string;
	lastName?: string;
	location?: string;
	phone?: string;
} & (
	| { username?: string; usernames?: never }
	| { username?: never; usernames?: string[] }
) &
	({ email?: string; emails?: never } | { email?: never; emails?: string[] });

type ResultOptions = {
	title: string;
	url?: string;
	nsfw?: boolean;
	parent?: Result;
	fetched?: boolean;
	prob?: number;
};

enum Prob {
	SURE = 1,
	LIKELY = 0.8,
	MAYBE = 0.5,
	UNLIKELY = 0.2,
	NO = 0,
}

type URLResult = {
	title: string;
	url: string | null;
	prob: number;
	nsfw: boolean;
	fetched: boolean;
	paths: string[];
};

type LikelyResult = {
	usernames: ProbValue<string>[];
	firstName: ProbValue<string> | null;
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
	paths: string[];
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

	public static async fromSearchData(data: SearchData): Promise<Result> {
		const result = new Result({
			title: "Root",
			prob: Prob.SURE,
			fetched: true,
		});

		if ("username" in data && data.username) {
			result.addUsername(data.username, Prob.LIKELY);
		} else if ("usernames" in data && data.usernames) {
			for (const username of data.usernames) {
				result.addUsername(username, Prob.LIKELY);
			}
		}

		if ("email" in data && data.email) {
			await result.addEmail(data.email, Prob.SURE);
		} else if ("emails" in data && data.emails) {
			for (const email of data.emails) {
				await result.addEmail(email, Prob.SURE);
			}
		}

		if (data.firstName) result.addFirstName(data.firstName, Prob.SURE);
		if (data.lastName) result.addLastName(data.lastName, Prob.SURE);
		if (data.phone) result.addPhone(data.phone, Prob.SURE);
		if (data.location)
			result.addLocation(getLocation(data.location), Prob.SURE);

		return result;
	}

	public title: string;
	public url: string | null = null;
	public nsfw: boolean = false;
	public parent: Result | null = null;
	public fetched: boolean = false;
	public prob: number = Prob.LIKELY;
	public paths: string[] = [];

	public usernames: ProbValue<string>[] = [];
	public firstNames: ProbValue<string>[] = [];
	public lastNames: ProbValue<string>[] = [];
	public locations: ProbValue<Location>[] = [];
	public emails: ProbValue<Email>[] = [];
	public phones: ProbValue<Phone>[] = [];
	public urls: ProbValue<Result>[] = [];

	public constructor(options: ResultOptions) {
		this.title = options.title;

		if (options.url) this.url = options.url;
		if (options.nsfw) this.nsfw = options.nsfw;
		if (options.parent) this.parent = options.parent;
		if (options.fetched) this.fetched = options.fetched;
		if (options.prob) this.prob = options.prob;

		this.paths.push(this.tracePath());
	}

	private tracePath(): string {
		if (!this.parent) return this.title;
		return `${this.parent.tracePath()} > ${this.title}`;
	}

	private findUsername(username: string): ProbValue<string> | null {
		const existingUsername = this.usernames.find((u) => u.value === username);
		if (existingUsername) return existingUsername;
		return this.parent?.findUsername(username) ?? null;
	}

	private findFirstName(firstName: string): ProbValue<string> | null {
		const existingFirstName = this.firstNames.find(
			(name) => name.value === firstName
		);

		if (existingFirstName) return existingFirstName;
		return this.parent?.findFirstName(firstName) ?? null;
	}

	private findLastName(lastName: string): ProbValue<string> | null {
		const existingLastName = this.lastNames.find(
			(name) => name.value === lastName
		);

		if (existingLastName) return existingLastName;
		return this.parent?.findLastName(lastName) ?? null;
	}

	private findCountry(location: Location): ProbValue<Location> | null {
		const existingCountry = this.locations.find(
			(l) => l.country === location.country
		);

		if (existingCountry) return existingCountry;
		return this.parent?.findCountry(location) ?? null;
	}

	private findCity(location: Location): ProbValue<Location> | null {
		const existingCity = this.locations.find(
			(l) => l.country === location.country && l.city === location.city
		);

		if (existingCity) return existingCity;
		return this.parent?.findCity(location) ?? null;
	}

	private findEmail(email: string): ProbValue<string> | null {
		const existingEmail = this.emails.find((e) => e.value === email);
		if (existingEmail) return existingEmail;
		return this.parent?.findEmail(email) ?? null;
	}

	private findPhone(phone: string): ProbValue<string> | null {
		const existingPhone = this.phones.find((p) => p.value === phone);
		if (existingPhone) return existingPhone;
		return this.parent?.findPhone(phone) ?? null;
	}

	private findUrl(result: Result): ProbValue<Result> | null {
		const existingUrl = this.urls.find((r) => r.url === result.url);
		if (existingUrl) return existingUrl;
		return this.parent?.findUrl(result) ?? null;
	}

	public setParent(parent: Result): void {
		if (this.parent === parent) return;
		this.parent = parent;
		this.paths.push(this.tracePath());
	}

	public addUsername(username: string, prob: number): void {
		username = username.toLowerCase();

		const existingUsername = this.findUsername(username);
		const usernames = makeUsernames(this.root, { excludeUsernames: true });
		const foundUsername = usernames.find((u) => u.value === username);

		if (foundUsername) {
			this.prob = (Math.max(prob, this.prob) + Prob.SURE) / 2;
			prob = (prob + Prob.SURE) / 2;
		}

		if (
			existingUsername &&
			this.parent &&
			!this.parent.equals(this.root) &&
			this.parent.websiteUsername !== username
		) {
			existingUsername.prob =
				(Math.max(existingUsername.prob, prob) + Prob.SURE) / 2;
		} else if (!existingUsername) {
			this.usernames.push({ value: username, prob });
		}

		this.parent?.addUsername(username, prob);
	}

	public addFirstName(firstName: string, prob: number): void {
		firstName = firstName.toLowerCase();

		const existingFirstName = this.findFirstName(firstName);

		if (existingFirstName?.value === firstName) {
			this.prob = (Math.max(prob, this.prob) + Prob.SURE) / 2;
			prob = (prob + Prob.SURE) / 2;
		}

		if (existingFirstName?.prob === Prob.SURE) return;

		if (existingFirstName) {
			existingFirstName.prob =
				(Math.max(existingFirstName.prob, prob * this.prob) + Prob.SURE) / 2;
		} else {
			this.firstNames.push({ value: firstName, prob: prob * this.prob });
		}

		this.parent?.addFirstName(firstName, prob);
	}

	public addLastName(lastName: string, prob: number): void {
		lastName = lastName.toLowerCase();

		const existingLastName = this.findLastName(lastName);

		if (existingLastName?.value === lastName) {
			this.prob = (Math.max(prob, this.prob) + Prob.SURE) / 2;
			prob = (prob + Prob.SURE) / 2;
		}

		if (existingLastName?.prob === Prob.SURE) return;

		if (existingLastName) {
			existingLastName.prob =
				(Math.max(existingLastName.prob, prob * this.prob) + Prob.SURE) / 2;
		} else {
			this.lastNames.push({ value: lastName, prob: prob * this.prob });
		}

		this.parent?.addLastName(lastName, prob);
	}

	public addLocation(location: Location, prob: number): void {
		location.country = location.country.toLowerCase();
		if (location.city) location.city = location.city.toLowerCase();

		const existingCountry = this.findCountry(location);
		const existingCity = this.findCity(location);

		if (existingCountry?.country === location.country) {
			this.prob = (Math.max(prob, this.prob) + Prob.SURE) / 2;
			prob = (prob + Prob.SURE) / 2;
		}

		if (existingCity?.city && existingCity?.city === location.city) {
			this.prob = (Math.max(prob, this.prob) + Prob.SURE) / 2;
			prob = (prob + Prob.SURE) / 2;
		}

		if (existingCountry?.prob === Prob.SURE) return;
		if (existingCity?.prob === Prob.SURE) return;

		if (existingCountry) {
			existingCountry.prob =
				(Math.max(existingCountry.prob, prob * this.prob) + Prob.SURE) / 2;
		} else {
			this.locations.push({ ...location, prob: prob * this.prob });
		}

		this.parent?.addLocation(location, prob);
	}

	public async addEmail(email: string, prob: number): Promise<void> {
		email = email.toLowerCase();

		const existingEmail = this.findEmail(email);
		const verified = await verifyEmail(email);

		if (existingEmail?.value === email) {
			this.prob = (Math.max(prob, this.prob) + Prob.SURE) / 2;
			prob = (prob + Prob.SURE) / 2;
		}

		if (existingEmail) {
			existingEmail.prob =
				(Math.max(existingEmail.prob, prob * this.prob) + Prob.SURE) / 2;
		} else {
			this.emails.push({ value: email, prob: prob * this.prob, verified });
		}

		await this.parent?.addEmail(email, prob);
	}

	public addPhone(phone: string, prob: number, country?: string): void {
		phone = phone.toLowerCase();

		const existingPhone = this.findPhone(phone);
		if (existingPhone?.prob === Prob.SURE) return;

		if (existingPhone?.value === phone) {
			this.prob = (Math.max(prob, this.prob) + Prob.SURE) / 2;
			prob = (prob + Prob.SURE) / 2;
		}

		if (existingPhone) {
			existingPhone.prob =
				(Math.max(existingPhone.prob, prob * this.prob) + Prob.SURE) / 2;
		} else {
			this.phones.push({ value: phone, prob: prob * this.prob, country });
		}

		this.parent?.addPhone(phone, prob, country);
	}

	public addUrl(result: Result): void {
		const existingUrl = this.findUrl(result);
		if (existingUrl?.prob === Prob.SURE) return;

		result.setParent(this);

		if (existingUrl) {
			existingUrl.prob =
				(Math.max(existingUrl.prob, result.prob) + Prob.SURE) / 2;

			if (result.fetched) existingUrl.fetched = true;
		} else {
			this.urls.push(result);
		}

		this.parent?.addUrl(result);
	}

	public get root(): Result {
		return this.parent ? this.parent.root : this;
	}

	public get websiteUsername(): string {
		return this.usernames[0].value;
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

	public get likely(): LikelyResult {
		return {
			usernames: this.usernames.filter((u) => u.prob >= Prob.LIKELY),
			firstName: this.firstNames.sort((a, b) => b.prob - a.prob)[0] ?? null,
			lastName: this.lastNames.sort((a, b) => b.prob - a.prob)[0] ?? null,
			location: this.locations.sort((a, b) => b.prob - a.prob)[0] ?? null,
			emails: this.emails.filter((u) => u.prob >= Prob.LIKELY),
			phone: this.phones.sort((a, b) => b.prob - a.prob)[0] ?? null,
			urls: this.urls
				.sort((a, b) => b.prob - a.prob)
				.map((r) => ({
					title: r.title,
					url: r.url,
					prob: r.prob,
					nsfw: r.nsfw,
					fetched: r.fetched,
					paths: r.paths,
				})),
		};
	}

	public equals(result: Result): boolean {
		return (
			this.title === result.title &&
			this.url === result.url &&
			this.nsfw === result.nsfw &&
			this.fetched === result.fetched &&
			this.prob === result.prob &&
			this.usernames.length === result.usernames.length &&
			this.firstNames.length === result.firstNames.length &&
			this.lastNames.length === result.lastNames.length &&
			this.locations.length === result.locations.length &&
			this.emails.length === result.emails.length &&
			this.phones.length === result.phones.length &&
			this.urls.length === result.urls.length &&
			this.usernames.every((u, i) => u.value === result.usernames[i].value) &&
			this.firstNames.every((n, i) => n.value === result.firstNames[i].value) &&
			this.lastNames.every((n, i) => n.value === result.lastNames[i].value) &&
			this.locations.every(
				(c, i) =>
					c.country === result.locations[i].country &&
					c.city === result.locations[i].city
			) &&
			this.emails.every((e, i) => e.value === result.emails[i].value) &&
			this.phones.every((p, i) => p.value === result.phones[i].value) &&
			this.urls.every((r, i) => r.equals(result.urls[i]))
		);
	}

	public copy(): Result {
		const result = new Result({
			title: this.title,
			url: this.url ?? undefined,
			nsfw: this.nsfw,
			fetched: this.fetched,
			prob: this.prob,
		});

		result.usernames = this.usernames.map((u) => ({ ...u }));
		result.firstNames = this.firstNames.map((n) => ({ ...n }));
		result.lastNames = this.lastNames.map((n) => ({ ...n }));
		result.locations = this.locations.map((c) => ({ ...c }));
		result.emails = this.emails.map((e) => ({ ...e }));
		result.phones = this.phones.map((p) => ({ ...p }));
		result.urls = this.urls.map((r) => r.copy());

		return result;
	}

	public toJSON(): JSONResult {
		return {
			title: this.title,
			url: this.url,
			nsfw: this.nsfw,
			paths: this.paths,
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

	public log() {
		logger.log(
			`${options.colors ? chalk.black("(") : "("}${
				options.colors ? chalk.green("+") : "+"
			}${options.colors ? chalk.black(")") : ")"} ${this.title}${chalk.black(
				":"
			)}${
				this.nsfw
					? ` ${options.colors ? chalk.black("(") : "("}${
							options.colors ? chalk.red("!") : "!"
					  }${options.colors ? chalk.black(")") : ")"}`
					: ""
			} ${options.colors ? chalk.cyan(chalk.underline(this.url)) : this.url} ${
				options.colors
					? (this.prob >= Result.Prob.LIKELY
							? chalk.green
							: this.prob >= Result.Prob.MAYBE
							? chalk.yellow
							: chalk.red)(roundDecimal(this.prob * 100, 3))
					: roundDecimal(this.prob * 100, 3)
			}${options.colors ? chalk.black("%") : "%"}`
		);
	}

	public toString(colored = false) {
		const { likely } = this;
		const lines: string[] = [];

		if (likely.usernames.length > 0) {
			lines.push(
				`${colored ? chalk.black("[") : "["}Usernames${
					colored ? chalk.black("]") : "]"
				} ${likely.usernames
					.sort((a, b) => b.prob - a.prob)
					.map((u) => (colored ? chalk.cyan(u.value) : u.value))
					.join(colored ? chalk.black(", ") : ", ")}`
			);
		}

		if (likely.firstName) {
			lines.push(
				`${colored ? chalk.black("[") : "["}First Name${
					colored ? chalk.black("]") : "]"
				} ${
					colored
						? chalk.cyan(capitalize(likely.firstName.value))
						: capitalize(likely.firstName.value)
				}`
			);
		}

		if (likely.lastName) {
			lines.push(
				`${colored ? chalk.black("[") : "["}Last Name${
					colored ? chalk.black("]") : "]"
				} ${
					colored
						? chalk.cyan(capitalize(likely.lastName.value, true))
						: capitalize(likely.lastName.value, true)
				}`
			);
		}

		if (likely.emails.length > 0) {
			lines.push(
				`${colored ? chalk.black("[") : "["}Emails${
					colored ? chalk.black("]") : "]"
				} ${likely.emails
					.sort((a, b) => b.prob - a.prob)
					.map(
						(u) =>
							`${colored ? chalk.cyan(u.value) : u.value}${
								u.verified
									? `${colored ? chalk.black(" (") : " ("}${
											colored ? chalk.green("✔ Valid SMTP") : "Valid SMTP"
									  }${colored ? chalk.black(")") : ")"}`
									: ""
							}`
					)
					.join(colored ? chalk.black(", ") : ", ")}`
			);
		}

		if (likely.phone) {
			lines.push(
				`${colored ? chalk.black("[") : "["}Phone Number${
					colored ? chalk.black("]") : "]"
				} ${colored ? chalk.cyan(likely.phone.value) : likely.phone.value}`
			);
		}

		if (likely.location) {
			lines.push(
				`${colored ? chalk.black("[") : "["}Location${
					colored ? chalk.black("]") : "]"
				} ${
					colored
						? chalk.cyan(capitalize(parseLocation(likely.location), true))
						: capitalize(parseLocation(likely.location), true)
				}`
			);
		}

		if (likely.urls.length > 0) {
			lines.push("");

			for (const website of likely.urls) {
				lines.push(
					`${colored ? chalk.black("[") : "["}${website.title}${
						colored ? chalk.black("]") : "]"
					} ${
						colored ? chalk.cyan(chalk.underline(website.url)) : website.url
					} ${
						colored
							? (website.prob >= Result.Prob.LIKELY
									? chalk.green
									: website.prob >= Result.Prob.MAYBE
									? chalk.yellow
									: chalk.red)(roundDecimal(website.prob * 100, 3))
							: roundDecimal(website.prob * 100, 3)
					}${colored ? chalk.black("%") : "%"}${
						website.fetched
							? colored
								? `${chalk.black(" (")}${chalk.green("✔ Fetched")}${chalk.black(
										")"
								  )}`
								: " (Fetched)"
							: ""
					}`
				);
			}
		}

		return lines.join("\n");
	}
}
