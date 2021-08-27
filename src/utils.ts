import {existsSync} from 'fs'
import {Platform} from './types'

/**
 * 字符比较, 用于在 array.sort() 使用
 *
 * @param a 待比较字符
 * @param b 待比较字符
 */
export const compareChar: (a: string, b: string) => number = (a, b) => {
    if (a < b) return -1
    else if (a > b) return 1
    else return 0
}

export interface ExistsOrNotItem {
    readonly exists: boolean
    readonly description: string
    readonly icon: string
}

export const existsOrNot: (string, ExistsOrNotItem) => ExistsOrNotItem = (path, item) => existsSync(path) ? item : {
    exists: false,
    description: `文件不存在`,
    icon: item.icon,
}

/**
 * 用于从 uTools 的系统版本转换为枚举类型的系统版本, 方便后续比较使用
 */
export const platformFromUtools: () => Platform = () => {
    if (utools.isWindows()) return Platform.win32
    else if (utools.isMacOs()) return Platform.darwin
    else if (utools.isLinux()) return Platform.linux
    else return Platform.unknown
}
