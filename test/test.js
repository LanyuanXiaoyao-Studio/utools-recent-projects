const plistParser = require('bplist-parser')
const {isNil, isEmpty} = require('licia')
const generateParents = (parent, children, parentsName, childrenName) => {
  if (isEmpty(children)) {
    return []
  }
  let array = []
  children.forEach(child => {
    if (isNil(child?.[parentsName])) {
      child[parentsName] = []
    }
    if (!isNil(parent)) {
      if (!isNil(parent[parentsName]) && isEmpty(parent[parentsName])) {
        child[parentsName].push(...parent[parentsName])
      }
      child[parentsName].push(parent)
    }
    if (isNil(child?.[childrenName]) || isEmpty(child?.[childrenName])) {
      array.push(child)
    } else {
      array.push(...generateParents(child, child[childrenName], parentsName, childrenName))
    }
  })
  return array
}
plistParser.parseFile('/Users/lanyuanxiaoyao/Library/Safari/Bookmarks.plist')
           .then(result => {
             let root = result?.[0]?.['Children'].filter(i => i?.['Title'] === 'BookmarksBar')?.[0]?.['Children']
             if (!isNil(root)) {
               console.log(generateParents(undefined, root, 'Parents', 'Children'))
             }
           })
