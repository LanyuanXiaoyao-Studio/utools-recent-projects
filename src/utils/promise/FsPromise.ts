import {constants} from 'fs'
import {access} from 'fs/promises'

export async function existsToRead(path: string) {
    try {
        await access(path, constants.F_OK | constants.R_OK)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function nonExistsToRead(path: string) {
    return !(await existsToRead(path))
}
