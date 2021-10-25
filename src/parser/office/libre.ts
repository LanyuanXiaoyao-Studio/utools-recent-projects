import {
    ApplicationConfigAndExecutorImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    Platform,
    ShellExecutor,
} from '../../types'
import {readFile} from 'fs/promises'
import {isEmpty, isNil, now, unique, Url} from 'licia'
import {Context} from '../../context'
import {existsOrNot, generateSearchKeyWithPinyin2, generateStringByOS} from '../../utils'
import {parse} from 'path'
import {i18n, sentenceKey} from '../../i18n'

const LIBRE: string = 'libre'

export class LibreOfficeProjectItemImpl extends DatetimeProjectItemImpl {}

export class LibreOfficeApplicationImpl extends ApplicationConfigAndExecutorImpl<LibreOfficeProjectItemImpl> {
    private isWindows: boolean = utools.isWindows()

    constructor() {
        super(
            LIBRE,
            'LibreOffice',
            'icon/libreoffice.png',
            LIBRE,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.office],
            () => `${i18n.t(sentenceKey.configFileAt)} ${generateStringByOS({
                win32: 'C:\\Users\\Administrator\\AppData\\Roaming\\LibreOffice\\4\\user\\registrymodifications.xcu',
                darwin: '/Users/xxx/Library/Application Support/LibreOffice/4/user/registrymodifications.xcu',
                linux: '/home/xxx/.config/LibreOffice/registrymodifications.xcu',
            })}, ${i18n.t(sentenceKey.executorFileAt)} ${generateStringByOS({
                win32: 'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
                darwin: '/Applications/LibreOffice.app/Contents/MacOS/soffice',
                linux: '/usr/bin/soffice',
            })}`,
            true,
            'registrymodifications.xcu',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<LibreOfficeProjectItemImpl>> {
        let items: Array<LibreOfficeProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let content = buffer.toString()
            let timestamp = now()
            let domParser = new DOMParser().parseFromString(content, 'application/xml')
            domParser.querySelectorAll(`item[oor\\:path*="OrderList"]`).forEach((element, index) => {
                let datetimeText = element.querySelector('node')?.getAttribute('oor:name') ?? ''
                let date = 0
                if (!isEmpty(datetimeText)) {
                    date = timestamp - parseInt(datetimeText)
                }
                let path = element.querySelector(`node prop[oor\\:name="HistoryItemRef"] value`)?.textContent ?? ''
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
                    searchKey: unique([...generateSearchKeyWithPinyin2(name), name, realPath]),
                    exists: exists,
                    command: new ShellExecutor(`"${this.executor}" "${path}"`),
                    datetime: date,
                })
            })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<LibreOfficeProjectItemImpl>> = [
    new LibreOfficeApplicationImpl(),
]
