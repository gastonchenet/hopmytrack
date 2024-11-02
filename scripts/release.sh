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

# Building the project
bun run build:win
bun run build:lin

cp -r build/* $release_dir

# Making the ZIP file
zip -r "$release_dir/Source code.zip" ./src ./LICENSE ./README.md ./package.json -x src/test/*

# Making the TAR.GZ file
tar -czf "$release_dir/Source code.tar.gz" ./src ./LICENSE ./README.md ./package.json -X src/test/*