# HopMyTrack

HopMyTrack is an advanced OSINT (Open Source Intelligence) tool designed to help users uncover a wide range of publicly available information about individuals. This powerful platform combines data from various online sources to provide comprehensive profiles that may include social media activity, public records, and other relevant digital footprints. With an intuitive interface, HopMyTrack enables users to efficiently search by name, email, or phone number, making it an invaluable resource for researchers, security professionals, and anyone needing detailed insights into a person's online presence. The tool's robust analytics also offer trend analysis and behavior prediction, making it a cutting-edge solution in the realm of digital investigation.

## Compile the cli

```bash
bun build ./cli.ts --compile --outfile ./build/HopMyTrack
```

## Usage

Every util commands

### Help command

_To get help on how to use HopMyTrack._

```bash
./HopMyTrack --help
```

### Enable NSFW

_To enable tracking on NSFW websites_

```bash
./HopMyTrack --nsfw
```

### Enable colors

_To enable logs with colors_

```bash
./HopMyTrack --colors
```

### Enable colors

_To enable real-time logs_

```bash
./HopMyTrack --verbose
```

### Output file

_To add an output file with the found information_

```bash
./HopMyTrack --output=./path/to/file.txt
```
