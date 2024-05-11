import Website from "../structures/Website";

export default Website.fromJSON("mcname", {
  title: "MCName",
  type: Website.Type.GAMING,
  requestUrl: "https://mcname.info/en/search?q={username}",
  responseUrl: "https://mcname.info/en/search?q={username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: "Currently available",
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/,
  },
});
