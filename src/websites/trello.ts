import Website from "../structures/Website";

export default Website.fromJSON("trello", {
  title: "Trello",
  type: Website.Type.PROFESSIONAL,
  requestUrl: "https://api.instantusername.com/c/trello/{username}",
  responseUrl: "https://trello.com/@{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: '"available":true',
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_\-]{1,100}$/,
  },
});
