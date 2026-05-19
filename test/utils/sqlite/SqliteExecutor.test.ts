test('queryFromSqlite loads wasm in renderer process', async () => {
    let originProcessType = (process as any).type
    Object.defineProperty(process, 'type', {value: 'renderer', configurable: true})
    jest.resetModules()

    try {
        let {queryFromSqlite} = await import('../../../src/utils/sqlite/SqliteExecutor')
        let rows = await queryFromSqlite(`${__dirname}/../../editor/vscode/vscode-1640/state.vscdb`, 'select count(*) as total from sqlite_master')

        expect(rows).toHaveLength(1)
        expect(rows[0].total).toBeGreaterThan(0)
    } finally {
        if (originProcessType === undefined || originProcessType === null) {
            delete (process as any).type
        } else {
            Object.defineProperty(process, 'type', {value: originProcessType, configurable: true})
        }
        jest.resetModules()
    }
})
