import {
    ApplicationCacheConfigAndExecutorImpl,
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
import {existsOrNot, generateStringByOS, systemUser} from '../../Utils'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'
import {generateFilePathIndex} from '../../utils/index-generator/FilePathIndex'
import {queryFromSqlite} from '../../utils/sqlite/SqliteExecutor'

const VSCODE: string = 'vscode'
const VSCODE_1640: string = 'vscode-1640'

export class VscodeProjectItemImpl extends ProjectItemImpl {}

const parseEntries: (entries: any, context: Context, openInNew: boolean, isWindows: boolean, icon: string, executor: string) => Array<VscodeProjectItemImpl> = (entries, context, openInNew, isWindows, defaultIcon, executor: string) => {
    let items: Array<VscodeProjectItemImpl> = []
    if (!isNil(entries)) {
        let args = openInNew ? '-n' : ''
        for (let element of entries) {
            let folderUri = element['folderUri'],
                fileUri = element['fileUri'],
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
            if (isWindows) {
                path = path.substring(1)
            }
            let parser = parse(path)
            let { exists, description, icon } = existsOrNot(path, {
                description: path,
                icon: context.enableGetFileIcon ? utools.getFileIcon(path) : defaultIcon,
            })

            let commandText = `"${executor}" ${args} "${path}"`

            // ??? remote folder ????????????
            if (startWith(uri, 'vscode-remote')) {
                let label = element['label'] ?? uriParsed
                exists = true
                description = label
                commandText = `"${executor}" --folder-uri "${uriParsed}"`
            }

            items.push({
                id: '',
                title: parser.name,
                description: description,
                icon: icon,
                searchKey: unique([
                    ...generatePinyinIndex(context, parser.name),
                    ...generateFilePathIndex(context, path),
                    parser.name,
                ]),
                exists: exists,
                command: new ShellExecutor(commandText),
            })
        }
    }
    return items
}

export class VscodeApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<VscodeProjectItemImpl> {
    openInNew: boolean = false
    private isWindows: boolean = utools.isWindows()

    constructor() {
        super(
            VSCODE,
            'Visual Studio Code (< 1.64.0)',
            'icon/ms-visual-studio-code.png',
            VSCODE,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
            () => `1.64.0 ??????????????????????????????????????????, ${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, ${i18n.t(sentenceKey.executorFileAt)} ${this.defaultExecutorPath()}`,
            undefined,
            'storage.json',
        )
    }

    override defaultConfigPath(): string {
        return generateStringByOS({
            win32: `C:\\Users\\${systemUser()}\\AppData\\Roaming\\Code\\storage.json`,
            darwin: `/Users/${systemUser()}/Library/Application Support/Code/storage.json`,
            linux: `/home/${systemUser()}/.config/Code/storage.json`,
        })
    }

    override defaultExecutorPath(): string {
        return generateStringByOS({
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe`,
            darwin: '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
            linux: '(???????????????????????????????????????, ???????????? which ???????????? code ?????????????????????????????????????????????)',
        })
    }

    async generateCacheProjectItems(context: Context): Promise<Array<VscodeProjectItemImpl>> {
        let items: Array<VscodeProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let content = buffer.toString()
            let storage = JSON.parse(content)
            let entries = storage?.openedPathsList?.entries
            items.push(...parseEntries(entries, context, this.openInNew, this.isWindows, this.icon, this.executor))
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
        superSettings.splice(0, 0, new SwitchSettingItem(
            this.openInNewId(nativeId),
            i18n.t(sentenceKey.openInNew),
            this.openInNew,
            i18n.t(sentenceKey.openInNewDesc),
        ))
        return superSettings
    }
}

export class Vscode1640ApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<VscodeProjectItemImpl> {
    openInNew: boolean = false
    private isWindows: boolean = utools.isWindows()

    constructor() {
        super(
            VSCODE_1640,
            'Visual Studio Code',
            'icon/ms-visual-studio-code.png',
            VSCODE_1640,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, ${i18n.t(sentenceKey.executorFileAt)} ${this.defaultExecutorPath()}`,
            undefined,
            'state.vscdb',
        )
    }

    override defaultConfigPath(): string {
        return generateStringByOS({
            win32: `C:\\Users\\${systemUser()}\\AppData\\Roaming\\Code\\User\\globalStorage\\state.vscdb`,
            darwin: `/Users/${systemUser()}/Library/Application Support/Code/User/globalStorage/state.vscdb`,
            linux: `/home/${systemUser()}/.config/Code/User/globalStorage/state.vscdb`,
        })
    }

    override defaultExecutorPath(): string {
        return generateStringByOS({
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe`,
            darwin: '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
            linux: '(???????????????????????????????????????, ???????????? which ???????????? code ?????????????????????????????????????????????)',
        })
    }

    async generateCacheProjectItems(context: Context): Promise<Array<VscodeProjectItemImpl>> {
        // language=SQLite
        let results = await queryFromSqlite(this.config, 'select value as result from ItemTable where key = \'history.recentlyOpenedPathsList\'')
        if (!isEmpty(results)) {
            let row = results[0]
            let source = row['result'] as string
            if (!isEmpty(source)) {
                return parseEntries(JSON.parse(source)['entries'], context, this.openInNew, this.isWindows, this.icon, this.executor)
            }
        }
        return []
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
        superSettings.splice(0, 0, new SwitchSettingItem(
            this.openInNewId(nativeId),
            i18n.t(sentenceKey.openInNew),
            this.openInNew,
            i18n.t(sentenceKey.openInNewDesc),
        ))
        return superSettings
    }
}

export const applications: Array<ApplicationImpl<VscodeProjectItemImpl>> = [
    new Vscode1640ApplicationImpl(),
    new VscodeApplicationImpl(),
]
