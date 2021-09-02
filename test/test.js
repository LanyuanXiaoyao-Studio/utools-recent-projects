const stylus = require('stylus')
// language=Stylus
let css = `.application
  background-color red
  .card
    color aliceblue`
stylus.render(css, (error, result) => {
  console.log(result)
})
