const {execFileSync} = require('child_process')
const {isNil, isEmpty} = require('licia')

function parseSqliteDefaultResult(result, fieldNames) {
  if (isNil(result) || isEmpty(result) || isNil(fieldNames) || isEmpty(fieldNames)) {
    return []
  }
  let length = fieldNames.length
  let lines = result.split(/\n/)
  return lines.map(line => {
    let fields = line.split(/\|/)
    let object = {}
    for (let i = 0; i < length; i++) {
      let fieldName = fieldNames[i]
      let field = fields[i]
      if (fieldName.charAt(0) === 'n' && fieldName.charAt(1) === '/') {
        fieldName = fieldName.substring(2)
        object[fieldName] = isEmpty(field) ? 0 : parseInt(field)
      }
      else if (fieldName.startsWith('b/')) {
        fieldName = fieldName.substring(2)
        object[fieldName] = isEmpty(field) ? false : field === 'true'
      }
      else {
        object[fieldName] = field
      }
    }
    return object
  })
}

let start = new Date().getTime()
let result = execFileSync('/usr/bin/sqlite3', ['/Users/lanyuanxiaoyao/Library/Application Support/Google/Chrome/Default/History', 'select v.id, u.url, u.title, cast(strftime(\'%s\', datetime((v.visit_time / 1000000) - 11644473600, \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom visits v\n         left join urls u on v.url = u.id\nwhere v.visit_time is not null\n  and v.url is not null\n  and v.visit_duration != 0\ngroup by u.last_visit_time\norder by timestamp desc\n'], {
  encoding: 'utf-8',
  maxBuffer: 1024 * 1024 * 20
})
  .trim()

let map = parseSqliteDefaultResult(result, ['n/id', 'url', 'title', 'n/timestamp'])
let end = new Date().getTime()
console.log(map, end - start)
