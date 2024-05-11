import Website from "../structures/Website";

export default Website.fromJSON("xboxgamertag", {
  title: "Xbox Gamertag",
  type: Website.Type.GAMING,
  requestUrl: "https://xboxgamertag.com/search/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9]{1,15}$/,
  },
});
