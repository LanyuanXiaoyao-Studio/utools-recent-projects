const fs = require('fs')
const path = require('path')

let iconFolderPath = 'icon'
let iconPaths = fs.readdirSync(iconFolderPath)
                  .filter(s => s.endsWith('png'))
                  .map(s => path.join(iconFolderPath, s))
console.log(iconPaths)
let iconBase64s = iconPaths.map(p => {
  let parser = path.parse(p)
  let buffer = fs.readFileSync(p)
  return {
    name: `${parser.name}${parser.ext}`,
    buffer: buffer,
    value: `data:image/png;base64,${buffer.toString('base64')}`,
  }
})
let iconTarget = path.join('public', 'icon')
if (!fs.existsSync(iconTarget)) {
  fs.mkdirSync(iconTarget, {recursive: true})
}
iconBase64s.forEach(o => {
  fs.writeFileSync(path.join(iconTarget, o.name), o.buffer)
})
let iconTsFileText = `export const iconMap: { [key: string]: string } = {
${iconBase64s.map(o => `    'icon/${o.name}': '${o.value}',`)
             .join('\n')}
}
`
let iconTsFilePath = path.join('src', 'Icon.ts')
fs.writeFileSync(iconTsFilePath, iconTsFileText)
