export default Object.freeze([
  {
    title: "GitHub",
    id: "github",
    fetchFunction: "websites/github.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?github\.com\/(?<username>[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})/gi,
  },
  {
    title: "LinkedIn",
    id: "linkedin",
    fetchFunction: null,
    regex:
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/(?<username>[a-zA-Z0-9-_.]{3,100})/gi,
  },
  {
    title: "Instagram",
    id: "instagram",
    fetchFunction: "websites/instagram.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?<username>[a-zA-Z0-9_.]{1,30})/gi,
  },
  {
    title: "TikTok",
    id: "tiktok",
    fetchFunction: "websites/tiktok.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@(?<username>[a-zA-Z0-9_.]{2,24})/gi,
  },
  {
    title: "Personal Website",
    id: "personal",
    fetchFunction: "websites/personal.ts",
    regex: null,
  },
  {
    title: "Pornhub",
    id: "pornhub",
    fetchFunction: "websites/pornhub.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?pornhub\.com\/users\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{4,}[a-zA-Z0-9])/gi,
  },
  {
    name: "About.me",
    id: "aboutme",
    fetchFunction: "websites/aboutme.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?about\.me\/(?<username>[a-zA-Z][a-zA-Z0-9._-]{1,30}[a-zA-Z0-9])/gi,
  },
  {
    name: "AllMyLinks",
    id: "allmylinks",
    fetchFunction: "websites/allmylinks.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?allmylinks\.com\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}[a-zA-Z0-9])/gi,
  },
  {
    name: "CodePen",
    id: "codepen",
    fetchFunction: "websites/codepen.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?codepen\.io\/(?<username>[a-zA-Z0-9_-]{3,15})/gi,
  },
  {
    name: "Dribbble",
    id: "dribbble",
    fetchFunction: "websites/dribbble.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?dribbble\.com\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{2,19})/gi,
  },
  {
    name: "Reddit",
    id: "reddit",
    fetchFunction: "websites/reddit.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?reddit\.com\/user\/(?<username>[a-zA-Z0-9_-]{3,20})/gi,
  },
  {
    name: "Snapchat",
    id: "snapchat",
    fetchFunction: "websites/snapchat.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?snapchat\.com\/add\/(?<username>[a-zA-Z][a-zA-Z0-9]{2,14})/gi,
  },
  {
    name: "Twitch",
    id: "twitch",
    fetchFunction: "websites/twitch.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/(?<username>[a-zA-Z0-9_]{4,25})/gi,
  },
]);
