## Installing

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

### Checking the installation

After the installation is complete, you can check if `HopMyTrack` is installed correctly by running the following command:

```bash
$ hmt --version
```

If you've installed `HopMyTrack` but are seeing a `command not found` error, you may need to add the installation directory to your `PATH` environment variable. The installation directory is typically `$HOME/.hmt/bin` on Linux and MacOS, and `$env:USERPROFILE/.hmt/bin` on Windows.

**How to add the installation directory to your `PATH` environment variable:**

- **Linux & MacOS:**

  Determine which system you are on by running the following command:

  ```bash
  $ echo $SHELL
  ```

  Add the following line to your `~/.bashrc`, `~/.config/fish/config.fish`, or `~/.zshrc` file:

  ```bash
  export PATH="$PATH:$HOME/.hmt/bin"
  ```

  Then, run:

  ```bash
  $ source ~/.bashrc
  ```

- **Windows:**

  Go to `Control Panel` > `System and Security` > `System` > `Advanced system settings` > `Environment Variables`.

  Under `System variables`, select `Path` and click `Edit`.

  Click `New` and add the path to the `bin` directory (e.g., `$env:USERPROFILE/.hmt/bin`).

  Click `OK` to save the changes.

## Updating

To update `HopMyTrack` to the latest version, run the following command:

```bash
$ hmt --update
```

This will download the latest version of `HopMyTrack` and replace the existing installation.

## Downloading the binaries directly

If you prefer to download the binaries directly, you can find them on the [releases page](https://github.com/gastonchenet/hopmytrack/releases).

You can download the appropriate binary for your system and place it in a directory that is included in your `PATH` environment variable.

Here you can download the latest version of `HopMyTrack`:

- [hopmytrack-lin-x64.zip](https://github.com/gastonchenet/hopmytrack/releases/latest/download/hopmytrack-lin-x64.zip)
- [hopmytrack-dar-x64.zip](https://github.com/gastonchenet/hopmytrack/releases/latest/download/hopmytrack-dar-x64.zip)
- [hopmytrack-win-x64.zip](https://github.com/gastonchenet/hopmytrack/releases/latest/download/hopmytrack-win-x64.zip)

## Uninstalling

To uninstall `HopMyTrack`, run the following command:

### Linux & MacOS

```bash
$ rm -r ~/.hmt
```

### Windows

```bash
$ powershell -c ~/.hmt/uninstall.ps1
```

This will remove the `HopMyTrack` installation directory and all its contents.
