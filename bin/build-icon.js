const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)
if (args.length < 1) {
  throw new Error("Need args for root path")
}
const root = args[0]
let iconFolderPath = path.join(root, 'icon')
let iconPaths = fs.readdirSync(iconFolderPath)
                  .filter(s => s.endsWith('png'))
                  .map(s => path.join(iconFolderPath, s))
let iconBase64s = iconPaths.map(p => {
  let parser = path.parse(p)
  let buffer = fs.readFileSync(p)
  return {
    name: `${parser.name}${parser.ext}`,
    buffer: buffer,
    value: `data:image/png;base64,${buffer.toString('base64')}`,
  }
})
let iconTarget = path.join(root, 'public', 'icon')
if (!fs.existsSync(iconTarget)) {
  fs.mkdirSync(iconTarget, {recursive: true})
}
iconBase64s.forEach(o => {
  fs.writeFileSync(path.join(iconTarget, o.name), o.buffer)
})
let iconTsFileText = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconMap = void 0;
exports.iconMap = {
${iconBase64s.map(o => `    'icon/${o.name}': '${o.value}',`)
             .join('\n')}
}
`
let iconTsFilePath = path.join(root, 'dist', 'Icon.js')
fs.writeFileSync(iconTsFilePath, iconTsFileText)
