import {ApplicationImpl, Platform, ProjectItemImpl} from '../../types'
import {readFile} from 'fs/promises'
import {isNil} from 'licia'
import {parse} from 'path'

const SUBLIME: string = 'sublime'

export class SublimeProjectItemImpl extends ProjectItemImpl {}

export class SublimeApplicationImpl extends ApplicationImpl<SublimeProjectItemImpl> {
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
        return source.replace(/^\/(\w+)(?=\/)/g, '$1:')
    }

    async generateProjectItems(): Promise<Array<SublimeProjectItemImpl>> {
        let items: Array<SublimeProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
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
                items.push({
                    id: '',
                    title: `${parser.name}${parser.ext}`,
                    description: this.parsePath(path),
                    icon: this.icon,
                    searchKey: path,
                    command: `"${this.executor}" "${this.parsePath(path)}"`,
                })
            })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<SublimeProjectItemImpl>> = [
    new SublimeApplicationImpl(),
]
