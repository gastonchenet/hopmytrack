import Website from "../structures/Website";

export default Website.fromJSON("slack", {
  title: "Slack",
  type: Website.Type.PROFESSIONAL,
  requestUrl: "https://{username}.slack.com/",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-z0-9][a-z0-9._]{1,19}[a-z0-9]$/,
  },
});
