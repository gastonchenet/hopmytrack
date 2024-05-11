import Website from "../structures/Website";

export default Website.fromJSON("ebay", {
  title: "eBay",
  type: Website.Type.PROFESSIONAL,
  requestUrl: "https://ebay.com/usr/{username}?_tab=about",
  responseUrl: "https://ebay.com/usr/{username}",
  errorType: Website.ErrorType.RESPONSE_BODY,
  errorBody: ["not found", "Security Measure"],
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findNames: true,
  findLocations: true,
  findPhones: true,
  nameSelector: ".str-business-details__seller-info",
  locationSelector: ".str-about-description__seller-info",
  phoneSelector: ".str-business-details__seller-info",
  usernameOptions: {
    regex: /^(?![_.-])[a-zA-Z0-9._-]{6,64}(?<![_-])$/,
  },
});
