$dist="dist"

Remove-Item -Force -Recurse $dist
mkdir $dist

node .\build-icon.js
Copy-Item -Recurse -Path .\public\* $dist
tsc --outDir $dist

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
  "bplist-parser"  : "^0.3.0",
  "licia"          : "^1.29.0",
  "nano-jsx"       : "^0.0.20"
  }
}
"@
Write-Output $packageJson | Out-File package.json -Encoding utf8
yarn install

Set-Location "$temp\node_modules\licia"
Remove-Item -Force *.ts,*.md
Set-Location $temp

Set-Location "$temp\node_modules\nano-jsx"
Remove-Item -Force -Recurse .vscode,readme,.eslintrc,.prettierrc,bundles,typings,*.tsx,jest*.json,tsconfig*.json,LICENSE,*.md
Get-ChildItem * -Include *.ts -Recurse | Remove-Item
Get-ChildItem * -Include *.map -Recurse | Remove-Item
Set-Location $temp

Set-Location "$temp\node_modules\big-integer"
Remove-Item -Force -Recurse *.md,*.ts,tsconfig*.json,LICENSE,bower.json,*.min.js
Set-Location $temp

Set-Location "$temp\node_modules\bplist-parser"
Remove-Item -Force -Recurse *.md,.editorconfig,.eslintignore,.eslintrc.js
Set-Location $temp

Set-Location $current_path
Copy-Item -Recurse "$temp\node_modules" $dist
Remove-Item -Force -Recurse $temp