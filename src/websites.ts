export default Object.freeze([
  {
    title: "GitHub",
    fetchFunction: "websites/github.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?github\.com\/(?<username>[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})/gi,
  },
  {
    title: "LinkedIn",
    fetchFunction: null,
    regex:
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/(?<username>[a-zA-Z0-9-_.]{3,100})/gi,
  },
  {
    title: "Instagram",
    fetchFunction: "websites/instagram.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?<username>[a-zA-Z0-9_.]{1,30})/gi,
  },
  {
    title: "TikTok",
    fetchFunction: "websites/tiktok.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@(?<username>[a-zA-Z0-9_.]{2,24})/gi,
  },
  {
    title: "Personal Website",
    fetchFunction: "websites/personal.ts",
    regex: null,
  },
  {
    title: "Pornhub",
    fetchFunction: "websites/pornhub.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?pornhub\.com\/users\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{4,}[a-zA-Z0-9])/gi,
  },
]);
