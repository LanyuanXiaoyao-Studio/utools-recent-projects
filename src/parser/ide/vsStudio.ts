import {
    Application,
    ApplicationConfigState,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    ElectronExecutor,
    Group,
    GroupName,
    InputSettingItem,
    Platform,
    SettingItem,
} from '../../types'
import {readFile} from 'fs/promises'
import {isEmpty, isNil} from 'licia'
import {parse} from 'path'
import {existsOrNot} from '../../utils'
import $ = require('licia/$')

const VS_STUDIO: string = 'vs-studio'

export class VsStudioProjectItemImpl extends DatetimeProjectItemImpl {}

export class VsStudioApplicationImpl extends ApplicationImpl<VsStudioProjectItemImpl> {
    constructor(id: string, name: string, icon: string, platform: Array<Platform> = [Platform.win32], configFilename: string = 'ApplicationPrivateSettings.xml') {
        super(
            id,
            name,
            icon,
            VS_STUDIO,
            platform,
            Group[GroupName.vsStudio],
            configFilename,
            `历史项目将使用默认关联的应用打开, 想要实现直接通过 Visual Studio 打开, 需要自行设置 sln 文件与 Visual Studio 默认关联
本功能依据官网最新的 Visual Studio 2019 开发`,
            true,
        )
    }

    async generateProjectItems(): Promise<Array<VsStudioProjectItemImpl>> {
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
                        icon: utools.getFileIcon(path),
                    })
                    items.push({
                        id: '',
                        title: parseObj.name,
                        description: description,
                        icon: icon,
                        searchKey: parseObj.name,
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

    generateSettingItems(nativeId: string): Array<SettingItem> {
        return [
            new InputSettingItem(
                this.configId(nativeId),
                `设置 ${this.name} 「${this.configFilename}」文件路径`,
                this.config,
            ),
        ]
    }

    isFinishConfig(): ApplicationConfigState {
        if (isEmpty(this.config)) {
            return ApplicationConfigState.empty
        } else if (this.nonExistsPath(this.config)) {
            return ApplicationConfigState.error
        } else {
            return ApplicationConfigState.done
        }
    }
}

export const applications: Array<Application<VsStudioProjectItemImpl>> = [
    new VsStudioApplicationImpl('vs-studio', 'Visual Studio', 'icon/ms-visual-studio.png'),
]
