import {Context} from '../../Context'
import {Url} from 'licia'

export const generateHostIndex: (context: Context, text: string) => Array<string> = (context, text) => {
    try {
        return [Url.parse(text).hostname]
    } catch (e) {
        return []
    }
}
