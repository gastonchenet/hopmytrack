You can easily add a website to fetch to the tool by following these steps

## Creating the website analyzer file

> Add a file : [/src/websites/<WEBSITE_ID>.ts](https://github.com/gastonchenet/hopmytrack/tree/main/src/websites)

```typescript
import Website from "../structures/Website";

// Use this if you want to analyse a website using the easy way
export default Website.fromJSON("websiteid", {
	// The Website ID following this pattern '^[a-z]+$' and matching the file name
	title: "WebsiteDotCom", // The website title
	type: Website.Type.PERSONAL, // The type of website that you want to add (SOCIAL, PROFESSIONAL, GAMING, VIDEO, MUSIC, ART, BLOG, PERSONAL, DEVELOPMENT)
	headers: Website.DEFAULT_HEADERS, // Request headers
	requestInterval: 100, // The time (in ms) between each request to avoid 429 error code (Too Many Requests)

	errorType: Website.ErrorType.STATUS_CODE, // The error that will be returned if the searched username is unavailable (STATUS_CODE, RESPONSE_BODY, RESPONSE_URL)
	errorBody: "this username is unavailable", // (Only if { errorType: STATUS_CODE }) A string specificly present in the returned HTML code if the username is unavailable (can also be a 'string[]')
	errorUrl: "https://api.website.com/profileError", // (Only if { errorType: RESPONSE_URL }) The response URL returned if the username is unavailable

	requestUrl: "https://api.website.com/profile_username?={username}", // The request URL, use '{username}' as the placeholder for the username
	responseUrl: "https://website.com/{username}", // [OPTIONAL] How the response URL will be displayed as a result, use '{username}' as the placeholder for the username

	nsfw: false, // [OPTIONAL] If the website is NSFW (Not Safe For Work) or not
	disableProxy: false, // [OPTIONAL] Disables the usage of a Rotating IP Proxy

	findNames: true, // [OPTIONAL] Telling the tool to search for first and last names
	nameSelector: ".name", // (Only if { findNames: true }) Telling the tool where to find first and last names (CSS Selector)

	findLocations: true, // [OPTIONAL] Telling the tool to search for locations
	locationSelector: ".bio, .location", // (Only if { findLocations: true }) Telling the tool to search for location (CSS Selector)

	findEmails: true, // [OPTIONAL] Telling the tool to search for email addresses
	emailSelector: ".bio", // (Only if { findEmails: true }) Telling the tool to search for email adresses (CSS Selector)

	findPhones: true, // [OPTIONAL] Telling the tool to search for phone numbers
	phoneSelector: ".bio", // (Only if { findPhones: true }) Telling the tool to search for phone numbers (CSS Selector)

	findUrls: true, // [OPTIONAL] Telling the tool to search for linked URLs (Useful to link accounts to each others)
	urlSelector: ".social-links, .bio", // (Only if { findUrls: true }) Telling the tool to search for linked URLs (CSS Selector)
	urlExclude: ["facebook.com/websitedotcom"], // [OPTIONAL] (Only if { findUrls: true }) avoid accidentally collecting the website's social media links

	usernameOptions: {
		regex: /^[a-zA-Z][a-zA-Z0-9._-]{1,30}[a-zA-Z0-9]$/, // [OPTIONAL] Make the tool skip this website if the username doesn't match the given RegEx pattern
	},
});

// Use this if you want to analyse a website by using a custom code
export default new Website({
	id: "websiteid", // The Website ID following this pattern '^[a-z]+$' and matching the file name,
	title: "WebsiteDotCom", // The website title
	type: Website.Type.PERSONAL, // The type of website that you want to add (SOCIAL, PROFESSIONAL, GAMING, VIDEO, MUSIC, ART, BLOG, PERSONAL, DEVELOPMENT)
	nsfw: false, // If the website is NSFW (Not Safe For Work) or not
	actions: [
		// Which Actions the code you made does
		Website.Actions.PAGE_NAMES,
		Website.Actions.PAGE_LOCATIONS,
		Website.Actions.PAGE_EMAILS,
		Website.Actions.PAGE_PHONES,
		Website.Actions.PAGE_URLS,
	],
	execute: async (previousResult) => {
		// Your code, previous result is the search data or the last iteration's found data
	},
});
```

## Creating the website finder file

> In [/src/websites.ts](https://github.com/gastonchenet/hopmytrack/blob/main/src/websites.ts)

```typescript
export default Object.freeze([
	...{
		title: "WebsiteDotCom", // The website title
		id: "github", // The Website ID following this pattern '^[a-z]+$' and matching the website analyzer file name
		website: require("./websites/websiteid.ts").default as Website, // Use the path to the the website analyzer file
		regex:
			/(?:https?:\/\/)?(?:www\.)?website\.com\/(?<username>[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})/gi, // The matching pattern of any of the website's profile pages
	},
]);
```

**Note:** You can add a `non-fetchable` website only by setting the property `website` to `null`.
