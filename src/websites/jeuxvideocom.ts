import Website from "../structures/Website";

export default Website.fromJSON("jeuxvideocom", {
	title: "Jeuxvideo.com",
	type: Website.Type.GAMING,
	requestUrl: "https://www.jeuxvideo.com/profil/{username}?mode=infos",
	responseUrl: "https://www.jeuxvideo.com/profil/{username}",
	errorType: Website.ErrorType.STATUS_CODE,
	headers: Website.DEFAULT_HEADERS,
	requestInterval: 500,
	findLocations: true,
	locationSelector: ".display-line-lib",
	usernameOptions: {
		regex: /^[a-zA-Z0-9_-]{3,20}$/,
	},
});
