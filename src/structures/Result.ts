import chalk from "chalk";
import { usernameComplexity } from "../util/makeUsernames";
import verifyEmail from "../util/verifyEmail";
import capitalize from "../util/capitalize";
import roundDecimal from "../util/roundDecimal";
import { getLocation, parseLocation } from "../util/findLocation";
import logger from "../util/logger";
import options, { allowed } from "../options";
import { getPhone } from "../util/findPhones";
import { getGender } from "../util/findNames";
import type { Type } from "./Website";

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
  firstName?: string;
  lastName?: string;
  location?: string;
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
  type?: Type;
  prob: number;
  username?: string;
  url?: string;
  nsfw?: boolean;
  parent?: Result;
  fetched?: boolean;
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

  private static stackProbs<T>(values: ProbValue<T>[]): number | undefined {
    return values.reduce((acc, val) => acc + val.prob, 0) / values.length;
  }

  public static async fromSearchData(data: SearchData): Promise<Result> {
    const result = new Result({
      id: "root",
      title: "Root",
      prob: Prob.SURE,
      fetched: true,
    });

    if ("username" in data && data.username) {
      result.addUsername(data.username, Prob.SURE);
    } else if ("usernames" in data && data.usernames) {
      for (const username of data.usernames) {
        result.addUsername(username, Prob.SURE);
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
    if (data.phone) result.addPhone(getPhone(data.phone)!, Prob.SURE);
    if (data.location)
      result.addLocation(getLocation(data.location), Prob.SURE);

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

  public constructor(options: ResultOptions) {
    this.id = options.id;
    this.title = options.title;
    this.type = options.type ?? null;
    this.url = options.url ?? null;
    this.nsfw = options.nsfw ?? false;
    this.parent = options.parent ?? null;
    this.fetched = options.fetched ?? false;

    if (options.username) this.addUsername(options.username, options.prob);
    if (this.parent) this.parent.urls.push(this);
  }

  public get root(): Result {
    return this.parent ? this.parent.root : this;
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
    if (this.id === "root") return Prob.SURE;

    let prob = this.username?.prob;

    if (this.hasInfoInUsername(this.firstNames)) {
      if (prob === undefined) {
        prob = Result.stackProbs(this.firstNames);
      } else if (this.firstNames.length > 0) {
        prob = (prob + Result.stackProbs(this.firstNames)! + Prob.SURE) / 3;
      }
    }

    if (this.hasInfoInUsername(this.lastNames)) {
      if (prob === undefined) {
        prob = Result.stackProbs(this.lastNames);
      } else if (this.lastNames.length > 0) {
        prob = (prob + Result.stackProbs(this.lastNames)! + Prob.SURE) / 3;
      }
    }

    if (prob === undefined) {
      prob = Result.stackProbs(this.locations);
    } else if (this.locations.length > 0) {
      prob = (prob + Result.stackProbs(this.locations)! + Prob.SURE) / 3;
    }

    if (prob === undefined) {
      prob = Result.stackProbs(this.emails);
    } else if (this.emails.length > 0) {
      prob = (prob + Result.stackProbs(this.emails)! + Prob.SURE) / 3;
    }

    if (prob === undefined) {
      prob = Result.stackProbs(this.phones);
    } else if (this.phones.length > 0) {
      prob = (prob + Result.stackProbs(this.phones)! + Prob.SURE) / 3;
    }

    return prob ?? Prob.NO;
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
        })),
    };
  }

  private tracePath(): string {
    if (!this.parent) return this.title;
    return `${this.parent.tracePath()} > ${this.title}`;
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
    const result = new Result({
      id: this.id,
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
    const hasUrl = false; // this.findUrl(this);
    const type = hasUrl ? LogType.UPDATE : LogType.ADD;

    logger.log(
      `${!options["no-color"] ? chalk.black("(") : "("}${
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
      }${!options["no-color"] ? chalk.black(")") : ")"} ${this.title}${
        this.nsfw
          ? ` ${!options["no-color"] ? chalk.black("(") : "("}${
              !options["no-color"] ? chalk.red("!") : "!"
            }${!options["no-color"] ? chalk.black(")") : ")"}`
          : ""
      }${chalk.black(":")} ${
        !options["no-color"] ? chalk.cyan(chalk.underline(this.url)) : this.url
      } ${
        !options["no-color"]
          ? (this.prob >= Result.Prob.LIKELY
              ? chalk.green
              : this.prob >= Result.Prob.MAYBE
              ? chalk.yellow
              : chalk.red)(roundDecimal(this.prob * 100, 3))
          : roundDecimal(this.prob * 100, 3)
      }${!options["no-color"] ? chalk.black("%") : "%"}`
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
        }${
          likely.firstName.gender !== undefined
            ? ` ${colored ? chalk.black("(") : "("}${
                (likely.firstName.gender as Gender) === Gender.MALE
                  ? colored
                    ? chalk.blue("♂")
                    : "Male"
                  : colored
                  ? chalk.red("♀")
                  : "Female"
              }${colored ? chalk.black(")") : ")"}`
            : ""
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
          }${
            website.nsfw
              ? ` ${colored ? chalk.black("(") : "("}${
                  colored ? chalk.red("!") : "!"
                }${colored ? chalk.black(")") : ")"}`
              : ""
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
              : colored
              ? `${chalk.black(" (")}${chalk.red("✘ Not Fetched")}${chalk.black(
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

  private getFirstName(firstName: string) {
    return this.root.firstNames.find((n) => n.value === firstName);
  }

  private getLastName(lastName: string) {
    return this.root.lastNames.find((n) => n.value === lastName);
  }

  private getCountry(location: Location) {
    return this.root.locations.find((l) => l.country === location.country);
  }

  private getCity(location: Location) {
    return this.root.locations.find((l) => l.city === location.city);
  }

  private getEmail(email: string) {
    return this.root.emails.find((e) => e.value === email);
  }

  private getPhone(phone: Phone) {
    return this.root.phones.find((p) => p.value === phone.value);
  }

  private getUrl(url: string) {
    return this.root.urls.find((r) => r.url === url);
  }

  private addUsername(username: string, prob: number) {
    username = username.trim().toLowerCase();
    prob *= usernameComplexity(username);

    const existing = this.usernames.find((u) => u.value === username);

    if (existing) {
      existing.prob = prob = Math.max(
        existing.prob,
        (prob + Prob.LIKELY) / 2,
        prob
      );
    } else {
      this.usernames.push({ value: username, prob, new: true });
    }
  }

  public addFirstName(firstName: string, prob: number) {
    firstName = firstName.trim().toLowerCase();
    if (this.firstName !== firstName) prob = Prob.NO;
    const existing = this.getFirstName(firstName);
    const gender = getGender(firstName);

    if (existing) {
      existing.prob = prob = (Math.max(existing.prob, prob) + Prob.SURE) / 2;
    }

    this.firstNames.push({ value: firstName, gender, prob, new: true });
    this.parent?.addFirstName(firstName, prob);
  }

  public addLastName(lastName: string, prob: number) {
    lastName = lastName.trim().toLowerCase();
    if (this.lastName !== lastName) prob = Prob.NO;
    const existing = this.getLastName(lastName);

    if (existing) {
      existing.prob = prob = (Math.max(existing.prob, prob) + Prob.SURE) / 2;
    }

    this.lastNames.push({ value: lastName, prob, new: true });
    this.parent?.addLastName(lastName, prob);
  }

  public addLocation(location: Location, prob: number) {
    const country = this.getCountry(location);
    const city = location.city ? this.getCity(location) : null;

    if (country) {
      country.prob = prob = (Math.max(country.prob, prob) + Prob.SURE) / 2;
    }

    if (city) {
      city.prob = prob = (Math.max(city.prob, prob) + Prob.SURE) / 2;
    }

    this.locations.push({ ...location, prob, new: true });
    this.parent?.addLocation(location, prob);
  }

  public async addEmail(email: string, prob: number) {
    email = email.trim().toLowerCase();
    const existing = this.getEmail(email);

    if (existing) {
      existing.prob = prob = (Math.max(existing.prob, prob) + Prob.SURE) / 2;
    } else {
      const verified = await verifyEmail(email);
      this.emails.push({ value: email, prob, verified, new: true });
    }

    this.parent?.addEmail(email, prob);
  }

  public addPhone(phone: Phone, prob: number) {
    phone.value = phone.value.trim().toLowerCase();
    phone.country = phone.country?.trim().toLowerCase();
    const existing = this.getPhone(phone);

    if (existing) {
      existing.prob = prob = (Math.max(existing.prob, prob) + Prob.SURE) / 2;
    }

    this.phones.push({ ...phone, prob, new: true });
    this.parent?.addPhone(phone, prob);
  }

  public addUrl(result: Result) {
    if (!allowed(result.id, result.type!)) return;

    const existing = this.getUrl(result.url!);
    result.username!.prob = (result.prob * this.prob + this.prob) / 2;

    if (existing) {
      result.username!.prob =
        (Math.max(existing.prob, result.prob) + Prob.SURE) / 2;

      if (result.fetched) existing.fetched = true;
    } else {
      this.urls.push(result);
    }

    this.addUsername(result.username!.value, result.prob);
    this.parent?.addUrl(result);
  }
}
