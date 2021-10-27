const stylus = require('stylus')
const path = require('path')
const fs = require('fs')
const customSourcePath = path.join('src', 'setting', 'css', 'custom.styl')
const customTargetPath = path.join('src', 'setting', 'css', 'Custom.ts')
const customSource = fs.readFileSync(customSourcePath, {encoding: 'utf-8'})
stylus.render(customSource, (error, result) => {
  if (error) {
    console.log(error)
  }
  else {
    fs.writeFileSync(customTargetPath, `// language=CSS
export const CustomCss: string = \`
${result.replace(/\n/g, '').trim()}
\``, {encoding: 'utf8', flag: 'w+'})
  }
})
