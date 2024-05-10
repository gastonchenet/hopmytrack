import Website from "../structures/Website";

export default Website.fromJSON("itchio", {
  title: "itch.io",
  requestUrl: "https://{username}.itch.io/",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9@_-]$/,
  },
});
