`HopMyTrack` is an advanced **OSINT** (Open Source Intelligence) tool designed to help users uncover a wide range of publicly available information about individuals.
It uses a variety of techniques to gather data from various sources, including social media platforms, public records, and other online resources.

```bash
$ hmt "username:john_doe;first_name:John;last_name:Doe" # Search for information about John Doe
```

## How does it work?

HopMyTrack uses a combination of `GET` requests, data analysis, web scraping, and other techniques to gather information about individuals from various online sources. It searches for information based on the search parameters provided by the user and compiles the results into a comprehensive report.

### Recursion

HopMyTrack uses a recursive search algorithm to gather information about individuals. It starts with the initial search parameters and then iteratively searches for new information based on the results of the previous searches. This process continues until the specified depth level is reached.

**Here is a simplified diagram of the main algorithm:**

![Main Algo Diagram](https://raw.githubusercontent.com/gastonchenet/hopmytrack/refs/heads/main/assets/main-algo-diagram.svg)

### Data Sources

HopMyTrack gathers information from a wide range of online sources, including social media platforms, public records, and other online resources. It uses a variety of techniques to extract data from these sources and compile it into a comprehensive report.

You can customize the search process by using various search parameters and arguments to filter the results and focus on specific information.

## Features

The hmt command-line tool is the primary way to interact with `HopMyTrack`. It allows you to search for information about individuals using a variety of search parameters.

```bash
$ hmt --help        # Display the help message
$ hmt --version     # Check the version of HopMyTrack
$ hmt --update      # Update HopMyTrack to the latest version
```

`HopMyTrack` also includes an interactive mode that provides a more user-friendly experience. Simply run the `hmt` command without any arguments to enter interactive mode.

```bash
$ hmt               # Enter interactive mode
```
