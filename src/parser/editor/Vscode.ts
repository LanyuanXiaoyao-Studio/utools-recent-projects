import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationConfigState,
    ApplicationImpl,
    Group,
    GroupName,
    InputSettingItem,
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
import {getSqliteExecutor, isEmptySqliteExecutor} from '../../utils/sqlite/CheckSqliteExecutor'
import {execFileSync} from 'child_process'
import {parseSqliteDefaultResult} from '../../utils/sqlite/ParseResult'

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

            // 对 remote folder 进行处理
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
            () => `1.64.0 版本之前的旧版本需要单独配置, ${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, ${i18n.t(sentenceKey.executorFileAt)} ${this.defaultExecutorPath()}`,
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
            linux: '(不同发行版安装路径差异较大, 自行使用 which 命令找到 code 命令所在路径作为可执行文件路径)',
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
    sqliteExecutor: string = ''
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
            linux: '(不同发行版安装路径差异较大, 自行使用 which 命令找到 code 命令所在路径作为可执行文件路径)',
        })
    }

    async generateCacheProjectItems(context: Context): Promise<Array<VscodeProjectItemImpl>> {
        if (isEmptySqliteExecutor(context, this.sqliteExecutor)) throw new Error(`无法找到 Sqlite3 可执行文件`)
        // language=SQLite
        let sql = 'select value as result from ItemTable where key = \'history.recentlyOpenedPathsList\''
        let result = execFileSync(getSqliteExecutor(context, this.sqliteExecutor), [this.config, sql, '-readonly'], {
            encoding: 'utf-8',
            maxBuffer: 20971520,
            windowsHide: true,
        })
        if (!isEmpty(result)) {
            let array = parseSqliteDefaultResult(result, ['result'])
            if (!isNil(array) && !isEmpty(array)) {
                let object = JSON.parse(array[0]['result'])
                return parseEntries(object['entries'], context, this.openInNew, this.isWindows, this.icon, this.executor)
            }
        }
        return []
    }

    openInNewId(nativeId: string) {
        return `${nativeId}/${this.id}-open-in-new`
    }

    sqliteExecutorId(nativeId: string) {
        return `${nativeId}/${this.id}-sqlite3-executor`
    }

    override update(nativeId: string) {
        super.update(nativeId)
        this.openInNew = utools.dbStorage.getItem(this.openInNewId(nativeId)) ?? false
        this.sqliteExecutor = utools.dbStorage.getItem(this.sqliteExecutorId(nativeId)) ?? ''
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        let superSettings = super.generateSettingItems(context, nativeId)
        superSettings.splice(0, 0, new SwitchSettingItem(
            this.openInNewId(nativeId),
            i18n.t(sentenceKey.openInNew),
            this.openInNew,
            i18n.t(sentenceKey.openInNewDesc),
        ))
        superSettings.splice(2, 0, new InputSettingItem(
            this.sqliteExecutorId(nativeId),
            i18n.t(sentenceKey.sqlite3),
            this.sqliteExecutor,
            i18n.t(sentenceKey.sqlite3Desc),
        ))
        return superSettings
    }

    override isFinishConfig(context: Context): ApplicationConfigState {
        if (this.disEnable())
            return ApplicationConfigState.empty
        if (isEmpty(this.config) || isEmpty(this.executor) || (isEmpty(this.sqliteExecutor) && isEmpty(context.sqliteExecutorPath))) {
            return ApplicationConfigState.undone
        } else if (this.nonExistsPath(this.config) || this.nonExistsPath(this.executor) || (this.nonExistsPath(this.sqliteExecutor) && this.nonExistsPath(context.sqliteExecutorPath))) {
            return ApplicationConfigState.error
        } else {
            return ApplicationConfigState.done
        }
    }
}

export const applications: Array<ApplicationImpl<VscodeProjectItemImpl>> = [
    new Vscode1640ApplicationImpl(),
    new VscodeApplicationImpl(),
]
