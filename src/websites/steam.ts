import Website from "../structures/Website";

export default Website.fromJSON("steam", {
  title: "Steam",
  requestUrl: "https://steamcommunity.com/id/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findNames: true,
  findLocations: true,
  findUrls: true,
  nameSelector: ".header_real_name.ellipsis, .persona_name",
  locationSelector: ".header_real_name.ellipsis",
  urlSelector: ".profile_summary.noexpand",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_-]{3,32}$/,
  },
});
