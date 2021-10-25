#!/bin/bash

dist='dist'

rm -rf $dist
mkdir $dist

node build-icon.js
node build-css.js

cp -r public/* $dist
tsc --outDir $dist

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
                  "licia"            : "^1.30.0",
                  "nano-jsx"         : "^0.0.20",
                  "nanobar"          : "^0.4.2",
                  "pinyin-pro"       : "^3.3.1",
                  "string-comparison": "^1.0.9",
                  "winreg"           : "^1.2.4"
                }
              }'
echo $packageJson > package.json
yarn install

cd "${temp}/node_modules/licia"
rm -rf *.ts *.md
cd $temp

cd "${temp}/node_modules/nano-jsx"
rm -rf .vscode readme .eslintrc .prettierrc bundles typings *.tsx jest*.json tsconfig*.json LICENSE *.md
find lib -name '*.ts' | xargs rm -rf
find lib -name '*.map' | xargs rm -rf
cd $temp

cd "${temp}/node_modules/big-integer"
rm -rf *.md *.ts tsconfig*.json LICENSE bower.json *.min.js
cd $temp

cd "${temp}/node_modules/bplist-parser"
rm -rf *.md .editorconfig .eslintignore .eslintrc.js
cd $temp

cd "${temp}/node_modules/winreg"
rm -rf test *.md .npmignore jsdoc.conf.json
cd $temp

cd "${temp}/node_modules/nanobar"
rm -rf brand demos *.md .npmignore .eslintrc bower.json LICENSE nanobar.min.js
cd $temp

rm -rf "${temp}/node_modules/pinyin-pro"
cp -r "${current_path}/libs/pinyin-pro" "${temp}/node_modules"
cd $temp

cd "${temp}/node_modules/string-comparison"
rm -rf LICENCE *.md
cd $temp

cd $current_path
cp -r "${temp}/node_modules" $dist/
rm -rf $temp
