import Website from "../structures/Website";

export default Website.fromJSON("soundcloud", {
  title: "SoundCloud",
  type: Website.Type.MUSIC,
  requestUrl: "https://soundcloud.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findUrls: true,
  urlSelector: ".web-profiles",
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,24}$/,
  },
});
