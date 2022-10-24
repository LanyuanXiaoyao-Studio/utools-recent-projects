const path = require('path')
const fs = require('fs')
const {execSync} = require('child_process')
const args = process.argv.slice(2)
if (args.length < 1) {
  throw new Error('Need args for root path')
}
const root = args[0]
const packagePath = path.join(root, 'package.json')
const versionPath = path.join(root, 'dist', 'utils', 'versions', 'PluginVersion.js')

const content = JSON.parse(fs.readFileSync(packagePath, {encoding: 'utf-8'}))
const version = content['version']
const gitCount = execSync('git rev-list --all --count')
const pluginVersion = `${version}(${gitCount})`.replace(/\s/g, '')

fs.appendFileSync(versionPath, `exports.pluginVersion = '${pluginVersion}';\n`, {encoding: 'utf-8'})
