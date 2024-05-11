import Website from "../structures/Website";

export default Website.fromJSON("youtube", {
  title: "YouTube",
  type: Website.Type.VIDEO,
  requestUrl: "https://api.instantusername.com/c/youtube/{username}",
  responseUrl: "https://youtube.com/@{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: '"available":true',
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^(?![_.-])[a-zA-Z0-9][a-zA-Z0-9._-]{1,48}[a-zA-Z0-9]$/,
  },
});
