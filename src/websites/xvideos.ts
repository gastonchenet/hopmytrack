import Website from "../structures/Website";

export default Website.fromJSON("xvideos", {
  title: "Xvideos",
  type: Website.Type.VIDEO,
  nsfw: true,
  requestUrl: "https://xvideos.com/profiles/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_-]{3,30}$/,
  },
});
