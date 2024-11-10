import Website from "../structures/Website";

export default Website.fromJSON("roblox", {
	title: "Roblox",
	type: Website.Type.GAMING,
	requestUrl: "https://www.roblox.com/user.aspx?username={username}",
	errorType: Website.ErrorType.RESPONSE_BODY,
	errorBody: "Page cannot be found or no longer exists",
	headers: Website.DEFAULT_HEADERS,
	requestInterval: 500,
	usernameOptions: {
		regex: /^[a-zA-Z0-9_-]{3,20}$/,
	},
});
