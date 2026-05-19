import {readFileSync} from 'fs'
import {isEmpty, isNil} from 'licia'
import sqlInit, {Database, Statement} from 'sql.js'

let SQL

export const queryFromSqlite: (databaseFilePath: string, sql: string) => Promise<Array<any>> = async (databaseFilePath, sql) => {
    if (isEmpty(databaseFilePath)) return []
    if (isNil(SQL)) {
        let wasmBuffer = readFileSync(require.resolve('sql.js/dist/sql-wasm.wasm'))
        let wasmBinary = wasmBuffer.buffer.slice(wasmBuffer.byteOffset, wasmBuffer.byteOffset + wasmBuffer.byteLength)
        SQL = await sqlInit({wasmBinary})
    }
    let database: Database | undefined, statement: Statement | undefined
    try {
        database = new SQL.Database(readFileSync(databaseFilePath))
        statement = database!.prepare(sql)
        let result: Array<any> = []
        while (statement.step()) {
            result.push(statement.getAsObject())
        }
        return result
    } finally {
        if (!isNil(statement))
            statement!.free()
        if (!isNil(database))
            database!.close()
    }
    return []
}
