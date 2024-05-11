import Website from "../structures/Website";

export default Website.fromJSON("gitlab", {
  title: "GitLab",
  type: Website.Type.DEVELOPMENT,
  requestUrl: "https://gitlab.com/{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 1000,
  findNames: true,
  nameSelector: ".gl-breadcrumb-iteme",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_\-\.]{2,255}$/,
  },
});
