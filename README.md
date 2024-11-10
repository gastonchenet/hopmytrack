<h1 id="hopmytrack">HopMyTrack</h1>

<p>
	<a href="https://hopmytrack.vercel.app/">Website</a>
	&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
	<a href="https://hopmytrack.vercel.app/docs">Documentation</a>
	&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
	<a href="https://discord.com/invite/ezzV9MUs7n">Discord</a>
</p>

![](https://img.shields.io/github/license/gastonchenet/hopmytrack) ![](https://img.shields.io/github/v/release/gastonchenet/hopmytrack) ![](https://img.shields.io/github/issues/gastonchenet/hopmytrack) ![](https://img.shields.io/github/issues-pr/gastonchenet/hopmytrack) ![](https://img.shields.io/github/forks/gastonchenet/hopmytrack) ![](https://img.shields.io/github/stars/gastonchenet/hopmytrack)

![HopMyTrack Banner](https://github.com/gastonchenet/hopmytrack/blob/main/assets/banner.png?raw=true)

`HopMyTrack` is an advanced **OSINT** (Open Source Intelligence) tool designed to help users uncover a wide range of publicly available information about individuals.

It uses a variety of techniques to gather data from various sources, including social media platforms, public records, and other online resources.

## Table of Contents

- [Installation](#installation)
  - [Linux & MacOS](#linux--macos)
  - [Windows](#windows)
- [Usage](#usage)
  - [Command Lines](#command-lines)
  - [Interactive Mode](#interactive-mode)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

`HopMyTrack` is available for Linux (x64), MacOS (x64), and Windows (x64). You can install it using the following commands:

### Linux & MacOS

**Requirements:** `curl` and `unzip`

> Kernel version 5.6 or higher is strongly recommended, but the minimum is 5.1.

```bash
$ curl -fsSL https://hopmytrack.vercel.app/install.sh | bash
```

### Windows

```bash
$ powershell -c "irm https://hopmytrack.vercel.app/install.ps | iex"
```

## Usage

There are two ways to use HopMyTrack:

### Command Lines

You can use HopMyTrack from the command line if you want to use it as a standalone tool. The following command will search for information about a person named _John Doe_ and save the results to a file called **output.txt**:

```bash
$ hmt "username:john_doe;first_name:John;last_name:Doe" --verbose --output "output.txt"
```

### Interactive Mode

You can also use HopMyTrack in interactive mode, which provides a more user-friendly experience. Simply run the following command and follow the prompts:

> **Note:** The interactive mode may not be available on all platforms.

```bash
$ hmt
```

## Features

`HopMyTrack` offers a wide range of features, including:

```bash
$ hmt                                    # Run HopMyTrack in interactive mode (if available)

$ hmt --help                             # Display the help message
$ hmt --version                          # Display the version number

$ hmt <input> --depth <depth>            # Set the search depth
$ hmt <input> --proxy <proxy>            # Use a proxy server
$ hmt <input> --verbose                  # Display verbose output
```

## Contributing

Thank you to everyone who has contributed to HopMyTrack! ❤️

[<img alt="Contributors" src="http://129.151.231.6:8084/repositories/hopmytrack/contributors" width="100%">](#)

Refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
