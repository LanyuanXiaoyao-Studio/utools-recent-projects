import {toStr} from 'licia'
import {Context} from '../../Context'

export const infoNotify: (context: Context, message: any) => void = (context, message) => utools.showNotification(`[Info] ${toStr(message)}`)
export const warnNotify: (context: Context, message: any) => void = (context, message) => utools.showNotification(`[Warn] ${toStr(message)}`)
export const errorNotify: (context: Context, message: any) => void = (context, message) => utools.showNotification(`[Error] ${toStr(message)}`)
