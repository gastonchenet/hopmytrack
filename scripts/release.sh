#!/usr/bin/env bash
cd $(dirname $0)/..

release_dir=.release/

# Creating the release directory and cleaning it
mkdir -p $release_dir
rm -rf $release_dir/*

echo "Bun version: $(bun --version)" > $release_dir/versions.txt
echo "Project version: $(node -p "require('./package.json').version")" >> $release_dir/versions.txt

# Copying the LICENSE file
cp LICENSE $release_dir

function zip_build {
  local plat=$1
  local arch=$2

  # bun run build:$plat

  if [[ $plat = "win" ]]; then
    zip -j $release_dir/hopmytrack-$plat-$arch.zip ./build/hopmytrack-$plat-$arch.exe ./scripts/uninstall.ps1
  else
    zip -j $release_dir/hopmytrack-$plat-$arch.zip ./build/hopmytrack-$plat-$arch
  fi
}

# Building the project
zip_build lin x64
# zip_build lin aach64
zip_build dar x64
# zip_build dar aach64
zip_build win x64

# Making the ZIP file
zip -r "$release_dir/Source code.zip" ./src ./LICENSE ./README.md ./package.json -x src/test/*

# Making the TAR.GZ file
tar -czf "$release_dir/Source code.tar.gz" ./src ./LICENSE ./README.md ./package.json -X src/test/*