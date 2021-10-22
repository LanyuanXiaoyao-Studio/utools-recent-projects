import {LibreOfficeApplicationImpl} from '../../../src/parser/office/libre'
import {Context} from '../../../src/context'

test('libraProjectItems', async () => {
    let app = new LibreOfficeApplicationImpl()
    app.config = `${__dirname}/registrymodifications.xcu`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(6)
    expect(items.map(i => i.title)).toContainEqual('新建数据库')
    expect(items.map(i => i.title)).toContainEqual('gongshi')
    expect(items.map(i => i.title)).toContainEqual('Mess')
    expect(items.map(i => i.title)).toContainEqual('father')
    expect(items.map(i => i.title)).toContainEqual('Mother')
    expect(items.map(i => i.title)).toContainEqual('Hello')
})
