import Website from "../structures/Website";

export default Website.fromJSON("lastfm", {
  title: "Last.fm",
  type: Website.Type.MUSIC,
  requestUrl: "https://last.fm/user/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,14}$/,
  },
});
