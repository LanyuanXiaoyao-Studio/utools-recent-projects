import {toStr} from 'licia'
import {Context} from '../../Context'

export const infoNotify: (context: Context | undefined, message: any) => void = (context, message) => {
    console.log('[Info]', message)
    utools.showNotification(`[Info] ${toStr(message)}`)
}
export const warnNotify: (context: Context | undefined, message: any) => void = (context, message) => {
    console.warn('[Warn]', message)
    utools.showNotification(`[Warn] ${toStr(message)}`)
}
export const errorNotify: (context: Context | undefined, message: any) => void = (context, message) => {
    console.error('[Error]', message)
    utools.showNotification(`[Error] ${toStr(message)}`)
}
