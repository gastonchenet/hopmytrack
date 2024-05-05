import Website from "../structures/Website";

export default Website.fromJSON({
  title: "GitHub",
  requestUrl: "https://github.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 100,
  findNames: true,
  findCountries: true,
  findUrls: true,
  findEmails: true,
  nameSelector: ".vcard-names",
  countrySelector: "*[itemprop='homeLocation']",
  urlSelector: ".vcard-details *[itemprop='url'], .Layout-main",
  usernameOptions: {
    regex: /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
  },
});
