import Website from "../structures/Website";

export default Website.fromJSON("twitch", {
  title: "Twitch",
  requestUrl: "https://m.twitch.tv/{username}",
  responseUrl: "https://twitch.tv/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findUrls: true,
  urlSelector: ".tw-link[role='link']",
  usernameOptions: {
    regex: /^[a-zA-Z][a-zA-Z0-9_]{3,24}$/,
  },
});
