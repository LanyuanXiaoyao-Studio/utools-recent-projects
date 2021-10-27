import {Platform} from '../src/Types'
import {platformFromUtools} from '../src/Utils'

test('get platform from utools', () => {
    expect<Platform>(platformFromUtools()).toEqual(Platform.darwin)
})
