import {ApplicationImpl, Platform, ProjectItemImpl, SettingItem, ShellExecutor, SwitchSettingItem} from '../../types'
import {readFile} from 'fs/promises'
import {isNil} from 'licia'
import {parse} from 'path'
import {existsOrNot} from '../../utils'

const SUBLIME: string = 'sublime'

export class SublimeProjectItemImpl extends ProjectItemImpl {}

export class SublimeApplicationImpl extends ApplicationImpl<SublimeProjectItemImpl> {
    openInNew: boolean = false

    constructor() {
        super(
            'sublime',
            'Sublime Text',
            'icon/sublime.png',
            SUBLIME,
            [Platform.win32, Platform.darwin, Platform.linux],
            'Editor',
            'Session.sublime_session',
        )
    }

    parsePath(source: string): string {
        return utools.isWindows() ? source.replace(/^\/(\w+)(?=\/)/g, '$1:') : source
    }

    async generateProjectItems(): Promise<Array<SublimeProjectItemImpl>> {
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
                    icon: utools.getFileIcon(readPath),
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

    update(nativeId: string) {
        super.update(nativeId)
        this.openInNew = utools.dbStorage.getItem(this.openInNewId(nativeId))
    }

    generateSettingItems(nativeId: string): Array<SettingItem> {
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
