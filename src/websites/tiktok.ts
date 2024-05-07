import Website from "../structures/Website";

export default Website.fromJSON({
  title: "TikTok",
  requestUrl: "https://tikleap.com/profile/{username}",
  responseUrl: "https://tiktok.com/@{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: { "User-Agent": "PostmanRuntime/7.32.1" },
  requestInterval: 1500,
  findNames: true,
  findLocations: true,
  nameSelector: ".profile-info-name",
  locationSelector: ".profile-info-country-wrapper",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_.]{2,24}$/,
  },
});
