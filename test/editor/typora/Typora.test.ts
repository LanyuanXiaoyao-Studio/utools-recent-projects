import {TyporaApplicationImpl} from '../../../src/parser/editor/Typora'
import {Context} from '../../../src/Context'

test('typoraProjectItems', async () => {
    let app = new TyporaApplicationImpl()
    app.config = `${__dirname}/history.data`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(4)
    expect(items[0].title).toEqual('Hello Everybody.md')
    expect(items[1].title).toEqual('Markdown Reference.md')
    expect(items[2].title).toEqual('Quick Start.md')
    expect(items[3].title).toEqual('文档')
})
