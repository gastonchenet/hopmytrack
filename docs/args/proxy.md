To use a proxy server, you can set the argument `--proxy` or `-p` to the proxy server address. The proxy server address should be in the format `http(s)://<username>:<password>@<ip>:<port>` or `http(s)://<ip>:<port>`. For example:

> **Note:** The proxy server address should be url-encoded if it contains special characters.

```bash
$ hmt "username:john_doe" --proxy https://username:password@proxy.example.com:8080
```

This will use the proxy server `https://proxy.example.com:8080` with the username `username` and password `password` to make requests.

**Important:** Make sure that you use a rotating proxy service to avoid getting blocked by websites. You can find various rotating proxy services online that provide a pool of IP addresses to rotate through automatically.

### Using the input file

You can also use an input file to provide the proxy argument. The input file should contain one argument per line.

**For example:**

```yaml
# input.yml
query: ... # The search query
proxy: https://username:password@proxy.example.com:8080 # Use the proxy server
```

> To see how to use the input file, refer to the [Using the input file](/docs/args/search#using-the-input-file) section.
