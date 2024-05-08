import Website from "../structures/Website";

export default Website.fromJSON("reddit", {
  title: "Reddit",
  requestUrl: "https://reddit.com/user/{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: [
    "Sorry, nobody on Reddit goes by that name.",
    "Oops, something went wrong",
    "Error: Choose failed Missing field",
  ],
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1500,
  findUrls: true,
  urlSelector: "*[noun='social_link']",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_-]{3,20}$/,
  },
});
