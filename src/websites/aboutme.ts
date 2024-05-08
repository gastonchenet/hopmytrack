import Website from "../structures/Website";

export default Website.fromJSON("aboutme", {
  title: "About.me",
  requestUrl: "https://about.me/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 100,
  findNames: true,
  findLocations: true,
  findEmails: true,
  findPhones: true,
  findUrls: true,
  nameSelector: ".name",
  locationSelector: ".bio, .location",
  emailSelector: ".bio",
  phoneSelector: ".bio",
  urlSelector: ".social-links, .bio",
  usernameOptions: {
    regex: /^[a-zA-Z][a-zA-Z0-9._-]{1,30}[a-zA-Z0-9]$/,
  },
});
