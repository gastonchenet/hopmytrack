import Website from "../structures/Website";

export default Website.fromJSON("carrd", {
  title: "Carrd",
  type: Website.Type.PERSONAL,
  requestUrl: "https://{username}.carrd.co",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findNames: true,
  findLocations: true,
  findEmails: true,
  findPhones: true,
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{3,20}$/,
  },
});
