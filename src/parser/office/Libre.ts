import {readFile} from 'fs/promises'
import {isEmpty, isNil, now, unique, Url} from 'licia'
import {parse} from 'path'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    Platform,
    SettingProperties,
    ShellExecutor,
} from '../../Types'
import {configExtensionFilter, existsOrNot, generateStringByOS, systemUser} from '../../Utils'
import {generateFilePathIndex} from '../../utils/index-generator/FilePathIndex'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const LIBRE: string = 'libre'

export class LibreOfficeProjectItemImpl extends DatetimeProjectItemImpl {}

export class LibreOfficeApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<LibreOfficeProjectItemImpl> {
    private isWindows: boolean = utools.isWindows()

    constructor() {
        super(
            LIBRE,
            'LibreOffice',
            'icon/libreoffice.png',
            LIBRE,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.office],
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, ${i18n.t(sentenceKey.executorFileAt)} ${this.defaultExecutorPath()}`,
            true,
            'registrymodifications.xcu',
        )
    }

    override defaultConfigPath(): string {
        return generateStringByOS({
            win32: `C:\\Users\\${systemUser()}\\AppData\\Roaming\\LibreOffice\\4\\user\\registrymodifications.xcu`,
            darwin: `/Users/${systemUser()}/Library/Application Support/LibreOffice/4/user/registrymodifications.xcu`,
            linux: `/home/${systemUser()}/.config/LibreOffice/registrymodifications.xcu`,
        })
    }

    override defaultExecutorPath(): string {
        return generateStringByOS({
            win32: `C:\\Program Files\\LibreOffice\\program\\soffice.exe`,
            darwin: `/Applications/LibreOffice.app/Contents/MacOS/soffice`,
            linux: `/usr/bin/soffice`,
        })
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: configExtensionFilter('xcu'),
        }
    }

    async generateCacheProjectItems(context: Context): Promise<Array<LibreOfficeProjectItemImpl>> {
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
                    searchKey: unique([
                        ...generatePinyinIndex(context, name),
                        ...generateFilePathIndex(context, realPath),
                        name,
                    ]),
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
