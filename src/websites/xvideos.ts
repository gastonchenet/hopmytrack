import Website from "../structures/Website";

export default Website.fromJSON("xvideos", {
  title: "Xvideos",
  requestUrl: "https://xvideos.com/profiles/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_-]{3,30}$/,
  },
});
