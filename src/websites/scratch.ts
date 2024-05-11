import Website from "../structures/Website";

export default Website.fromJSON("scratch", {
  title: "Scratch",
  type: Website.Type.DEVELOPMENT,
  requestUrl: "https://scratch.mit.edu/users/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findLocations: true,
  locationSelector: ".location",
  usernameOptions: {
    regex: /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/,
  },
});
