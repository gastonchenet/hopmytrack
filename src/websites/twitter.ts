import Website from "../structures/Website";

export default Website.fromJSON("twitter", {
  title: "Twitter",
  requestUrl: "https://nitter.privacydev.net/{username}",
  responseUrl: "https://twitter.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findNames: true,
  findLocations: true,
  findUrls: true,
  nameSelector: ".profile-card-fullname",
  locationSelector: ".profile-location",
  urlSelector: ".profile-website",
  usernameOptions: {
    regex: /^[a-zA-Z0-9]{1,15}$/i,
  },
});
