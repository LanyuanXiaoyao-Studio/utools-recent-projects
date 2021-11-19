#!/bin/bash

dist='dist'

rm -rf $dist
mkdir $dist

tsc --outDir $dist

# 生成 icon
node build-icon.js

cp -r public/* $dist

# 生成 stylus -> css 的文件到 dist 文件夹中
node build-css.js

current_path=`pwd`
echo $current_path
temp="${current_path}/temp"
mkdir $temp
cd $temp
packageJson='{
                "name"           : "utools-recent-projects-dependencies",
                "version"        : "1.0.0",
                "license"        : "MIT",
                "dependencies"   : {
                  "bplist-parser"    : "^0.3.0",
                  "licia"            : "^1.31.1",
                  "nano-jsx"         : "^0.0.20",
                  "nanobar"          : "^0.4.2",
                  "pinyin-pro"       : "^3.3.1",
                  "string-comparison": "^1.0.9",
                  "winreg"           : "^1.2.4"
                }
              }'
echo $packageJson > package.json
# 优先使用离线安装, 加快调试速度
yarn install --offline
# yarn install

cd "${temp}/node_modules/licia"
rm -rf *.ts *.md
cd $temp

cd "${temp}/node_modules/nano-jsx"
rm -rf .vscode readme .eslintrc .prettierrc bundles typings *.tsx jest*.json tsconfig*.json LICENSE *.md
find lib -name '*.ts' | xargs rm -rf
find lib -name '*.map' | xargs rm -rf
cd $temp

cd "${temp}/node_modules/big-integer"
rm -rf *.md *.ts tsconfig*.json LICENSE bower.json BigInteger.js
mv BigInteger.min.js BigInteger.js
cd $temp

cd "${temp}/node_modules/bplist-parser"
rm -rf *.md .editorconfig .eslintignore .eslintrc.js
cd $temp

cd "${temp}/node_modules/winreg"
rm -rf test *.md .npmignore jsdoc.conf.json
cp -r ${current_path}/lib/winreg/lib/registry.js lib
cd $temp

cd "${temp}/node_modules/nanobar"
rm -rf brand demos *.md .npmignore .eslintrc bower.json LICENSE nanobar.js
mv nanobar.min.js nanobar.js
cd $temp

cd "${temp}/node_modules/pinyin-pro"
rm -rf data handle-data lib test types .eslintrc .travis.yml *.md LICENSE tsconfig.json
cd $temp

cd "${temp}/node_modules/string-comparison"
rm -rf LICENCE *.md
cd $temp

cd $current_path
cp -r "${temp}/node_modules" $dist/
rm -rf $temp
