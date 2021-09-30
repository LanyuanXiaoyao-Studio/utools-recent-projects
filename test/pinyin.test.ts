import {textScore} from '../src/utils'
import {max, unique} from 'licia'

const pinyinLite = require('pinyinlite')

test('pinyin index', () => {
    let names = [
        '中山大学',
        '南京大学',
    ]
    let words = 'dx'
    let items = names
        .map(n => {
            return {
                name: n,
                search: [n, ...unique(
                    // @ts-ignore
                    cartesian(pinyinLite(n).filter(p => p.length > 0)).map(i => i.join(' '))
                )]
            }
        })
        .map(n => {
            return {
                ...n,
                score: max(...(n.search.map(p => textScore(p, words)))),
            }
        })
    console.log(JSON.stringify(items))
})

const cartesian: (words: Array<Array<string>>) => Array<string> = words => {
    if (words.length === 0) return []
    if (words.length < 2) return words[0]
    // @ts-ignore
    return words.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
}

const cartesianSelf: (words: Array<string>) => Array<string> = words => {
    return cartesian([words, words])
}

test('cartesian', () => {
    console.log(cartesianSelf(['1', '2', '3']))
})
