import {existsSync, statSync} from 'fs'
import {stat} from 'fs/promises'
import {nonExistsToRead} from '../promise/FsPromise'

export const signCalculate: (path: string) => string = path => {
    if (!existsSync(path)) return ''
    let stat = statSync(path)
    return `${stat.size}${stat.mtimeMs}`
}

export const signCalculateAsync: (path: string) => Promise<string> = async path => {
    if (await nonExistsToRead(path)) return ''
    let info = await stat(path)
    return `${info.size}${info.mtimeMs}`
}
