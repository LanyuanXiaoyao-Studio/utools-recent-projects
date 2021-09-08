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
} from '../../types'
import {readFile} from 'fs/promises'
import {isNil} from 'licia'
import {parse} from 'path'
import {existsOrNot, generateStringByOS} from '../../utils'
import {Context} from '../../context'

const SUBLIME: string = 'sublime'

export class SublimeProjectItemImpl extends ProjectItemImpl {}

export class SublimeApplicationImpl extends ApplicationConfigAndExecutorImpl<SublimeProjectItemImpl> {
    openInNew: boolean = false

    constructor() {
        super(
            'sublime',
            'Sublime Text',
            'icon/sublime.png',
            SUBLIME,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
            `数据文件通常放在 ${generateStringByOS({
                win32: 'C:\\Users\\Administrator\\AppData\\Roaming\\Sublime Text 3\\Local\\Session.sublime_session',
                darwin: '/Users/xxx/Library/Application Support/Sublime Text/Local/Session.sublime_session'
            })}, 可执行程序通常放在 ${generateStringByOS({
                win32: 'C:\\Program Files\\Sublime Text\\subl.exe',
                darwin: '/Users/xxx/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'
            })} (注意 Sublime Text 单独提供了命令行程序, 不是程序本体)`,
            undefined,
            'Session.sublime_session',
        )
    }

    parsePath(source: string): string {
        return utools.isWindows() ? source.replace(/^\/(\w+)(?=\/)/g, '$1:') : source
    }

    async generateProjectItems(context: Context): Promise<Array<SublimeProjectItemImpl>> {
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
                items.push({
                    id: '',
                    title: `${parser.name}${parser.ext}`,
                    description: description,
                    icon: icon,
                    searchKey: path,
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
        this.openInNew = utools.dbStorage.getItem(this.openInNewId(nativeId))
    }

    override generateSettingItems(nativeId: string): Array<SettingItem> {
        let superSettings = super.generateSettingItems(nativeId)
        return [
            new SwitchSettingItem(
                this.openInNewId(nativeId),
                '新窗口打开',
                this.openInNew,
                '如果打开的是文件夹, 无论是否打开该选项, 都将在新窗口打开',
            ),
            ...superSettings,
        ]
    }
}

export const applications: Array<ApplicationImpl<SublimeProjectItemImpl>> = [
    new SublimeApplicationImpl(),
]
