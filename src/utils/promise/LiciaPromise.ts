import {every, some} from 'licia'

export async function everyAsync<T>(arr: Array<T>, fn: (item: T) => Promise<boolean>): Promise<boolean> {
    let results = await Promise.all<boolean>(arr.map(async item => await fn(item)))
    return every(results, r => r)
}

export async function someAsync<T>(arr: Array<T>, fn: (item: T) => Promise<boolean>): Promise<boolean> {
    let results = await Promise.all<boolean>(arr.map(async item => await fn(item)))
    return some(results, r => r)
}
