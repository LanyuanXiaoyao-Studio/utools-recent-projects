import {Platform} from '../src/types'
import {cartesian, generateSearchKeyWithPinyin, pinyin, platformFromUtools} from '../src/utils'
import {levenshtein} from 'string-comparison'

test('get platform from utools', () => {
    expect<Platform>(platformFromUtools()).toEqual(Platform.darwin)
})

test('cartesian', () => {
    let result = cartesian([
        ['1', '2'],
        ['3', '4'],
    ])
    expect<Array<Array<string>>>(result).toEqual([['1', '3'], ['1', '4'], ['2', '3'], ['2', '4']])
    expect<Array<string>>(pinyin('网络')).toEqual(['wanglao', 'wangluo'])
    expect<Array<string>>(generateSearchKeyWithPinyin('数据结构自考网站首页')).toEqual(['shujujiegouzikaowangzhanshouye', 'shuojujiegouzikaowangzhanshouye'])
    console.log(levenshtein('shujujiegouzikaowangzhanshouye', 'sjjgzkwzsy'))
    console.log(levenshtein('shujujiegouzikaowangzhanshouye', 'sjjg'))
    console.log(levenshtein('shujujiegouzikaowangzhanshouye', 'shuju'))
    console.log(levenshtein('shujujiegouzikaowangzhanshouye', 'shujujiegouzikaowangzhanshouye'))
    console.log(levenshtein('shujujiegouzikaowangzhanshouye', 'xy'))
})
