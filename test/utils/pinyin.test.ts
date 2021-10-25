import {pinyin} from 'pinyin-pro'

test('pinyin', () => {
    let start = new Date().getTime()
    let result = pinyin('hello主角主角主角主角主角主角主角', { toneType: 'none', type: 'array' }).join('')
    let end = new Date().getTime()
    console.log(end - start, result)
})
