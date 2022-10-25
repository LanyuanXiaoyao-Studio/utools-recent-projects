#!/bin/bash

dist='dist'

rm -rf $dist
mkdir $dist

tsc --outDir $dist

# 获取项目根目录
root_path=`pwd`
echo $root_path

bin_path="${root_path}/bin"

# 生成版本号
node ${bin_path}/build-version.js $root_path

# 生成 icon
node ${bin_path}/build-icon.js $root_path

cp -r public/* $dist

# 生成 stylus -> css 的文件到 dist 文件夹中
node ${bin_path}/build-css.js $root_path

temp_path="${root_path}/temp"
mkdir $temp_path
cd $temp_path
packageJson='{
                "name": "utools-recent-projects-dependencies",
                "version": "1.0.0",
                "license": "MIT",
                "dependencies": {
                  "bplist-parser": "^0.3.2",
                  "licia": "^1.37.0",
                  "nano-jsx": "^0.0.32",
                  "nanobar": "^0.4.2",
                  "pinyin-pro": "^3.11.0",
                  "sql.js": "^1.7.0",
                  "string-comparison": "^1.1.0",
                  "winreg": "^1.2.4"
                }
              }'
echo $packageJson > package.json
# 优先使用离线安装, 加快调试速度
yarn install --offline
# yarn install

node ${bin_path}/build-clean.js $root_path

#rm -rf "${temp_path}/node_modules/winreg/lib/registry.js"
#cp "${root_path}/lib/winreg/lib/registry.js" "${temp_path}/node_modules/winreg/lib"

cd $root_path
cp -r "${temp_path}/node_modules" $dist/
rm -rf $temp_path
