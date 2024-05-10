import Website from "../structures/Website";

export default Website.fromJSON("behance", {
  title: "Behance",
  requestUrl: "https://behance.net/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_-]{3,20}$/,
  },
});
