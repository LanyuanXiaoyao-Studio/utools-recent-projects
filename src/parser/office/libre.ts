import {
    ApplicationConfigImpl,
    ApplicationImpl,
    Group,
    GroupName,
    Platform,
    ProjectItemImpl,
    ShellExecutor,
} from '../../types'
import {readFile} from 'fs/promises'
import {isNil, Url} from 'licia'
import {Context} from '../../context'
import {existsOrNot} from '../../utils'
import {parse} from 'path'
import $ = require('licia/$')

const LIBRE: string = 'libre'

export class LibreOfficeProjectItemImpl extends ProjectItemImpl {}

export class LibreOfficeApplicationImpl extends ApplicationConfigImpl<LibreOfficeProjectItemImpl> {
    constructor() {
        super(
            LIBRE,
            'LibreOffice',
            'icon/libreoffice.png',
            LIBRE,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.office],
            undefined,
            true,
            'registrymodifications.xcu',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<LibreOfficeProjectItemImpl>> {
        let items: Array<LibreOfficeProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let content = buffer.toString()
            $('#root').append(`<div id=${this.id} style="display: none">${content}</div>`)
            $(`#${this.id} item[oor\\:path*="ItemList"]`).each((index, element) => {
                let root = $(element)
                let path = root.find('node').attr('oor:name')
                let url = Url.parse(path)
                let realPath = decodeURI(url.pathname)
                let parser = parse(decodeURI(url.pathname))
                let name = parser.name
                let { exists, description, icon } = existsOrNot(realPath, {
                    description: realPath,
                    icon: context.enableGetFileIcon ? utools.getFileIcon(realPath) : this.icon,
                })
                items.push({
                    id: '',
                    title: name,
                    description: description,
                    icon: icon,
                    searchKey: realPath,
                    exists: exists,
                    command: new ShellExecutor(''),
                })
            })
            $(`#${this.id}`).remove()
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<LibreOfficeProjectItemImpl>> = [
    new LibreOfficeApplicationImpl(),
]
