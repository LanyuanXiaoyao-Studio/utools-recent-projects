import {Context} from '../../../src/context'
import {JetBrainsApplicationImpl} from '../../../src/parser/ide/jetBrains'

test('jetBrainsProjectItems', async () => {
    let app = new JetBrainsApplicationImpl('test', 'Test', '')
    app.config = `${__dirname}/recentProjects.xml`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(3)
    expect(items[0].title).toEqual('test1')
    expect(items[1].title).toEqual('test2')
    expect(items[2].title).toEqual('test3')
})
