import Website from "../structures/Website";

export default Website.fromJSON("codecademy", {
  title: "Codecademy",
  type: Website.Type.PROFESSIONAL,
  requestUrl: "https://codecademy.com/profiles/{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: "UserNotFound",
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findNames: true,
  nameSelector: ".full-name-section",
  usernameOptions: {
    regex: /^[a-z0-9_-]{1,256}$/,
  },
});
