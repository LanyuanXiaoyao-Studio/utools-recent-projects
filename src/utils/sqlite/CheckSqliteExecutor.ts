import {Context} from '../../Context'
import {isEmpty} from 'licia'

export const isEmptySqliteExecutor: (context: Context, executor: string) => boolean = (context, executor) => {
    return isEmpty(context.sqliteExecutorPath) && isEmpty(executor)
}

export const getSqliteExecutor: (context: Context, executor: string) => string = (context, executor) => {
    return isEmpty(executor) ? isEmpty(context.sqliteExecutorPath) ? '' : context.sqliteExecutorPath : executor
}
