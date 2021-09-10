import {
    ApplicationConfigImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    Platform,
    UtoolsExecutor,
} from '../../types'
import { readFile } from 'fs/promises'
import { isEmpty, isNil, Url } from 'licia'
import { Context } from '../../context'
import { existsOrNot } from '../../utils'
import { parse } from 'path'
import $ = require('licia/$')

const LIBRE: string = 'libre'

export class LibreOfficeProjectItemImpl extends DatetimeProjectItemImpl { }

export class LibreOfficeApplicationImpl extends ApplicationConfigImpl<LibreOfficeProjectItemImpl> {
    private isWindows: boolean = utools.isWindows()

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
            let now = new Date().getTime()
            $('#root').append(`<div id=${this.id} style="display: none">${content}</div>`)
            $(`#${this.id} item[oor\\:path*="OrderList"]`).each((index, element) => {
                let root = $(element)
                let datetimeText = root.find('node').attr('oor:name')
                let date = 0
                if (!isEmpty(datetimeText)) {
                    date = now - parseInt(datetimeText)
                }
                let path = root.find('node prop[oor\\:name="HistoryItemRef"] value').text()
                let url = Url.parse(path)
                let realPath = decodeURI(url.pathname)
                if (this.isWindows) {
                    realPath = realPath.substring(1)
                }
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
                    command: new UtoolsExecutor(path),
                    datetime: date,
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
