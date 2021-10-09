import {Context} from '../../../src/context'
import {ObsidianApplicationImpl} from '../../../src/parser/editor/obsidian'

test('obsidianProjectItems', async () => {
    let app = new ObsidianApplicationImpl()
    app.config = `${__dirname}/obsidian.json`

    let items = await app.generateProjectItems(Context.get())
    console.log(items)
    expect(items.length).toEqual(3)
    expect(items[0].title).toEqual('Notes')
    expect(items[1].title).toEqual('help')
})
