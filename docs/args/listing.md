Blacklisting and whitelisting websites can be useful to prevent `HopMyTrack` from making requests to specific websites during the search process. This can be helpful when you want to exclude certain websites from the search results or focus only on specific websites.

> **Note:** You will still be able to see the blacklisted websites in the search results, but no requests will be made to them.

## Blacklisting websites

To blacklist websites, you can set the argument `--blacklist` or `-b` to a comma-separated list of website IDs.

**For example:**

```bash
$ hmt "username:john_doe" --blacklist github,gitlab # Blacklist GitHub and GitLab
```

This will prevent `HopMyTrack` from making requests to the specified websites during the search process.

### Using the input file

You can also use an input file to provide the blacklist argument. The input file should contain one argument per line.

**For example:**

```yaml
# input.yml
query: ... # The search query
blacklist:  # Blacklist GitHub and GitLab
	- github
	- gitlab
```

> To see how to use the input file, refer to the [Using the input file](/docs/args/search#using-the-input-file) section.

## Whitelisting websites

To whitelist websites, you can set the argument `--whitelist` or `-w` to a comma-separated list of website IDs.

**For example:**

```bash
$ hmt "username:john_doe" --whitelist twitter,linkedin # Whitelist Twitter and LinkedIn
```

This will restrict `HopMyTrack` to only make requests to the specified websites during the search process.

### Using the input file

You can also use an input file to provide the whitelist argument. The input file should contain one argument per line.

**Note:** If both the `--blacklist` and `--whitelist` arguments are provided, the `--blacklist` argument will take precedence.

**For example:**

```yaml
# input.yml
query: ... # The search query
whitelist: # Whitelist Twitter and LinkedIn
	- twitter
	- linkedin
```

> To see how to use the input file, refer to the [Using the input file](/docs/args/search#using-the-input-file) section.
