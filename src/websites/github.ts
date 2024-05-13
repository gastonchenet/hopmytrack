import Website from "../structures/Website";

export default Website.fromJSON("github", {
  title: "GitHub",
  type: Website.Type.DEVELOPMENT,
  requestUrl: "https://github.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  disableProxy: true,
  requestInterval: 100,
  findNames: true,
  findLocations: true,
  findUrls: true,
  findEmails: true,
  findPhones: true,
  nameSelector: ".vcard-names",
  locationSelector: "*[itemprop='homeLocation']",
  urlSelector: ".vcard-details *[itemprop='url'], .Layout-main",
  usernameOptions: {
    regex: /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
  },
});
