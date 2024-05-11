import Website from "../structures/Website";

export default Website.fromJSON("fiverr", {
  title: "Fiverr",
  type: Website.Type.PROFESSIONAL,
  requestUrl: "https://fiverr.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findNames: true,
  findLocations: true,
  findEmails: true,
  nameSelector: ".m-b-24.QAl9kAF",
  locationSelector: ".d1hltpk._1554sdp1gt._1554sdp1ev._1554sdp6._1554sdp2",
  emailSelector: ".m-b-24.QAl9kAF",
  usernameOptions: {
    regex: /^(?![_.-])[a-zA-Z0-9][a-zA-Z0-9._-]{2,24}[a-zA-Z0-9]$/,
  },
});
