import {isEmpty, isNil} from 'licia'

export const parseSqliteDefaultResult: (result: string, fieldNames: Array<string>) => Array<any> = (result, fieldNames) => {
    if (isNil(result) || isEmpty(result) || isNil(fieldNames) || isEmpty(fieldNames)) {
        return []
    }
    let length = fieldNames.length
    let lines = result.trim().split(/\n/)
    return lines.map(line => {
        let fields = line.trim().split(/\|/)
        let object = {}
        for (let i = 0; i < length; i++) {
            let fieldName = fieldNames[i]
            let field = fields[i]
            if (fieldName.startsWith('n/')) {
                fieldName = fieldName.substring(2)
                object[fieldName] = isEmpty(field) ? 0 : parseInt(field)
            } else if (fieldName.startsWith('f/')) {
                fieldName = fieldName.substring(2)
                object[fieldName] = isEmpty(field) ? 0.0 : parseFloat(field)
            } else if (fieldName.startsWith('b/')) {
                fieldName = fieldName.substring(2)
                object[fieldName] = isEmpty(field) ? false : field === 'true'
            } else {
                object[fieldName] = field
            }
        }
        return object
    })
}
