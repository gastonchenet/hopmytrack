import Website from "../structures/Website";

export default Website.fromJSON("snapchat", {
  title: "Snapchat",
  type: Website.Type.SOCIAL,
  requestUrl: "https://snapchat.com/add/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z][a-zA-Z0-9]{2,14}$/i,
  },
});
