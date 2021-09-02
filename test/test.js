// const sql = require('node-sqlite-purejs')
// sql.open('/Users/lanyuanxiaoyao/Library/Application Support/Firefox/Profiles/kckvyyvg.default-release-1603159468241/places.sqlite', {}, (error, db) => {
//   if (error) {
//     console.log(error)
//   }
//   db.exec(`select sqlite_version()`, (error, result) => {
//     if (error) {
//       console.log(error)
//     }
//     console.log(result)
//   })
// })

// const db = require('better-sqlite3')('/Users/lanyuanxiaoyao/Library/Application Support/Firefox/Profiles/kckvyyvg.default-release-1603159468241/places.sqlite', {})
// const row = db.prepare('select sqlite_version()')
// console.log(row.get())

const {readFileSync} = require('fs')
const InitSQL = require('sql.js/dist/sql-asm')
InitSQL()
  .then((SQL) => {
    let db = new SQL.Database(readFileSync('/Users/lanyuanxiaoyao/Library/Application Support/Firefox/Profiles/kckvyyvg.default-release-1603159468241/places.sqlite'))
    console.log(db)
    console.log(db.exec('select * from main.moz_places limit 10')[0]['values'])
  })
