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

echo "HopMyTrack succesfully installed!"

refresh_command=""

case $SHELL in
	*/fish)
		command="set --export PATH $hmt_root/bin \$PATH"
		fish_config=$HOME/.config/fish/config.fish

		if [[ -w $fish_config ]]; then
			{
				echo -e "\n# HopMyTrack"
				echo $command
			} >> $fish_config

			echo "HopMyTrack path added to $fish_config"

			refresh_command="source $fish_config"
		else
			error "Failed to add HopMyTrack path to $fish_config"
		fi ;;
	*/zsh)
		command="export PATH=\"$hmt_root/bin:\$PATH\""
		zsh_config=$HOME/.zshrc

		if [[ -w $zsh_config ]]; then
			{
				echo -e "\n# HopMyTrack"
				echo $command
			} >> $zsh_config

			echo "HopMyTrack path added to $zsh_config"

			refresh_command="exec $SHELL -l"
		else
			error "Failed to add HopMyTrack path to $zsh_config"
		fi ;;
	*/bash)
		command="export PATH=\"$hmt_root/bin:\$PATH\""

		bash_configs=(
			"$HOME/.bashrc"
			"$HOME/.bash_profile"
		)

		if [[ ${XDG_CONFIG_HOME:-} ]]; then
			bash_configs+=(
				"$XDG_CONFIG_HOME/bashrc"
				"$XDG_CONFIG_HOME/bash_profile"
				"$XDG_CONFIG_HOME/.bashrc"
				"$XDG_CONFIG_HOME/.bash_profile"
			)
		fi

		set_manually=true
		for bash_config in "${bash_configs[@]}"; do
			if [[ -w $bash_config ]]; then
				{
					echo -e "\n# HopMyTrack"
					echo $command
				} >> $bash_config

				echo "HopMyTrack path added to $bash_config"

				refresh_command="source $bash_config"
				set_manually=false
			fi
		done

		if [[ $set_manually = true ]]; then
			echo "HopMyTrack path not added to any bash config file"
			echo "Please add the following line to your bash config file:"
			echo $command
		fi ;;
	*)
		echo "Unsupported shell: $SHELL"
		echo "Please add the following line to your shell config file:"
		echo $command ;;
esac

if [[ $refresh_command ]]; then
	echo "Refreshing shell..."
	eval $refresh_command
fi