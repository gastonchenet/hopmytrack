import Website from "../structures/Website";

export default Website.fromJSON("freecodecamp", {
	title: "freeCodeCamp",
	type: Website.Type.DEVELOPMENT,
	requestUrl:
		"https://api.freecodecamp.org/api/users/get-public-profile?username={username}",
	responseUrl: "https://freecodecamp.org/{username}",
	errorType: Website.ErrorType.STATUS_CODE,
	headers: Website.DEFAULT_HEADERS,
	requestInterval: 250,
	findNames: true,
	findLocations: true,
	findUrls: true,
	usernameOptions: {
		regex: /^[a-zA-Z0-9_-]{3,20}$/,
	},
});
