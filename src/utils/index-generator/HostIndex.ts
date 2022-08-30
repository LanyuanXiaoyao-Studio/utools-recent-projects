import {Url} from 'licia'
import {Context} from '../../Context'

export const generateHostIndex: (context: Context, text: string) => Array<string> = (context, text) => {
    try {
        return [Url.parse(text).hostname]
    } catch (e) {
        return []
    }
}
