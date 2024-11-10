There are multiple methods to search for information about a person using HopMyTrack. The following arguments can be used to customize the search:

## Using the search arguments

### Query String

The query string is the main argument that is used to search for information about a person.
The basic syntax is `key:value` where `key` is the search parameter and `value` is the search value, each separated by a semicolon `;`.

**The available query parameters are:**

```css
username: The username of the person
usernames: A list of usernames separated by commas
first_name: The first name of the person
last_name: The last name of the person
location: The location of the person (city, country)
```

**For example:**

```bash
$ hmt "username:john_doe;location:New York" # Search for a person by username and location
$ hmt "first_name:John;last_name:Doe" # Search for a person by first and last name
$ hmt "usernames:john_doe,johnny_doe" # Search for multiple usernames
```

#### Other search arguments

Search arguments are keywords that can be used to customize the search process.
The basic syntax is `--<argument>(=| )<value>` or `-<a>(=| )<value>` you can either use a space or a '=' to assign a value to a parameter. Mind that using the `-<a>` syntax is only available for single-letter arguments and you can combine multiple single-letter arguments together.

**For example:**

> **Note:** Empty value arguments are considered as `true`.

```bash
hmt "username:john_doe" -!V # Search for the username "john_doe" and disable NSFW content and enable verbose mode
```

The following search arguments are supported:

#### Verbose mode

To enable verbose mode, you can use the argument `--verbose` or `-v`. This will display additional information during the search process.

**For example:**

```bash
$ hmt "username:john_doe" --verbose
```

#### NSFW

To enable or disable NSFW (Not Safe For Work) content in the search results, you can use the argument `--nsfw` or `-!`

**For example:**

```bash
$ hmt "username:john_doe" --nsfw
$ hmt "username:john_doe" -!
```

#### Coloring output

To disable colored output in the terminal, you can use the argument `--no-color` or `-c`.

**For example:**

```bash
$ hmt "username:john_doe" --no-color
$ hmt "username:john_doe" -c
```

#### Recursion depth

To set the search depth, you can use the argument `--depth` or `-d` followed by the depth level. The default depth is Infinity but it may result in infinite loops. For example:

**Info:** HopMyTrack uses the search data and on each iteration, it searches for new information based on the previous results. The depth level determines how many iterations the search will perform.

> **Note:** A higher depth level may result in more search results but will also take longer to complete.

```bash
$ hmt "username:john_doe" --depth=3
$ hmt "username:john_doe" -d 3
```

## Using the input file

You can also use an input file to provide search arguments. The input file should contain one argument per line.

**For example:**

```yaml
# input.yml
query:
	usernames:
		- john_doe
		- johnny_doe
	first_name: John
	last_name: Doe
	location: New York

depth: 3 # Set the search depth to 3
nsfw: true # Enable NSFW content
verbose: true # Enable verbose mode
```

To use the input file, you only have to replace the search query with the path to the input file.

**For example:**

```bash
$ hmt input.yml
```
