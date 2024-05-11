import Website from "../structures/Website";

export default Website.fromJSON("flickr", {
  title: "Flickr",
  type: Website.Type.ART,
  requestUrl: "https://www.flickr.com/people/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findLocations: true,
  locationSelector: ".bio-infos-container",
  usernameOptions: {
    regex: /^(?![_.-])[a-zA-Z0-9._-]{3,30}(?<![_-])$/,
  },
});
