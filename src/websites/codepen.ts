import Website from "../structures/Website";

export default Website.fromJSON("codepen", {
  title: "CodePen",
  type: Website.Type.DEVELOPMENT,
  requestUrl: "https://codepen.io/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 100,
  findNames: true,
  findLocations: true,
  findUrls: true,
  nameSelector: "#profile-name-header",
  locationSelector: "#profile-location",
  urlSelector: "#profile-links",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_-]{3,15}$/,
  },
});
