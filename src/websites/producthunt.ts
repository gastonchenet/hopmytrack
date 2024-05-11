import Website from "../structures/Website";

export default Website.fromJSON("producthunt", {
  title: "Product Hunt",
  type: Website.Type.BLOG,
  requestUrl: "https://producthunt.com/@{username}",
  errorType: Website.ErrorType.STATUS_CODE,
  headers: Website.DEFAULT_HEADERS,
  requestInterval: 500,
  findNames: true,
  findUrls: true,
  nameSelector: ".text-24.font-semibold.text-dark-gray.mb-1",
  urlSelector: ".styles_links__VhmRM",
  usernameOptions: {
    regex: /^[a-zA-Z0-9_]{1,20}$/,
  },
});
