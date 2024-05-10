import Website from "../structures/Website";

export default Website.fromJSON("dailymotion", {
  title: "Dailymotion",
  requestUrl: "https://dailymotion.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_-]{3,30}$/,
  },
});
