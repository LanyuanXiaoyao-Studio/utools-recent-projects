import {
    ApplicationConfigAndExecutorImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    Platform,
    ShellExecutor,
} from '../../types'
import {Context} from '../../context'
import {readFileSync} from 'fs'
import {isEmpty, strToBytes} from 'licia'
import {existsOrNot} from '../../utils'

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
            undefined,
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
                        command: new ShellExecutor(''),
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
