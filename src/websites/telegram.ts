import Website from "../structures/Website";

export default Website.fromJSON("telegram", {
  title: "Telegram",
  type: Website.Type.SOCIAL,
  requestUrl: "https://api.instantusername.com/c/lottiefiles/{username}",
  responseUrl: "https://t.me/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{5,32}$/,
  },
});
