import Website from "../structures/Website";

export default Website.fromJSON("bodyspace", {
  title: "BodySpace",
  requestUrl: "https://bodyspace.bodybuilding.com/{username}",
  errorType: Website.ErrorType.RESPONSE_URL,
  headers: Website.DEFAULT_HEADERS,
  errorUrl: "https://bodyspace.bodybuilding.com/",
  requestInterval: 500,
  findNames: true,
  nameSelector: ".infoSummary",
  usernameOptions: {
    regex: /^(?![_.-])[a-zA-Z0-9_-]{3,30}(?<![_-])$/,
  },
});
