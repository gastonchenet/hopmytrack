There are multiple methods to search for information about a person using HopMyTrack. The following arguments can be used to customize the search:

## NSFW

To enable or disable NSFW (Not Safe For Work) content in the search results, you can use the argument `--nsfw` or `-!` For example:

```bash
$ hmt "username:john_doe" --nsfw
```

## Verbose mode

To enable verbose mode, you can use the argument `--verbose` or `-v`. This will display additional information during the search process. For example:

```bash
$ hmt "username:john_doe" --verbose
```

## Coloring output

To disable colored output in the terminal, you can use the argument `--no-color` or `-c`. For example:

```bash
$ hmt "username:john_doe" --no-color
```

## Recursion depth

To set the search depth, you can use the argument `--depth` or `-d` followed by the depth level. The default depth is Infinity but it may result in infinite loops. For example:

HopMyTrack uses the search data and on each iteration, it searches for new information based on the previous results. The depth level determines how many iterations the search will perform.

> Note: A higher depth level may result in more search results but will also take longer to complete.

```bash
$ hmt "username:john_doe" --depth 3
```
