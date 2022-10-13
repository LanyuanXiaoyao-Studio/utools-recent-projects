const fg = require('fast-glob')
const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2)
if (args.length < 1) {
  throw new Error('Need args for root path')
}
const root = args[0]
const nodeModulesPath = path.join(root, 'temp', 'node_modules').replace(/\\/g, '/')

let paths = fg.sync([
  `${nodeModulesPath}/**/*.(md|ts|json|map|svg)`,
  `${nodeModulesPath}/**/(LICENSE|LICENCE|AUTHORS)`,
  `${nodeModulesPath}/**/.(editorconfig|eslint|npmrc|npmignore|travis|devcontainer|nojekyll)*`,
  `${nodeModulesPath}/big-integer/BigInteger.min.js`,
  `${nodeModulesPath}/nano-jsx/(esm|bundles|readme)`,
  `${nodeModulesPath}/nanobar/(brand|demos)`,
  `${nodeModulesPath}/nanobar/nanobar.min.js`,
  `${nodeModulesPath}/string-comparison/**/*.mjs`,
  `${nodeModulesPath}/pinyin-pro/(data|lib|test|types)`,
  `${nodeModulesPath}/pinyin-pro/dist/index.esm.js`,
  `${nodeModulesPath}/sql.js/dist/*.zip`,
  `${nodeModulesPath}/sql.js/dist/(worker|sql-asm)*`,
  `${nodeModulesPath}/sql.js/dist/*debug*`,
  `${nodeModulesPath}/winreg/test`,
  `!${nodeModulesPath}/**/package.json`,
], {unique: true, dot: true, onlyFiles: false})
let count = 0
paths.forEach(p => {
  if (fs.existsSync(p)) {
    fs.rmSync(p, {recursive: true, force: true})
    count++
  }
})
console.log(`Delete ${count} files.`)
