$dist="dist"

Remove-Item -Force -Recurse $dist
mkdir $dist

# 生成 icon 到 public 文件夹中
node .\build-icon.js

Copy-Item -Recurse -Path .\public\* $dist
tsc --outDir $dist

# 生成 stylus -> css 的文件到 dist 文件夹中
node .\build-css.js

$current_path=Get-Location
Write-Output $current_path
$temp="$current_path\temp"
mkdir $temp
Set-Location $temp
$packageJson=@"
{
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
}
"@
Write-Output $packageJson | Out-File package.json -Encoding utf8
# 优先使用离线安装, 加快调试速度
yarn install --offline
# yarn install

Set-Location "$temp\node_modules\licia"
Remove-Item -Force *.ts,*.md
Set-Location $temp

Set-Location "$temp\node_modules\nano-jsx"
Remove-Item -Force -Recurse .vscode,readme,.eslintrc,.prettierrc,bundles,typings,*.tsx,jest*.json,tsconfig*.json,LICENSE,*.md
Get-ChildItem * -Include *.ts -Recurse | Remove-Item
Get-ChildItem * -Include *.map -Recurse | Remove-Item
Set-Location $temp

Set-Location "$temp\node_modules\big-integer"
Remove-Item -Force -Recurse *.md,*.ts,tsconfig*.json,LICENSE,bower.json,BigInteger.js
Rename-Item BigInteger.min.js -NewName BigInteger.js
Set-Location $temp

Set-Location "$temp\node_modules\bplist-parser"
Remove-Item -Force -Recurse *.md,.editorconfig,.eslintignore,.eslintrc.js
Set-Location $temp

Set-Location "$temp\node_modules\winreg"
Remove-Item -Force -Recurse test,*.md,.npmignore,jsdoc.conf.json
Set-Location $temp

Set-Location "$temp\node_modules\nanobar"
Remove-Item -Force -Recurse brand,demos,*.md,.npmignore,.eslintrc,bower.json,LICENSE,nanobar.js
Rename-Item nanobar.min.js -NewName nanobar.js
Set-Location $temp

Set-Location "$temp\node_modules\pinyin-pro"
Remove-Item -Force -Recurse data,handle-data,lib,test,types,.eslintrc,.travis.yml,*.md,LICENSE,tsconfig.json
Set-Location $temp

Set-Location "$temp\node_modules\string-comparison"
Remove-Item -Force -Recurse LICENCE,*.md
Set-Location $temp

Set-Location $current_path
Copy-Item -Recurse "$temp\node_modules" $dist
Remove-Item -Force -Recurse $temp
