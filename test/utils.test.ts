import {Platform} from '../src/types'
import {platformFromUtools} from '../src/utils'

test('get platform from utools', () => {
    expect<Platform>(platformFromUtools()).toEqual(Platform.darwin)
})
