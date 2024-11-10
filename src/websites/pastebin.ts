import Website from "../structures/Website";

export default Website.fromJSON("pastebin", {
	title: "Pastebin",
	type: Website.Type.DEVELOPMENT,
	requestUrl: "https://pastebin.com/u/{username}",
	errorType: Website.ErrorType.RESPONSE_BODY,
	errorBody: "Not Found (#404)",
	headers: Website.DEFAULT_HEADERS,
	requestInterval: 500,
	usernameOptions: {
		regex: /^[a-zA-Z0-9]{1,20}$/,
	},
});
