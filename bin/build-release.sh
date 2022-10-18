#!/bin/bash

# 获取项目根目录
root_path=`pwd`
echo $root_path

bin_path="${root_path}/bin"
plugin_path="${root_path}/dist/plugin.json"

if [ -z $UTOOLS_KEY ]; then
  echo 'utools key not found'
  exit 1
fi

node ${bin_path}/add-key.js $root_path $UTOOLS_KEY

plugin_name=$(cat $plugin_path | jq -r .pluginName)
plugin_version=$(cat $plugin_path | jq -r .version)

git_count=$(git rev-list --all --count)

asar p dist $plugin_name
gzip $plugin_name
mv $plugin_name.gz $plugin_name-$plugin_version\($git_count\).upx
