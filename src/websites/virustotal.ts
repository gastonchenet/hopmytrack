import Website from "../structures/Website";

export default Website.fromJSON("virustotal", {
  title: "VirusTotal",
  type: Website.Type.BLOG,
  requestUrl: "https://virustotal.com/ui/users/{username}/avatar",
  responseUrl: "https://virustotal.com/gui/user/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  usernameOptions: {
    regex: /^(?![-_.])[a-zA-Z0-9-_.]{4,30}(?<![-_.])$/,
  },
});
