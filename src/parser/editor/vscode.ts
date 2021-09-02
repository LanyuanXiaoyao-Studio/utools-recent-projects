import {
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
import {isEmpty, isNil, Url} from 'licia'
import {parse} from 'path'
import {existsOrNot} from '../../utils'

const VSCODE: string = 'vscode'

export class VscodeProjectItemImpl extends ProjectItemImpl {}

export class VscodeApplicationImpl extends ApplicationImpl<VscodeProjectItemImpl> {
    openInNew: boolean = false
    private isWindows: boolean = utools.isWindows()

    constructor() {
        super(
            'vscode',
            'Visual Studio Code',
            'icon/ms-visual-studio-code.png',
            VSCODE,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
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
                    let args = this.openInNew ? '-n' : ''
                    if (!isEmpty(folderUri)) {
                        uri = folderUri
                    } else if (!isEmpty(fileUri)) {
                        uri = fileUri
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
                        icon: utools.getFileIcon(path),
                    })
                    items.push({
                        id: '',
                        title: parser.name,
                        description: description,
                        icon: icon,
                        searchKey: path,
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

export const applications: Array<ApplicationImpl<VscodeProjectItemImpl>> = [
    new VscodeApplicationImpl(),
]
