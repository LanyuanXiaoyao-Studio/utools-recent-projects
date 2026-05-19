import {Vscode1640ApplicationImpl, VscodeApplicationImpl} from '../../../src/parser/editor/Vscode'
import {Context} from '../../../src/Context'

test('vscodeProjectItems', async () => {
    let app = new VscodeApplicationImpl()
    ;(app as any).config = `${__dirname}/storage.json`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(4)
    expect(items[0].title).toEqual('notes')
    expect(items[1].title).toEqual('notes')
    expect(items[2].title).toEqual('notes-server')
    expect(items[3].title).toEqual('notes')
})

test('vscode1640ProjectItemsFromStorageJson', async () => {
    let app = new Vscode1640ApplicationImpl()
    ;(app as any).config = `${__dirname}/vscode-1640/state.vscdb`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(3)
    expect(items[0].title).toEqual('current-project')
    expect(items[1].title).toEqual('sample')
    expect(items[2].title).toEqual('README')
})
