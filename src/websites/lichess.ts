import Website from "../structures/Website";

export default Website.fromJSON("lichess", {
  title: "Lichess",
  type: Website.Type.GAMING,
  requestUrl: "https://lichess.org/@/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,19}$/,
  },
});
