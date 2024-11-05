#!/usr/bin/env bash

# Navigate to the parent directory of the script's location.
cd $(dirname $0)/..

# Initializing variables
hmt_root=HMT_INSTALL
hmt_root=${!hmt_root:-$HOME/.hmt}
hmt_path=$hmt_root/hmt.zip

file_name=hopmytrack-lin-x64
url=https://github.com/gastonchenet/hopmytrack/releases/latest/download/$file_name.zip

# Rebuilding the path to the executable
if [ -f $hmt_root ]; then rm -rf $hmt_root; fi
mkdir -p $hmt_root/bin ||
  error "Failed to create directory \"$hmt_root\""

# Downloading the executable with curl
curl --fail --location --progress-bar -o $hmt_path $url ||
  error "Failed to download HopMyTrack from \"$url\""

# Extracting the executable from the archive
command -v unzip > /dev/null ||
  error "Unzip is not installed. Please install it and try again."

unzip -q $hmt_path -d $hmt_root ||
  error "Failed to extract HopMyTrack to \"$hmt_root\""

# Renaming the executable
mv $hmt_root/$file_name $hmt_root/bin/hmt ||
  error "Failed to rename HopMyTrack executable" 

# Removing the archive
rm $hmt_path ||
  error "Failed to remove HopMyTrack archive"

# Setting permissions on the executable
chmod +x $hmt_root/bin/hmt ||
  error "Failed to set permissions on HopMyTrack executable"

# Adding the executable to the PATH
if ! grep -q $hmt_root/bin <<< $PATH; then
  export PATH="$PATH:$hmt_root/bin"

  echo "" >> "$HOME/.bashrc"
  echo "# HopMyTrack" >> "$HOME/.bashrc"
  echo "export PATH=\"\$PATH:$hmt_root/bin\"" >> "$HOME/.bashrc"

  echo "Please restart your terminal or run \"source ~/.bashrc\""
fi