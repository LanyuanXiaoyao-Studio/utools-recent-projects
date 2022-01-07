import {Context} from '../../Context'
import {isEmpty} from 'licia'

export const isEmptySqliteExecutor: (context: Context, executor: string) => boolean = (context, executor) => {
    return isEmpty(context.sqliteExecutorPath) && isEmpty(executor)
}
