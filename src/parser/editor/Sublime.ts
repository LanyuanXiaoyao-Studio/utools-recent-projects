import {readFile} from 'fs/promises'
import {isNil, unique} from 'licia'
import {parse} from 'path'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationImpl,
    GROUP_EDITOR,
    PLATFORM_ALL,
    ProjectItemImpl,
    SettingItem,
    SettingProperties,
    ShellExecutor,
    SwitchSettingItem,
} from '../../Types'
import {configExtensionFilter, existsOrNot, generateStringByOS, systemUser} from '../../Utils'
import {generateFilePathIndex} from '../../utils/index-generator/FilePathIndex'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const SUBLIME: string = 'sublime'

export class SublimeProjectItemImpl extends ProjectItemImpl {}

export class SublimeApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<SublimeProjectItemImpl> {
    openInNew: boolean = false

    constructor() {
        super(
            SUBLIME,
            'Sublime Text',
            'https://www.sublimetext.com/',
            'icon/sublime.png',
            SUBLIME,
            PLATFORM_ALL,
            GROUP_EDITOR,
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, ${i18n.t(sentenceKey.executorFileAt)} ${this.defaultExecutorPath()} (注意 Sublime Text 单独提供了命令行程序, 不是程序本体)`,
            undefined,
            'Session.sublime_session',
        )
    }

    override defaultConfigPath(): string {
        return generateStringByOS({
            win32: `C:\\Users\\${systemUser()}\\AppData\\Roaming\\Sublime Text 3\\Local\\Session.sublime_session`,
            darwin: `/Users/${systemUser()}/Library/Application Support/Sublime Text/Local/Session.sublime_session`,
            linux: `/home/${systemUser()}/.config/sublime-text/Local/Session.sublime_session`,
        })
    }

    override defaultExecutorPath(): string {
        return generateStringByOS({
            win32: `C:\\Program Files\\Sublime Text\\subl.exe`,
            darwin: `/Users/${systemUser()}/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl`,
            linux: `(不同发行版安装路径差异较大, 自行使用 which 命令找到 subl 命令所在路径作为可执行文件路径)`,
        })
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: configExtensionFilter('sublime_session'),
        }
    }

    parsePath(source: string): string {
        return utools.isWindows() ? source.replace(/^\/(\w+)(?=\/)/g, '$1:') : source
    }

    async generateCacheProjectItems(context: Context): Promise<Array<SublimeProjectItemImpl>> {
        let items: Array<SublimeProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let args = this.openInNew ? '-n' : ''
            let content = buffer.toString()
            let session = JSON.parse(content)
            let folderSet = new Set<string>()
            let fileSet = new Set<string>()
            let workspaceSet = new Set<string>()
            let folderHistory = session?.folder_history
            if (!isNil(folderHistory)) {
                for (let folder of folderHistory) {
                    folderSet.add(folder)
                }
            }
            let workspaceHistory = session?.workspaces?.recent_workspaces
            if (!isNil(workspaceHistory)) {
                for (let workspace of workspaceHistory) {
                    workspaceSet.add(workspace)
                }
            }
            [
                ...folderSet,
                ...fileSet,
                ...workspaceSet,
            ].forEach(path => {
                let parser = parse(path)
                let readPath = this.parsePath(path)
                let { exists, description, icon } = existsOrNot(readPath, {
                    description: readPath,
                    icon: context.enableGetFileIcon ? utools.getFileIcon(readPath) : this.icon,
                })
                let name = `${parser.name}${parser.ext}`
                items.push({
                    id: '',
                    title: name,
                    description: description,
                    icon: icon,
                    searchKey: unique([
                        ...generatePinyinIndex(context, name),
                        ...generateFilePathIndex(context, path),
                        name,
                    ]),
                    exists: exists,
                    command: new ShellExecutor(`"${this.executor}" ${args} "${this.parsePath(path)}"`),
                })
            })
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

export const applications: Array<ApplicationImpl<SublimeProjectItemImpl>> = [
    new SublimeApplicationImpl(),
]
