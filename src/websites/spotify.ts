import Website from "../structures/Website";

export default Website.fromJSON("spotify", {
  title: "Spotify",
  requestUrl: "https://open.spotify.com/user/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,29}$/,
  },
});
