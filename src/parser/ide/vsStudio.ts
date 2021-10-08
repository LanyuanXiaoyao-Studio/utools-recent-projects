import {
    Application,
    ApplicationConfigImpl,
    DatetimeProjectItemImpl,
    ElectronExecutor,
    Group,
    GroupName,
    Platform,
} from '../../types'
import {readFile} from 'fs/promises'
import {isEmpty, isNil} from 'licia'
import {parse} from 'path'
import {existsOrNot, generateSearchKeyWithPinyin} from '../../utils'
import {Context} from '../../context'
import $ = require('licia/$')

const VS_STUDIO: string = 'vs-studio'

export class VsStudioProjectItemImpl extends DatetimeProjectItemImpl {}

export class VsStudioApplicationImpl extends ApplicationConfigImpl<VsStudioProjectItemImpl> {
    constructor(id: string, name: string, icon: string, platform: Array<Platform> = [Platform.win32]) {
        super(
            id,
            name,
            icon,
            VS_STUDIO,
            platform,
            Group[GroupName.vsStudio],
            `历史项目将使用默认关联的应用打开, 想要实现直接通过 Visual Studio 打开, 需要自行设置 sln 文件与 Visual Studio 默认关联
本功能依据官网最新的 Visual Studio 2019 开发`,
            false,
            'ApplicationPrivateSettings.xml',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<VsStudioProjectItemImpl>> {
        let items: Array<VsStudioProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let content = buffer.toString()
            $('#root').append(`<div id=${this.id} style="display: none">${content}</div>`)

            let source = $(`#${this.id} collection[name=CodeContainers\\.Offline] > value`).text()
            let projects = JSON.parse(source)
            if (!isNil(projects) && !isEmpty(projects)) {
                projects.forEach(p => {
                    let path = p?.Value?.LocalProperties?.FullPath ?? ''
                    let datetime = Date.parse(p?.Value?.LastAccessed ?? '')
                    let parseObj = parse(path)
                    let { exists, description, icon } = existsOrNot(path, {
                        description: path,
                        icon: context.enableGetFileIcon ? utools.getFileIcon(path) : this.icon,
                    })
                    items.push({
                        id: '',
                        title: parseObj.name,
                        description: description,
                        icon: icon,
                        searchKey: [...generateSearchKeyWithPinyin(parseObj.name), parseObj.name],
                        exists: exists,
                        command: new ElectronExecutor(path),
                        datetime: parseInt(`${datetime}`),
                    })
                })
            }
            $(`#${this.id}`).remove()
        }
        return items
    }
}

export const applications: Array<Application<VsStudioProjectItemImpl>> = [
    new VsStudioApplicationImpl('vs-studio', 'Visual Studio', 'icon/ms-visual-studio.png'),
]
