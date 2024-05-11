import Website from "../structures/Website";

export default Website.fromJSON("hackerrank", {
  title: "HackerRank",
  type: Website.Type.DEVELOPMENT,
  requestUrl: "https://hackerrank.com/{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: "Something went wrong",
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{2,30}$/,
  },
});
