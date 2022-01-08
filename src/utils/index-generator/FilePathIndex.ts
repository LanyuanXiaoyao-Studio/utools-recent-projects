import {Context} from '../../Context'

export const generateFilePathIndex: (context: Context, text: string) => Array<string> = (context, path) => {
    return context.enableFilePathInMatch ? [path] : []
}
