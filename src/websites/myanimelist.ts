import Website from "../structures/Website";

export default Website.fromJSON("myanimelist", {
  title: "MyAnimeList",
  requestUrl: "https://myanimelist.net/profile/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findUrls: true,
  urlSelector: ".user-profile-sns",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{3,20}$/,
  },
});
