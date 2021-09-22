import {WpsLinuxInternationalApplicationImpl} from '../../../../src/parser/office/wps'
import {Context} from '../../../../src/context'

test('get project items', async () => {
    let app = new WpsLinuxInternationalApplicationImpl()
    app.config = `${__dirname}/Office.conf`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(3)
    let titles = items.map(i => i.title)
    expect(titles).toContainEqual("hello world")
    expect(titles).toContainEqual('TTitle')
    expect(titles).toContainEqual('hello world')
})
