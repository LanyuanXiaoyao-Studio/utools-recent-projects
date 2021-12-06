import {existsSync, readdirSync, Stats, statSync} from 'fs'
import {Platform} from './Types'
import {isEmpty, isFn, isNil, isUrl, Url} from 'licia'
import {Context} from './Context'
import {i18n, sentenceKey} from './i18n'
import {join, parse} from 'path'
import WinReg from 'winreg'
import S from 'licia/$'

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
        description: i18n.t(sentenceKey.pathNotFound),
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

let currentSystemHome = ''

export const systemHome: () => string = () => {
    if (isEmpty(currentSystemHome)) {
        currentSystemHome = utools.getPath('home')
    }
    return currentSystemHome
}

let currentSystemUserName = ''

export const systemUser: () => string = () => {
    if (isEmpty(currentSystemUserName)) {
        let home = systemHome()
        let parser = parse(home)
        currentSystemUserName = parser.name
    }
    return currentSystemUserName
}

export const removeAllQueryFromUrl: (url: string) => string = url => {
    try {
        if (!isUrl(url)) {
            return url
        }
        return Url.parse(url).hostname
    } catch (error) {
        return url
    }
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

export interface StringByOS {
    readonly handler?: (text: string) => string
    readonly win32?: string
    readonly darwin?: string
    readonly linux?: string
    readonly unknown?: string
}

export const generateStringByOS: (data: StringByOS) => string = data => {
    let platform = platformFromUtools()
    let text = ''
    switch (platform) {
        case Platform.win32:
            text = data?.win32 ?? ''
            break
        case Platform.darwin:
            text = data?.darwin ?? ''
            break
        case Platform.linux:
            text = data?.linux ?? ''
            break
        case Platform.unknown:
            text = data?.unknown ?? ''
            break
    }
    if (isNil(data?.handler) || !isFn(data.handler)) {
        return text
    } else {
        return data.handler!(text)
    }
}

let isDev: boolean
export const isDevelopment: () => boolean = () => {
    if (isNil(utools.isDev) || !isFn(utools.isDev)) {
        if (isNil(isDev)) {
            isDev = !/[a-zA-Z0-9\-]+\.asar/.test(__dirname)
        }
    } else {
        if (isNil(isDev)) {
            isDev = utools.isDev()
        }
    }
    return isDev
}
isDev = isDevelopment()

export const changeDark: () => void = () => {
    if (utools.isDarkColors()) {
        if (!S('body').hasClass('dark')) {
            S('body').addClass('dark')
        }
    } else {
        if (S('body').hasClass('dark')) {
            S('body').rmClass('dark')
        }
    }
}

export const initLanguage: (context?: Context) => void = context => {
    context = context ?? Context.get()
    if (context.languageSetting === 'auto') {
        if (!isNil(navigator.language) && !isEmpty(navigator.language)) {
            i18n.locale(navigator.language)
        }
    } else {
        i18n.locale(context.languageSetting)
    }
}

export const walker: (path: string, filter?: (fullPath: string, stat?: Stats) => boolean) => Array<string> = (path, filter) => {
    if (!existsSync(path) || !statSync(path).isDirectory()) {
        return []
    }
    let folders: Array<string> = [],
        files: Array<string> = []
    readdirSync(path)
        .map(p => join(path, p))
        .forEach(p => {
            try {
                let stat = statSync(p)
                if (isNil(filter) || !filter!(p, stat)) {
                    return
                }
                if (stat.isDirectory()) {
                    folders.push(p)
                } else if (stat.isFile()) {
                    files.push(p)
                } else {
                    return
                }
            } catch (e) {
                console.log(e)
                files.push(p)
            }
        })
    folders.forEach(p => files.push(...walker(p, filter)))
    return files
}

export interface PathAndTime {
    path: string
    datetime: number
}

export const listRegistry: (prefix: string, path: string) => Promise<Array<PathAndTime>> = (prefix, path) => new Promise<Array<PathAndTime>>((resolve, reject) => {
    new WinReg({ hive: prefix, key: path }).values((error, items) => {
        if (error) {
            console.log(error)
            resolve([])
        } else {
            resolve(items.map(item => {
                return {
                    path: item.name,
                    datetime: parseInt(item.value),
                }
            }))
        }
    })
})
