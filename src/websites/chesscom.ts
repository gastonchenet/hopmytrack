import Website from "../structures/Website";

export default Website.fromJSON("chesscom", {
  title: "Chess.com",
  type: Website.Type.GAMING,
  requestUrl: "https://chess.com/member/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findLocations: true,
  locationSelector: ".user-country-flag, .profile-card-location",
  usernameOptions: {
    regex: /^[a-zA-Z0-9][a-zA-Z0-9_]{2,19}$/,
  },
});
