import {
    ApplicationConfigAndExecutorImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    NohupShellExecutor,
    Platform,
} from '../../types'
import {Context} from '../../context'
import {readFileSync} from 'fs'
import {isEmpty, strToBytes} from 'licia'
import {existsOrNot, generateStringByOS} from '../../utils'

const TYPORA: string = 'typora'

export class TyporaProjectItemImpl extends DatetimeProjectItemImpl {}

export class TyporaApplicationImpl extends ApplicationConfigAndExecutorImpl<TyporaProjectItemImpl> {
    constructor() {
        super(
            TYPORA,
            'Typora',
            'icon/typora.png',
            TYPORA,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
            `数据文件通常放在 ${generateStringByOS({
                win32: 'C:\\Users\\Administrator\\AppData\\Roaming\\Typora\\history.data',
                darwin: '/Users/xxx/Library/Application Support/Code/storage.json',
            })}, 可执行程序通常放在 ${generateStringByOS({
                win32: 'C:\\Program Files\\Typora\\Typora.exe',
                darwin: '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
            })}`,
            undefined,
            'history.data',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<TyporaProjectItemImpl>> {
        let items: Array<TyporaProjectItemImpl> = []
        let data = readFileSync(this.config, { encoding: 'utf8' })
        if (!isEmpty(data)) {
            data = Buffer.from(strToBytes(data, 'hex')).toString()
            if (!isEmpty(data)) {
                data = JSON.parse(data)
                let recentFiles = data?.['recentDocument'] ?? []
                let recentFolders = (data?.['recentFolder'] ?? []).map(i => {
                    let dateText = i?.['date'] ?? ''
                    if (!isEmpty(dateText)) {
                        let date = new Date(dateText)
                        i['date'] = date.getTime()
                    }
                    return i
                })
                let array = [...recentFiles, ...recentFolders]
                array.forEach(i => {
                    let path = i?.['path'] ?? ''
                    let { exists, description, icon } = existsOrNot(path, {
                        description: path,
                        icon: context.enableGetFileIcon ? utools.getFileIcon(path) : this.icon,
                    })
                    items.push({
                        id: '',
                        title: i?.['name'] ?? '',
                        description: description,
                        icon: icon,
                        searchKey: path,
                        exists: exists,
                        command: new NohupShellExecutor(this.executor, path),
                        datetime: i?.['date'] ?? 0,
                    })
                })
            }
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<TyporaProjectItemImpl>> = [
    new TyporaApplicationImpl(),
]
