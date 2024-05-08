import Website from "../structures/Website";

export default Website.fromJSON("dribbble", {
  title: "Dribbble",
  requestUrl: "https://dribbble.com/{username}/about",
  responseUrl: "https://dribbble.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findNames: true,
  findLocations: true,
  findUrls: true,
  nameSelector: ".masthead-profile-name",
  locationSelector: ".masthead-profile-locality",
  urlSelector: ".profile-social-section",
  usernameOptions: {
    regex: /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/g,
  },
});
