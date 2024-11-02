#!/usr/bin/env bash

cd $(dirname $0)/..
# Navigate to the parent directory of the script's location.

file_name=hopmytrack-linux-x64
github_repo=https://github.com/gastonchenet/hopmytrack
hmt_uri=$github_repo/releases/latest/download/$file_name
# Define variables for the file name, GitHub repository, and download URL.

install_env=HMT_INSTALL
bin_env=\$$install_env/bin
# Set environment variables for the install path and binary directory.

install_dir=${!install_env:-$HOME/.hmt}
bin_dir=$install_dir/bin
exe=$bin_dir/hmt
# Define paths for the installation and executable.

# Create bin directory if it doesn’t exist
if [[ ! -d $bin_dir ]]; then
  mkdir -p "$bin_dir" || error "Failed to create install directory \"$bin_dir\""
fi

# Download HopMyTrack executable
curl --fail --location --progress-bar -o $exe $hmt_uri || error "Failed to download HopMyTrack from \"$hmt_uri\""

# Make it executable
chmod +x $exe || error "Failed to set permissions on HopMyTrack executable"

echo "HopMyTrack has been installed successfully!"

# Add bin directory to PATH if not present
if ! grep -q "$bin_dir" <<< "$PATH"; then
  echo "" >> "$HOME/.bashrc"
  echo "# HopMyTrack" >> "$HOME/.bashrc"
  echo "export PATH=\"\$PATH:$bin_dir\"" >> "$HOME/.bashrc"
  echo "Please restart your terminal or run \"source ~/.bashrc\""
fi
