import {Context} from '../../../src/context'
import {VsStudioApplicationImpl} from '../../../src/parser/ide/vsStudio'

test('vsStudioProjectItems', async () => {
    let app = new VsStudioApplicationImpl('test', 'Test', '')
    app.config = `${__dirname}/ApplicationPrivateSettings.xml`

    let items = await app.generateProjectItems(Context.get())
    expect(items.length).toEqual(1)
})
