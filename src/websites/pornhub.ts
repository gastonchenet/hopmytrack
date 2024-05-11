import Website from "../structures/Website";

export default Website.fromJSON("pornhub", {
  title: "Pornhub",
  type: Website.Type.VIDEO,
  nsfw: true,
  requestUrl: "https://pornhub.com/users/{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  headers: Website.DEFAULT_HEADERS,
  errorBody: "Loading...",
  requestInterval: 1000,
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9._-]{4,64}[a-zA-Z0-9]$/,
  },
});
