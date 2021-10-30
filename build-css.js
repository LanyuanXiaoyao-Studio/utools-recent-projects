const stylus = require('stylus')
const path = require('path')
const fs = require('fs')
const customSourcePath = path.join('src', 'setting', 'css', 'custom.styl')
const customTargetPath = path.join('dist', 'setting', 'css', 'Custom.js')
const customSource = fs.readFileSync(customSourcePath, {encoding: 'utf-8'})
stylus.render(customSource, (error, result) => {
  if (error) {
    console.log(error)
  }
  else {
    fs.writeFileSync(customTargetPath, `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomCss = void 0;
exports.CustomCss = \`
${result.replace(/\n/g, '').trim()}
\``, {encoding: 'utf8', flag: 'w+'})
  }
})
