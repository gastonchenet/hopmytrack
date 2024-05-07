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
]);
