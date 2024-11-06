## Blacklisting websites

To blacklist websites, you can set the argument `--blacklist` or `-b` to a comma-separated list of website IDs. For example:

```bash
$ hmt "username:john_doe" --blacklist github,gitlab # Blacklist GitHub and GitLab
```

This will prevent `HopMyTrack` from making requests to the specified websites during the search process.

## Whitelisting websites

To whitelist websites, you can set the argument `--whitelist` or `-w` to a comma-separated list of website IDs. For example:

```bash
$ hmt "username:john_doe" --whitelist twitter,linkedin # Whitelist Twitter and LinkedIn
```

This will restrict `HopMyTrack` to only make requests to the specified websites during the search process.

**Note:** If both the `--blacklist` and `--whitelist` arguments are provided, the `--blacklist` argument will take precedence.
