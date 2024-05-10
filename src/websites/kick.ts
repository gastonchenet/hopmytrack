import Website from "../structures/Website";

export default Website.fromJSON("kick", {
  title: "Kick",
  requestUrl: "https://kick.com/api/v2/channels/{username}",
  responseUrl: "https://kick.com/{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: "Not Found",
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findUrls: true,
  urlSelector: ".flex.flex-col.space-y-3",
  usernameOptions: {
    regex: /^(?![_.-])[a-zA-Z0-9_-]{3,30}(?<![_-])$/,
  },
});
