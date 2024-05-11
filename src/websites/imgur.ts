import Website from "../structures/Website";

export default Website.fromJSON("imgur", {
  title: "Imgur",
  type: Website.Type.ART,
  requestUrl:
    "https://api.imgur.com/account/v1/accounts/{username}?client_id=546c25a59c58ad7",
  responseUrl: "https://imgur.com/user/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/,
  },
});
