import {
    ApplicationConfigAndExecutorImpl,
    ApplicationImpl,
    Group,
    GroupName,
    Platform,
    ProjectItemImpl,
    SettingItem,
    ShellExecutor,
    SwitchSettingItem,
} from '../../Types'
import {readFile} from 'fs/promises'
import {isEmpty, isNil, startWith, unique, Url} from 'licia'
import {parse} from 'path'
import {existsOrNot, generateStringByOS} from '../../Utils'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const VSCODE: string = 'vscode'

export class VscodeProjectItemImpl extends ProjectItemImpl {}

export class VscodeApplicationImpl extends ApplicationConfigAndExecutorImpl<VscodeProjectItemImpl> {
    openInNew: boolean = false
    private isWindows: boolean = utools.isWindows()

    constructor() {
        super(
            VSCODE,
            'Visual Studio Code',
            'icon/ms-visual-studio-code.png',
            VSCODE,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
            () => `${i18n.t(sentenceKey.configFileAt)} ${generateStringByOS({
                win32: 'C:\\Users\\Administrator\\AppData\\Roaming\\Code\\storage.json',
                darwin: '/Users/xxx/Library/Application Support/Code/storage.json',
                linux: '/home/xxx/.config/Code/storage.json',
            })}, ${i18n.t(sentenceKey.executorFileAt)} ${generateStringByOS({
                win32: 'C:\\Users\\Administrator\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
                darwin: '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
                linux: '(不同发行版安装路径差异较大, 自行使用 which 命令找到 code 命令所在路径作为可执行文件路径)',
            })}`,
            undefined,
            'storage.json',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<VscodeProjectItemImpl>> {
        let items: Array<VscodeProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let content = buffer.toString()
            let storage = JSON.parse(content)
            let entries = storage?.openedPathsList?.entries
            if (!isNil(entries)) {
                let args = this.openInNew ? '-n' : ''
                for (let element of entries) {
                    let folderUri = element['folderUri'],
                        fileUri = element['fileUri'],
                        label = element['label'],
                        workspace = element['workspace'],
                        uri
                    if (!isEmpty(folderUri)) {
                        uri = folderUri
                    } else if (!isEmpty(fileUri)) {
                        uri = fileUri
                    } else if (!isNil(workspace)) {
                        let configPath = workspace['configPath'] ?? ''
                        if (!isEmpty(configPath)) {
                            uri = configPath
                        } else {
                            continue
                        }
                    } else {
                        continue
                    }
                    let uriParsed = decodeURIComponent(uri)
                    let urlParsed = Url.parse(uriParsed)
                    let path = urlParsed.pathname
                    if (this.isWindows) {
                        path = path.substring(1)
                    }
                    let parser = parse(path)
                    let { exists, description, icon } = existsOrNot(path, {
                        description: path,
                        icon: context.enableGetFileIcon ? utools.getFileIcon(path) : this.icon,
                    })

                    // 对 remote folder 进行处理
                    if (startWith(uri, 'vscode-remote')) {
                        exists = true
                        description = label
                    }

                    items.push({
                        id: '',
                        title: parser.name,
                        description: description,
                        icon: icon,
                        searchKey: unique([...generatePinyinIndex(context, path), path]),
                        exists: exists,
                        command: new ShellExecutor(`"${this.executor}" ${args} "${path}"`),
                    })
                }
            }
        }
        return items
    }

    openInNewId(nativeId: string) {
        return `${nativeId}/${this.id}-open-in-new`
    }

    override update(nativeId: string) {
        super.update(nativeId)
        this.openInNew = utools.dbStorage.getItem(this.openInNewId(nativeId)) ?? false
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        let superSettings = super.generateSettingItems(context, nativeId)
        superSettings.splice(1, 0, new SwitchSettingItem(
            this.openInNewId(nativeId),
            i18n.t(sentenceKey.openInNew),
            this.openInNew,
            i18n.t(sentenceKey.openInNewDesc),
        ))
        return superSettings
    }
}

export const applications: Array<ApplicationImpl<VscodeProjectItemImpl>> = [
    new VscodeApplicationImpl(),
]
