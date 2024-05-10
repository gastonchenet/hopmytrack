import Website from "../structures/Website";

export default Website.fromJSON("wattpad", {
  title: "Wattpad",
  requestUrl: "https://wattpad.com/api/v3/users/{username}",
  responseUrl: "https://wattpad.com/user/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findNames: true,
  findLocations: true,
  usernameOptions: {
    regex: /^(?![_-])[a-zA-Z0-9_-]{6,20}(?<![_-])$/,
  },
});
