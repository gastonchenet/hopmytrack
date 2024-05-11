import Website from "../structures/Website";

export default Website.fromJSON("archiveofourown", {
  title: "Archive of Our Own",
  type: Website.Type.BLOG,
  requestUrl: "https://archiveofourown.org/users/{username}/pseuds/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  usernameOptions: {
    regex: /^(?![_.-])[a-zA-Z0-9._-]{3,40}(?<![_.-])$/,
  },
});
