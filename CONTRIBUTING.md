# Contributing

Contributions are welcome! Here are a few ways you can help improve `HopMyTrack`:

- You can easily contribute by [adding websites](#adding-a-website) to the project.
- Report bugs and request new features by opening an [issue](https://github.com/gastonchenet/hopmytrack/issues).
- Submit a [pull request](https://github.com/gastonchenet/hopmytrack/pulls) with bug fixes or new features.
- Help improve the documentation by fixing typos, adding examples, or suggesting improvements.

Before contributing, please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## Adding a website

You can easily add a website to fetch to the tool by following these steps

### Creating the website analyzer file

> Add a file : /src/websites/<WEBSITE_ID>.ts
```typescript
import Website from "../structures/Website";

// Use this if you want to analyse a website using the easy way
export default Website.fromJSON("websiteid", { // The Website ID following this pattern '^[a-z]+$' and matching the file name
  title: "WebsiteDotCom",  // The website title
  nsfw: false, // [OPTIONAL] If the website is NSFW (Not Safe For Work) or not
  disableProxy: false, // [OPTIONAL] Disables the usage of a Rotating IP Proxy
  type: Website.Type.PERSONAL, // The type of website that you want to add (SOCIAL, PROFESSIONAL, GAMING, VIDEO, MUSIC, ART, BLOG, PERSONAL, DEVELOPMENT)
  requestUrl: "https://api.website.com/profile_username?={username}", // The request URL, use '{username}' as the placeholder for the username
  responseUrl: "https://website.com/{username}", // [OPTIONAL] How the response URL will be displayed as a result, use '{username}' as the placeholder for the username
  errorType: Website.ErrorType.STATUS_CODE, // The error that will be returned if the searched username is unavailable (STATUS_CODE, RESPONSE_BODY, RESPONSE_URL)
  errorBody: "this username is unavailable", // (Only if { errorType: STATUS_CODE }) A string specificly present in the returned HTML code if the username is unavailable (can also be a 'string[]')
  errorUrl: "https://api.website.com/profileError", // (Only if { errorType: RESPONSE_URL }) The response URL returned if the username is unavailable
  headers: Website.DEFAULT_HEADERS, // Request headers
  requestInterval: 100, // The time (in ms) between each request to avoid 429 error code (Too Many Requests)
  findNames: true, // [OPTIONAL] Telling the tool to search for first and last names
  findLocations: true, // [OPTIONAL] Telling the tool to search for locations
  findEmails: true, // [OPTIONAL] Telling the tool to search for email addresses
  findPhones: true, // [OPTIONAL] Telling the tool to search for phone numbers
  findUrls: true, // [OPTIONAL] Telling the tool to search for linked URLs (Useful to link accounts to each others)
  nameSelector: ".name", // (Only if { findNames: true }) Telling the tool where to find first and last names (CSS Selector)
  locationSelector: ".bio, .location", // (Only if { findLocations: true }) Telling the tool to search for location (CSS Selector)
  emailSelector: ".bio", // (Only if { findEmails: true }) Telling the tool to search for email adresses (CSS Selector)
  phoneSelector: ".bio", // (Only if { findPhones: true }) Telling the tool to search for phone numbers (CSS Selector)
  urlSelector: ".social-links, .bio", // (Only if { findUrls: true }) Telling the tool to search for linked URLs (CSS Selector)
  urlExclude: ["facebook.com/websitedotcom"], // [OPTIONAL] (Only if { findUrls: true }) avoid accidentally collecting the website's social media links
  usernameOptions: {
    regex: /^[a-zA-Z][a-zA-Z0-9._-]{1,30}[a-zA-Z0-9]$/, // [OPTIONAL] Make the tool skip this website if the username doesn't match the given RegEx pattern
  },
});

// Use this if you want to analyse a website by using a custom code
export default new Website(
  "websiteid", // The Website ID following this pattern '^[a-z]+$' and matching the file name,
  "WebsiteDotCom",  // The website title
  Website.Type.PERSONAL,  // The type of website that you want to add (SOCIAL, PROFESSIONAL, GAMING, VIDEO, MUSIC, ART, BLOG, PERSONAL, DEVELOPMENT)
  false, // If the website is NSFW (Not Safe For Work) or not
  [ // Which Actions the code you made does
    Website.Actions.PAGE_NAMES,
    Website.Actions.PAGE_LOCATIONS,
    Website.Actions.PAGE_EMAILS,
    Website.Actions.PAGE_PHONES,
    Website.Actions.PAGE_URLS,
  ],
  async (previousResult) => {
    // Your code, previous result is the search data or the last iteration's found data
  }
)
```

### Creating the website finder file

> In /src/websites.ts
```typescript
export default Object.freeze([
  ...
  {
    title: "WebsiteDotCom", // The website title
    id: "github", // The Website ID following this pattern '^[a-z]+$' and matching the website analyzer file name
    website: require("./websites/websiteid.ts").default as Website, // Use the path to the the website analyzer file
    regex:
      /(?:https?:\/\/)?(?:www\.)?website\.com\/(?<username>[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})/gi, // The matching pattern of any of the website's profile pages
  }
]);
```

**Note:** You can add a `non-fetchable` website only by setting the property `website` to `null`.

## License

`HopMyTrack` is licensed under the [MIT License](LICENSE).
