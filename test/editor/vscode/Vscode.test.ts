import {VscodeApplicationImpl} from '../../../src/parser/editor/Vscode'
import {Context} from '../../../src/Context'

test('vscodeProjectItems', async () => {
    let app = new VscodeApplicationImpl()
    app.config = `${__dirname}/storage.json`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(4)
    expect(items[0].title).toEqual('notes')
    expect(items[1].title).toEqual('notes')
    expect(items[2].title).toEqual('notes-server')
    expect(items[3].title).toEqual('notes')
})
