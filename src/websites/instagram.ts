import Website from "../structures/Website";

export default Website.fromJSON({
	title: "Instagram",
	requestUrl: "https://picuki.com/profile/{username}",
	responseUrl: "https://instagram.com/{username}",
	errorType: Website.ErrorType.STATUS_CODE,
	headers: { "User-Agent": "PostmanRuntime/7.32.1" },
	requestInterval: 1500,
	findNames: true,
	findCountries: true,
	findEmails: true,
	nameSelector: ".profile-name",
	countrySelector: ".profile-description",
	emailSelector: ".profile-description",
	usernameOptions: {
		regex: /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9_.]{1,30}$/,
	},
});
