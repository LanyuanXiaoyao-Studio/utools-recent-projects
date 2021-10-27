import {Context} from '../../Context'
import {isEmpty, isNil, Lru, unique} from 'licia'
import {pinyin as pinyinPro} from 'pinyin-pro'

// @ts-ignore
/*export const cartesian: (words: Array<Array<string>>) => Array<Array<string>> = words => {
    if (words.length === 0) return []
    if (words.length < 2) return words
    // @ts-ignore
    return words.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
}*/

/*export const pinyin: (text: string) => Array<string> = text => {
    // console.log(text)
    // @ts-ignore
    return unique(cartesian(pinyinLite(text).filter((p) => p.length > 0)).map((i) => i.join('')))
}*/

/**
 * 第一个版本的拼音索引生成, 实现方式虽有性能但有参考价值, 可灵活运用在其他地方, 保留在源码里, 以供参考
 * 拼音索引最大的问题是多音字, 这个实现方式是不使用词典和分词, 将中文里所有汉字的多音字做笛卡尔积
 * 这样就可以获得所有多音字的组合, 最大程度适配多音字索引, 但在长多音字文本里, 索引膨胀指数上升
 * 所以这种拼音索引方式较适用于已知文本的索引, 可以根据需要灵活调整文本长度, 对于用户输入的未知文本, 则可能遇到索引太大导致性能问题
 *
 * @param text 输入原始文本
 */
/*export const generateSearchKeyWithPinyin: (text: string) => Array<string> = text => {
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
}*/

// 正则表达式匹配至少一个中文
const chineseRegex = /[\u4e00-\u9fa5]+/g
const pinyinCache = new Lru(5000)

const generateSearchKeyWithPinyin2: (text: string) => Array<string> = text => {
    if (isNil(text) || isEmpty(text)) return []
    if (!chineseRegex.test(text)) return [text]
    let matches = text.match(chineseRegex) ?? [],
        results: Array<string> = []
    unique(matches).forEach(word => {
        if (pinyinCache.has(word)) {
            results.push(...pinyinCache.get(word))
        } else {
            let array = [
                pinyinPro(word, { toneType: 'none', type: 'array' }).join(''),
                pinyinPro(word, { pattern: 'first', toneType: 'none', type: 'array' }).join(''),
            ]
            results.push(...array)
            pinyinCache.set(word, array)
        }
    })
    return results
}

export const generatePinyinIndex: (context: Context, text: string) => Array<string> = (context, text) => {
    return generateSearchKeyWithPinyin2(text)
}
