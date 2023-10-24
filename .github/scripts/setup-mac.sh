#!/bin/bash

brew install wget
brew install unzip

printf "Installing Xcode Tools \n"
xcode-select --install

printf "Installing Rust toolchain \n"
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh



printf "Please restart the terminal and then run the post_installation.sh script to finish the setup \n"
