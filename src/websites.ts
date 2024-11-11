import type Website from "./structures/Website";

export default Object.freeze([
	{
		title: "GitHub",
		id: "github",
		website: require("./websites/github.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?github\.com\/(?<username>[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})/gi,
	},
	{
		title: "LinkedIn",
		id: "linkedin",
		website: null,
		regex:
			/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/(?<username>[a-zA-Z0-9-_.]{3,100})/gi,
	},
	{
		title: "Instagram",
		id: "instagram",
		website: require("./websites/instagram.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?<username>[a-zA-Z0-9_.]{1,30})/gi,
	},
	{
		title: "TikTok",
		id: "tiktok",
		website: require("./websites/tiktok.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@(?<username>[a-zA-Z0-9_.]{2,24})/gi,
	},
	{
		title: "Personal Website",
		id: "personal",
		website: require("./websites/personal.ts").default as Website,
		regex: null,
	},
	{
		title: "Pornhub",
		id: "pornhub",
		website: require("./websites/pornhub.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?pornhub\.com\/users\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{4,}[a-zA-Z0-9])/gi,
	},
	{
		title: "About.me",
		id: "aboutme",
		website: require("./websites/aboutme.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?about\.me\/(?<username>[a-zA-Z][a-zA-Z0-9._-]{1,30}[a-zA-Z0-9])/gi,
	},
	{
		title: "AllMyLinks",
		id: "allmylinks",
		website: require("./websites/allmylinks.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?allmylinks\.com\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}[a-zA-Z0-9])/gi,
	},
	{
		title: "CodePen",
		id: "codepen",
		website: require("./websites/codepen.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?codepen\.io\/(?<username>[a-zA-Z0-9_-]{3,15})/gi,
	},
	{
		title: "Dribbble",
		id: "dribbble",
		website: require("./websites/dribbble.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?dribbble\.com\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{2,19})/gi,
	},
	{
		title: "Reddit",
		id: "reddit",
		website: require("./websites/reddit.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?reddit\.com\/user\/(?<username>[a-zA-Z0-9_-]{3,20})/gi,
	},
	{
		title: "Snapchat",
		id: "snapchat",
		website: require("./websites/snapchat.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?snapchat\.com\/add\/(?<username>[a-zA-Z][a-zA-Z0-9]{2,14})/gi,
	},
	{
		title: "Twitch",
		id: "twitch",
		website: null,
		regex:
			/(?:https?:\/\/)?(?:www\.)?twitch\.tv\/(?<username>[a-zA-Z0-9_]{4,25})/gi,
	},
	{
		title: "Twitter",
		id: "twitter",
		website: require("./websites/twitter.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/(?<username>[a-zA-Z0-9_]{1,15})/gi,
	},
	{
		title: "Behance",
		id: "behance",
		website: require("./websites/behance.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?behance\.net\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{2,19})/gi,
	},
	{
		title: "Codecademy",
		id: "codecademy",
		website: require("./websites/codecademy.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?codecademy\.com\/(?<username>[a-zA-Z0-9_-]{1,256})/gi,
	},
	{
		title: "DailyMotion",
		id: "dailymotion",
		website: null,
		regex:
			/(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/(?<username>[a-zA-Z0-9_-]{3,30})/gi,
	},
	{
		title: "DeviantArt",
		id: "deviantart",
		website: require("./websites/deviantart.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:(?:www|(?:[a-zA-Z0-9_-]+))\.)?deviantart\.com\/(?<username>[a-zA-Z0-9_-]+)/gi,
	},
	{
		title: "HackerRank",
		id: "hackerrank",
		website: require("./websites/hackerrank.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?hackerrank\.com\/(?<username>[a-zA-Z0-9_]{2,30})/gi,
	},
	{
		title: "Facebook",
		id: "facebook",
		website: null,
		regex:
			/(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?<username>(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{5,50})/gi,
	},
	{
		title: "Pinterest",
		id: "pinterest",
		website: null,
		regex:
			/(?:https?:\/\/)?(?:www\.)?pinterest\.com\/(?<username>[a-zA-Z][a-zA-Z0-9_]{2,29})/gi,
	},
	{
		title: "SoundCloud",
		id: "soundcloud",
		website: require("./websites/soundcloud.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/(?<username>[a-zA-Z0-9_-]{3,40})/gi,
	},
	{
		title: "osu!",
		id: "osu",
		website: require("./websites/osu.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?osu\.ppy\.sh\/users\/(?<username>[a-zA-Z0-9_-]{2,15})/gi,
	},
	{
		title: "MyAnimeList",
		id: "myanimelist",
		website: require("./websites/myanimelist.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?myanimelist\.net\/profile\/(?<username>[a-zA-Z0-9_]{3,20})/gi,
	},
	{
		title: "Scratch",
		id: "scratch",
		website: require("./websites/scratch.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?scratch\.mit\.edu\/users\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{2,19})/gi,
	},
	{
		title: "Spotfiy",
		id: "spotify",
		website: require("./websites/spotify.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?open\.spotify\.com\/user\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{2,29})/gi,
	},
	{
		title: "Steam",
		id: "steam",
		website: null,
		regex:
			/(?:https?:\/\/)?(?:www\.)?steamcommunity\.com\/id\/(?<username>[a-zA-Z0-9_-]{3,32})/gi,
	},
	{
		title: "VirusTotal",
		id: "virustotal",
		website: require("./websites/virustotal.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?virustotal\.com\/gui\/user\/(?<username>[a-zA-Z0-9_-]{3,32})/gi,
	},
	{
		title: "Wattpad",
		id: "wattpad",
		website: require("./websites/wattpad.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?wattpad\.com\/user\/(?<username>(?![_-])[a-zA-Z0-9_-]{6,20}(?<![_-]))/gi,
	},
	{
		title: "XHamster",
		id: "xhamster",
		website: require("./websites/xhamster.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?xhamster\.com\/users\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{4,}[a-zA-Z0-9])/gi,
	},
	{
		title: "XVideos",
		id: "xvideos",
		website: require("./websites/xvideos.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?xvideos\.com\/profile\/(?<username>[a-zA-Z0-9_-]{3,30})/gi,
	},
	{
		title: "NPM",
		id: "npm",
		website: require("./websites/npm.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?npmjs\.com\/~(?<username>(?!-)(?!.*--)[a-z0-9_-]{1,214}(?<!-))/gi,
	},
	{
		title: "Last.fm",
		id: "lastfm",
		website: require("./websites/lastfm.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?last\.fm\/user\/(?<username>[a-zA-Z0-9][a-zA-Z0-9._-]{1,14})/gi,
	},
	{
		title: "BodySpace",
		id: "bodyspace",
		website: require("./websites/bodyspace.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?bodyspace\.bodybuilding\.com\/(?<username>(?![_.-])[a-zA-Z0-9_-]{3,30}(?<![_-]))/gi,
	},
	{
		title: "Flickr",
		id: "flickr",
		website: require("./websites/flickr.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?flickr\.com\/people\/(?<username>[a-zA-Z0-9._-]{3,30})/gi,
	},
	{
		title: "Imgur",
		id: "imgur",
		website: require("./websites/imgur.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?imgur\.com\/user\/(?<username>[a-zA-Z][a-zA-Z0-9_]{2,29})/gi,
	},
	{
		title: "Itch.io",
		id: "itchio",
		website: require("./websites/itchio.ts").default as Website,
		regex: /(?:https?:\/\/)?(?:www\.)?itch\.io\/(?<username>[a-zA-Z0-9@_-]+)/gi,
	},
	{
		title: "Kick",
		id: "kick",
		website: require("./websites/kick.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?kick\.com\/(?<username>(?![_.-])[a-zA-Z0-9_-]{3,30}(?<![_-]))/gi,
	},
	{
		title: "eBay",
		id: "ebay",
		website: require("./websites/ebay.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?ebay\.com\/usr\/(?<username>(?![_.-])[a-zA-Z0-9._-]{6,64}(?<![_-]))/gi,
	},
	{
		title: "MCName",
		id: "mcname",
		website: require("./websites/mcname.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?mcname\.info\/en\/search\?q=(?<username>[a-zA-Z0-9][a-zA-Z0-9_]{1,14}[a-zA-Z0-9])/gi,
	},
	{
		title: "YouTube",
		id: "youtube",
		website: require("./websites/youtube.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:(?:c\/|channel\/|user\/)|)(?<username>[a-zA-Z0-9_-]{1,256})/gi,
	},
	{
		title: "Vimeo",
		id: "vimeo",
		website: require("./websites/vimeo.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?<username>[a-zA-Z0-9][a-zA-Z0-9_-]{1,28}[a-zA-Z0-9])/gi,
	},
	{
		title: "Slack",
		id: "slack",
		website: require("./websites/slack.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?slack\.com\/(?<username>[a-z0-9][a-z0-9._]{1,19}[a-z0-9])/gi,
	},
	{
		title: "GitLab",
		id: "gitlab",
		website: require("./websites/gitlab.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?gitlab\.com\/(?<username>[a-zA-Z0-9_\-\.]{2,255})/gi,
	},
	{
		title: "Product Hunt",
		id: "producthunt",
		website: require("./websites/producthunt.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?producthunt\.com\/(?<username>[a-zA-Z0-9_]{1,20})/gi,
	},
	{
		title: "Trello",
		id: "trello",
		website: require("./websites/trello.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?trello\.com\/(?<username>[a-zA-Z0-9_\-]{1,100})/gi,
	},
	{
		title: "Xbox Gamertag",
		id: "xboxgamertag",
		website: require("./websites/xboxgamertag.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?xboxgamertag\.com\/search\/(?<username>[a-zA-Z0-9]{1,15})/gi,
	},
	{
		title: "Lichess",
		id: "lichess",
		website: require("./websites/lichess.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?lichess\.org\/@\/(?<username>[a-zA-Z0-9][a-zA-Z0-9_-]{1,19})/gi,
	},
	{
		title: "Chess.com",
		id: "chesscom",
		website: require("./websites/chesscom.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?chess\.com\/member\/(?<username>[a-zA-Z0-9][a-zA-Z0-9_]{2,19})/gi,
	},
	{
		title: "Tetr.io",
		id: "tetrio",
		website: require("./websites/tetrio.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?(?:ch\.)?tetr\.io\/u\/(?<username>[a-zA-Z0-9_]{3,15})/gi,
	},
	{
		title: "Replit",
		id: "replit",
		website: require("./websites/replit.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?replit\.com\/@(?<username>[a-zA-Z0-9_]{3,20})/gi,
	},
	{
		title: "Erome",
		id: "erome",
		website: require("./websites/erome.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?erome\.com\/(?<username>[a-zA-Z0-9_]{3,20})/gi,
	},
	{
		title: "Telegram",
		id: "telegram",
		website: null,
		regex: /(?:https?:\/\/)?(?:www\.)?t\.me\/(?<username>[a-zA-Z0-9_]{5,32})/gi,
	},
	{
		title: "Pateron",
		id: "pateron",
		website: require("./websites/pateron.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?patreon\.com\/(?<username>[a-zA-Z0-9_-]{3,20})/gi,
	},
	{
		title: "Pastebin",
		id: "pastebin",
		website: require("./websites/pastebin.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?pastebin\.com\/u\/(?<username>[a-zA-Z0-9]{1,20})/gi,
	},
	{
		title: "Roblox",
		id: "roblox",
		website: require("./websites/roblox.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?roblox\.com\/users\/(?<username>[a-zA-Z0-9_-]{3,20})/gi,
	},
	{
		title: "Chaturbate",
		id: "chaturbate",
		website: require("./websites/chaturbate.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?chaturbate\.com\/(?<username>[a-zA-Z0-9_-]{3,32})/gi,
	},
	{
		title: "freeCodeCamp",
		id: "freecodecamp",
		website: require("./websites/freecodecamp.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?freecodecamp\.org\/(?<username>[a-zA-Z0-9_-]{3,20})/gi,
	},
	{
		title: "Geocaching",
		id: "geocaching",
		website: require("./websites/geocaching.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?geocaching\.com\/p\/default\.aspx\?u=(?<username>[a-zA-Z0-9_-]{3,20})/gi,
	},
	{
		title: "Jeuvideo.com",
		id: "jeuxvideocom",
		website: require("./websites/jeuxvideocom.ts").default as Website,
		regex:
			/(?:https?:\/\/)?(?:www\.)?jeuxvideo\.com\/profil\/(?<username>[a-zA-Z0-9_-]{3,20})(?:\?mode=infos)?/gi,
	},
]).toSorted((a, b) => a.id.localeCompare(b.id));
