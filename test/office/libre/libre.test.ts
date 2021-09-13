import {LibreOfficeApplicationImpl} from '../../../src/parser/office/libre'
import {Context} from '../../../src/context'

test('get project items', async () => {
    document.body.innerHTML = '<div id="root"></div>'

    let app = new LibreOfficeApplicationImpl()
    app.config = `${__dirname}/registrymodifications.xcu`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(6)
    expect(items[2].title).toEqual('Mess')
    expect(items[4].title).toEqual('father')
    expect(items[5].title).toEqual('gongshi')
})
