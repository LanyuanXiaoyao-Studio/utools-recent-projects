const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2)
if (args.length < 1) {
  throw new Error('Need args for root path')
}
if (args.length < 2) {
  throw new Error('Need args for key')
}
const root = args[0]
const key = args[1]

let pluginPath = path.join(root, 'dist', 'plugin.json')
let pluginObject = JSON.parse(fs.readFileSync(pluginPath, {encoding: 'utf-8'}))
pluginObject['name'] = 'zllxg1y5'
fs.writeFileSync(pluginPath, JSON.stringify(pluginObject, null, 2))
