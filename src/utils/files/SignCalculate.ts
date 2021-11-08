import {existsSync, statSync} from 'fs'

export const signCalculate: (path: string) => string = path => {
    if (!existsSync(path)) return ''
    let stat = statSync(path)
    return `${stat.size}${stat.mtimeMs}`
}
