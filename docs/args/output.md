To create an output file, you can use the argument `--output` or `-o` followed by the file path.

**For example:**

```bash
$ hmt "username:john_doe" --output output.txt
```

This will save the search results to a file named `output.txt` in the current directory.

### Using the input file

You can also use an input file to provide the output argument. The input file should contain one argument per line.

**For example:**

```yaml
# input.yml
query: ... # The search query
output: output.txt # Save the search results to output.txt
```

> To see how to use the input file, refer to the [Using the input file](/docs/args/search#using-the-input-file) section.
