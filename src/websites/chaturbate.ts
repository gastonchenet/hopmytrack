import Website from "../structures/Website";

export default Website.fromJSON("chaturbate", {
	title: "Chaturbate",
	nsfw: true,
	type: Website.Type.VIDEO,
	requestUrl: "https://chaturbate.com/{username}",
	errorType: Website.ErrorType.STATUS_CODE,
	headers: Website.DEFAULT_HEADERS,
	requestInterval: 500,
	usernameOptions: {
		regex: /^[a-zA-Z0-9_-]{3,32}$/,
	},
});
