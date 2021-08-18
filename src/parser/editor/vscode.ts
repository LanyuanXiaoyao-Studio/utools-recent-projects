import {ApplicationImpl, Platform, ProjectItemImpl, ShellExecutor} from '../../types'
import {readFile} from 'fs/promises'
import {isEmpty, isNil, Url} from 'licia'
import {parse} from 'path'

const VSCODE: string = 'vscode'

export class VscodeProjectItemImpl extends ProjectItemImpl {}

export class VscodeApplicationImpl extends ApplicationImpl<VscodeProjectItemImpl> {
    constructor() {
        super(
            'vscode',
            'Visual Studio Code',
            'icon/ms-visual-studio-code.png',
            VSCODE,
            [Platform.win32, Platform.darwin, Platform.linux],
            'Editor',
            'storage.json',
        )
    }

    async generateProjectItems(): Promise<Array<VscodeProjectItemImpl>> {
        let items: Array<VscodeProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let content = buffer.toString()
            let storage = JSON.parse(content)
            let entries = storage?.openedPathsList?.entries
            if (!isNil(entries)) {
                for (let element of entries) {
                    let folderUri = element['folderUri']
                    let fileUri = element['fileUri']
                    let uri
                    let args = ''
                    if (!isEmpty(folderUri)) {
                        uri = folderUri
                        args = '--folder-uri'
                    } else if (!isEmpty(fileUri)) {
                        uri = fileUri
                    } else {
                        continue
                    }
                    uri = decodeURI(uri)
                    let url = Url.parse(uri)
                    let parser = parse(url.pathname)
                    items.push({
                        id: '',
                        title: parser.name,
                        description: url.pathname,
                        icon: this.icon,
                        searchKey: url.pathname,
                        command: new ShellExecutor(`"${this.executor}" ${args} "${uri}"`),
                    })
                }
            }
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<VscodeProjectItemImpl>> = [
    new VscodeApplicationImpl(),
]
