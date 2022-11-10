$dist="dist"

Remove-Item -Force -Recurse $dist
mkdir $dist

tsc --outDir $dist

# 获取项目根目录
$root_path=Get-Location
$root_path="$root_path"
Write-Output $root_path

$bin_path="$root_path\bin"

# 生成版本号
node ${bin_path}\build-version.js $root_path

# 生成 icon
node $bin_path\build-icon.js $root_path

Copy-Item -Recurse -Path $root_path\public\* $dist

# 生成 stylus -> css 的文件到 dist 文件夹中
node $bin_path\build-css.js $root_path


$temp_path="$root_path\temp"
mkdir $temp_path
Set-Location $temp_path
$packageJson=@"
{
  "name": "utools-recent-projects-dependencies",
  "version": "1.0.0",
  "license": "MIT",
  "dependencies": {
    "bplist-parser": "^0.3.2",
    "licia": "^1.37.0",
    "nano-jsx": "^0.0.34",
    "nanobar": "^0.4.2",
    "pinyin-pro": "^3.11.0",
    "sql.js": "^1.8.0",
    "string-comparison": "^1.1.0",
    "winreg": "^1.2.4"
  }
}
"@
Write-Output $packageJson | Out-File package.json -Encoding utf8
# 优先使用离线安装, 加快调试速度
yarn install --offline
# yarn install

node $bin_path\build-clean.js $root_path

Remove-Item -Force "$temp_path\node_modules\winreg\lib\registry.js"
Copy-Item "$root_path\lib\winreg\lib\registry.js" "$temp_path\node_modules\winreg\lib"

Set-Location $root_path
Copy-Item -Recurse "$temp_path\node_modules" $dist
Remove-Item -Force -Recurse $temp_path
