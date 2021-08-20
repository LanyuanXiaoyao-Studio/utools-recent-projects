import {existsSync} from 'fs'

export const compareChar: (a: string, b: string) => number = (a, b) => {
    if (a < b) return -1
    else if (a > b) return 1
    else return 0
}

export const pathDescription: (string) => string = path => existsSync(path) ? path : '文件不存在'
