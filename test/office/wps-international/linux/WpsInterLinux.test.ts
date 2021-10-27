import {WpsLinuxInternationalApplicationImpl} from '../../../../src/parser/office/Wps'
import {Context} from '../../../../src/Context'

test('wpsLinuxProjectItems', async () => {
    let app = new WpsLinuxInternationalApplicationImpl()
    app.config = `${__dirname}/Office.conf`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(3)
    let titles = items.map(i => i.title)
    expect(titles).toContainEqual('hello world')
    expect(titles).toContainEqual('TTitle')
    expect(titles).toContainEqual('hello world')
})
