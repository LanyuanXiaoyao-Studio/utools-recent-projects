import {ApplicationImpl, Platform, ProjectItemImpl} from '../types'
import fsp from 'fs/promises'
import {isEmpty, isNil} from 'licia'
import path from 'path'

export class VscodeProjectItemImpl extends ProjectItemImpl {}

export class VscodeApplicationImpl extends ApplicationImpl<VscodeProjectItemImpl> {
    constructor() {
        super(
            'vscode',
            'Visual Studio Code',
            'icon/vscode.png',
            ApplicationImpl.VSCODE,
            [Platform.win32, Platform.darwin, Platform.linux],
            'Visual Studio Code',
            'storage.json',
        )
    }

    async generateProjectItems(): Promise<Array<VscodeProjectItemImpl>> {
        let items: Array<VscodeProjectItemImpl> = []
        let buffer = await fsp.readFile(this.config)
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
                    let parser = path.parse(uri)
                    items.push({
                        id: '',
                        title: parser.name,
                        description: uri,
                        icon: this.icon,
                        searchKey: uri,
                        command: `"${this.executor}" ${args} "${uri}"`,
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
