import {existsSync} from 'fs'
import {Platform} from './types'
import {isEmpty, isNil, Url} from 'licia'

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

export const existsOrNot: (string, ExistsOrNotItem) => ExistsOrNotItem = (path, item) => existsSync(path)
    ? {
        exists: true,
        ...item,
    }
    : {
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

export const removeAllQueryFromUrl: (url: string) => string = url => {
    let parser = Url.parse(url)
    return `${parser.protocol}//${parser.hostname}${isEmpty(parser.port) ? '' : `:${parser.port}`}`
}

export const parseTimeFrom1604: (source: number) => number = source => {
    let key = -11644473600000
    if (source === 0) {
        return 0
    }
    return key + source / 1000
}

export const generateParents: (parent: any, children: Array<any>, parentsName: string, childrenName: string) => Array<any> = (parent, children, parentsName, childrenName) => {
    if (isEmpty(children)) {
        return []
    }
    let array: Array<any> = []
    children.forEach(child => {
        if (isNil(child?.[parentsName])) {
            child[parentsName] = []
        }
        if (!isNil(parent)) {
            if (!isNil(parent[parentsName]) && !isEmpty(parent[parentsName])) {
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
