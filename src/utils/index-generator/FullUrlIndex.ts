import {Context} from '../../Context'

export const generateFullUrlIndex: (context: Context, text: string) => Array<string> = (context, url) => {
    return context.enableFullUrlInMatch ? [url] : []
}
