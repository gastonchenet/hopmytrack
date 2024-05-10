import Website from "../structures/Website";

export default Website.fromJSON("xhamster", {
  title: "Xhamster",
  requestUrl: "https://xhamster.com/users/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9._-]{4,}[a-zA-Z0-9]$/,
  },
});
