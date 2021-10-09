import {existsSync} from 'fs'
import {Platform} from './types'
import {isEmpty, isFn, isNil, isUrl, unique, Url} from 'licia'
import {Context} from './context'
import {i18n, sentenceKey} from './i18n'
import {levenshtein} from 'string-comparison'
import pinyinLite = require('pinyinlite')
import $ = require('licia/$')

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

export const removeAllQueryFromUrl: (url: string) => string = url => {
    try {
        if (!isUrl(url)) {
            return url
        }
        let parser = Url.parse(url)
        return `${parser.protocol}//${parser.hostname}${isEmpty(parser.port) ? '' : `:${parser.port}`}`
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
    if (isNil(isDev)) {
        isDev = !/[a-zA-Z0-9\-]+\.asar/.test(__dirname)
    }
    return isDev
}
isDev = isDevelopment()

export const changeDark: () => void = () => {
    if (utools.isDarkColors()) {
        if (!$('body').hasClass('dark')) {
            $('body').addClass('dark')
        }
    } else {
        if ($('body').hasClass('dark')) {
            $('body').rmClass('dark')
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

// @ts-ignore
export const cartesian: (words: Array<Array<string>>) => Array<Array<string>> = words => {
    if (words.length === 0) return []
    if (words.length < 2) return words
    // @ts-ignore
    return words.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
}

export const pinyin: (text: string) => Array<string> = text => {
    // console.log(text)
    // @ts-ignore
    return unique(cartesian(pinyinLite(text).filter((p) => p.length > 0)).map((i) => i.join('')))
}

export const score: (a: string, b: string) => number = (a, b) => levenshtein.similarity(a, b)

export const generateSearchKeyWithPinyin: (text: string) => Array<string> = text => {
    if (isNil(text) || isEmpty(text)) return []
    let results: Array<string> = [],
        length = text.length,
        start = 0,
        regex = /^[\u4e00-\u9fa5]+$/,
        last = regex.test(text[0])
    for (let index = 0; index < length; index++) {
        if (index === length - 1) {
            let cutting = text.substring(start, length).trim()
            if (last) {
                results.push(...pinyin(cutting))
            } else {
                results.push(cutting)
            }
        } else {
            if (last !== regex.test(text[index].trim())) {
                let cutting = text.substring(start, index).trim()
                if (last) {
                    results.push(...pinyin(cutting))
                } else {
                    results.push(cutting)
                }
                start = index
                last = !last
            }
        }
    }
    return results
}
