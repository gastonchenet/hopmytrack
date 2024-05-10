import Website from "../structures/Website";

export default Website.fromJSON("deviantart", {
  title: "DeviantArt",
  requestUrl: "https://{username}.deviantart.com/about",
  responseUrl: "https://{username}.deviantart.com",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findUrls: true,
  urlSelector: ".surface.surface-secondary",
  usernameOptions: {
    regex: /^[a-zA-Z][a-zA-Z0-9_-]*$/,
  },
});
