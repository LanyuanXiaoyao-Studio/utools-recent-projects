import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    NohupShellExecutor,
    Platform,
} from '../../Types'
import {Context} from '../../Context'
import {readFileSync} from 'fs'
import {isEmpty, strToBytes, unique} from 'licia'
import {existsOrNot, generateStringByOS, systemUser} from '../../Utils'
import {i18n, sentenceKey} from '../../i18n'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const TYPORA: string = 'typora'

export class TyporaProjectItemImpl extends DatetimeProjectItemImpl {}

export class TyporaApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<TyporaProjectItemImpl> {
    constructor() {
        super(
            TYPORA,
            'Typora',
            'icon/typora.png',
            TYPORA,
            [Platform.win32, Platform.linux],
            Group[GroupName.editor],
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, ${i18n.t(sentenceKey.executorFileAt)} ${this.defaultExecutorPath()}`,
            undefined,
            'history.data',
        )
    }

    override defaultConfigPath(): string {
        return generateStringByOS({
            win32: `C:\\Users\\${systemUser()}\\AppData\\Roaming\\Typora\\history.data`,
            linux: `/home/${systemUser()}/.config/Typora/history.data`,
        })
    }

    override defaultExecutorPath(): string {
        return generateStringByOS({
            win32: 'C:\\Program Files\\Typora\\Typora.exe',
            linux: '(不同发行版安装路径差异较大, 自行使用 which 命令找到 typora 命令所在路径作为可执行文件路径)',
        })
    }

    async generateCacheProjectItems(context: Context): Promise<Array<TyporaProjectItemImpl>> {
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
                        searchKey: unique([
                            ...generatePinyinIndex(context, path), path,
                        ]),
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
