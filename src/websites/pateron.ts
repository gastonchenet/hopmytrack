import Website from "../structures/Website";

export default Website.fromJSON("pateron", {
	title: "Pateron",
	type: Website.Type.PROFESSIONAL,
	requestUrl: "https://patreon.com/{username}",
	errorType: Website.ErrorType.STATUS_CODE,
	headers: Website.DEFAULT_HEADERS,
	requestInterval: 500,
	usernameOptions: {
		regex: /^[a-zA-Z0-9_-]{3,20}$/,
	},
});
