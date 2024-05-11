import Website from "../structures/Website";

export default Website.fromJSON("erome", {
  title: "Erome",
  nsfw: true,
  type: Website.Type.VIDEO,
  requestUrl: "https://erome.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{3,20}$/,
  },
});
