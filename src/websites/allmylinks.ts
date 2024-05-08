import Website from "../structures/Website";

export default Website.fromJSON("allmylinks", {
  title: "AllMyLinks",
  requestUrl: "https://allmylinks.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 100,
  findNames: true,
  findUrls: true,
  nameSelector: ".profile-username",
  urlSelector: "#link-list",
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}[a-zA-Z0-9]$/,
  },
});
