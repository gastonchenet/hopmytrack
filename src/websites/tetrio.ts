import Website from "../structures/Website";

export default Website.fromJSON("tetrio", {
  title: "Tetr.io",
  type: Website.Type.GAMING,
  requestUrl: "https://ch.tetr.io/api/users/{username}",
  responseUrl: "https://ch.tetr.io/u/{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: '"success":false',
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findLocations: true,
  locationSelector: "#flag_crumb",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{3,15}$/,
  },
});
