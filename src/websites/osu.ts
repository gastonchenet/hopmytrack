import Website from "../structures/Website";

export default Website.fromJSON("osu", {
  title: "osu!",
  type: Website.Type.GAMING,
  requestUrl: "https://osu.ppy.sh/users/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findLocations: true,
  findUrls: true,
  locationSelector: ".profile-info__flag",
  urlSelector: ".profile-links",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{2,15}$/,
  },
});
