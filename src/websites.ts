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
  {
    name: "Twitter",
    id: "twitter",
    fetchFunction: "websites/twitter.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/(?<username>[a-zA-Z0-9_]{1,15})/gi,
  },
  {
    name: "Behance",
    id: "behance",
    fetchFunction: "websites/behance.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?behance\.net\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{2,19})/gi,
  },
  {
    name: "Codecademy",
    id: "codecademy",
    fetchFunction: "websites/codecademy.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?codecademy\.com\/(?<username>[a-zA-Z0-9_-]{1,256})/gi,
  },
  {
    name: "DailyMotion",
    id: "dailymotion",
    fetchFunction: "websites/dailymotion.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/(?<username>[a-zA-Z0-9_-]{3,30})/gi,
  },
  {
    name: "DeviantArt",
    id: "deviantart",
    fetchFunction: "websites/deviantart.ts",
    regex:
      /(?:https?:\/\/)?(?:(?:www|(?:[a-zA-Z0-9_-]+))\.)?deviantart\.com\/(?<username>[a-zA-Z0-9_-]+)/gi,
  },
  {
    name: "HackerRank",
    id: "hackerrank",
    fetchFunction: "websites/hackerrank.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?hackerrank\.com\/(?<username>[a-zA-Z0-9_]{2,30})/gi,
  },
  {
    name: "Facebook",
    id: "facebook",
    fetchFunction: null,
    regex:
      /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?<username>(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{5,50})/gi,
  },
  {
    name: "Pinterest",
    id: "pinterest",
    fetchFunction: null,
    regex:
      /(?:https?:\/\/)?(?:www\.)?pinterest\.com\/(?<username>[a-zA-Z][a-zA-Z0-9_]{2,29})/gi,
  },
  {
    name: "SoundCloud",
    id: "soundcloud",
    fetchFunction: "websites/soundcloud.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/(?<username>[a-zA-Z0-9_-]{3,40})/gi,
  },
  {
    name: "osu!",
    id: "osu",
    fetchFunction: "websites/osu.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?osu\.ppy\.sh\/users\/(?<username>[a-zA-Z0-9_-]{2,15})/gi,
  },
  {
    name: "MyAnimeList",
    id: "myanimelist",
    fetchFunction: "websites/myanimelist.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?myanimelist\.net\/profile\/(?<username>[a-zA-Z0-9_]{3,20})/gi,
  },
  {
    name: "Scratch",
    id: "scratch",
    fetchFunction: "websites/scratch.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?scratch\.mit\.edu\/users\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{2,19})/gi,
  },
  {
    name: "Spotfiy",
    id: "spotify",
    fetchFunction: "websites/spotify.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?open\.spotify\.com\/user\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{2,29})/gi,
  },
  {
    name: "Steam",
    id: "steam",
    fetchFunction: "websites/steam.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?steamcommunity\.com\/id\/(?<username>[a-zA-Z0-9_-]{3,32})/gi,
  },
  {
    name: "VirusTotal",
    id: "virustotal",
    fetchFunction: "websites/virustotal.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?virustotal\.com\/gui\/user\/(?<username>[a-zA-Z0-9_-]{3,32})/gi,
  },
  {
    name: "Wattpad",
    id: "wattpad",
    fetchFunction: "websites/wattpad.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?wattpad\.com\/user\/(?<username>(?![_-])[a-zA-Z0-9_-]{6,20}(?<![_-]))/gi,
  },
  {
    name: "XHamster",
    id: "xhamster",
    fetchFunction: "websites/xhamster.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?xhamster\.com\/users\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{4,}[a-zA-Z0-9])/gi,
  },
  {
    name: "XVideos",
    id: "xvideos",
    fetchFunction: "websites/xvideos.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?xvideos\.com\/profile\/(?<username>[a-zA-Z0-9_-]{3,30})/gi,
  },
  {
    name: "NPM",
    id: "npm",
    fetchFunction: "websites/npm.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?npmjs\.com\/~(?<username>(?!-)(?!.*--)[a-z0-9_-]{1,214}(?<!-))/gi,
  },
  {
    name: "Last.fm",
    id: "lastfm",
    fetchFunction: "websites/lastfm.ts",
    regex:
      /(?:https?:\/\/)?(?:www\.)?last\.fm\/user\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{1,14})/gi,
  },
]);
