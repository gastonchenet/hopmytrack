import Website from "../structures/Website";

export default Website.fromJSON("vimeo", {
  title: "Vimeo",
  type: Website.Type.VIDEO,
  requestUrl: "https://vimeo.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^(?![_.-])[a-zA-Z0-9][a-zA-Z0-9_-]{1,28}[a-zA-Z0-9]$/,
  },
});
