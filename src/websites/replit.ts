import Website from "../structures/Website";

export default Website.fromJSON("replit", {
  title: "Replit",
  type: Website.Type.DEVELOPMENT,
  requestUrl: "https://replit.com/@{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{3,20}$/,
  },
});
