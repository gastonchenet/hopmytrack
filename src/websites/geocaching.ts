import Website from "../structures/Website";

export default Website.fromJSON("geocaching", {
	title: "Geocaching",
	type: Website.Type.DEVELOPMENT,
	requestUrl: "https://geocaching.com/p/default.aspx?u={username}",
	errorType: Website.ErrorType.STATUS_CODE,
	headers: Website.DEFAULT_HEADERS,
	requestInterval: 250,
	usernameOptions: {
		regex: /^[a-zA-Z0-9_-]{3,20}$/,
	},
});
