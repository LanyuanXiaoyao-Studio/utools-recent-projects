import {existsSync} from 'fs'
import {Platform} from './types'

export const compareChar: (a: string, b: string) => number = (a, b) => {
    if (a < b) return -1
    else if (a > b) return 1
    else return 0
}

export const pathDescription: (string) => string = path => existsSync(path) ? path : '文件不存在'

export const platformFromUtools: () => Platform = () => {
    if (utools.isWindows()) return Platform.win32
    else if (utools.isMacOs()) return Platform.darwin
    else if (utools.isLinux()) return Platform.linux
    else return Platform.unknown
}
