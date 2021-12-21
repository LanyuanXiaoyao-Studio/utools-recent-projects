import {Context} from '../../../src/Context'
import {ObsidianApplicationImpl} from '../../../src/parser/notes/Obsidian'

test('obsidianProjectItems', async () => {
    let app = new ObsidianApplicationImpl()
    app.config = `${__dirname}/obsidian.json`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(3)
    expect(items[0].title).toEqual('Notes')
    expect(items[1].title).toEqual('help')
})
