import {
    Application,
    ApplicationConfigState,
    ApplicationImpl,
    Executor,
    Platform,
    ProjectItemImpl,
    SettingItem,
    UToolsExecutor,
} from '../../types'
import {readFile} from 'fs/promises'
import {isEmpty, isNil} from 'licia'
import {parse} from 'path'
import $ = require('licia/$')

const VS_STUDIO: string = 'vs-studio'

export class VsStudioProjectItemImpl extends ProjectItemImpl {
    datetime: number

    constructor(id: string, title: string, description: string, icon: string, searchKey: string, command: Executor, datetime: number) {
        super(id, title, description, icon, searchKey, command)
        this.datetime = datetime
    }
}

export class VsStudioApplicationImpl extends ApplicationImpl<VsStudioProjectItemImpl> {
    constructor(id: string, name: string, icon: string, platform: Array<Platform> = [Platform.win32], configFilename: string = 'ApplicationPrivateSettings.xml') {
        super(
            id,
            name,
            icon,
            VS_STUDIO,
            platform,
            'Visual Studio',
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
                    items.push({
                        id: '',
                        title: parseObj.name,
                        description: path,
                        icon: utools.getFileIcon(path),
                        searchKey: parseObj.name,
                        command: new UToolsExecutor(path),
                        datetime: parseInt(`${datetime}`),
                    })
                })
            }
            $(`#${this.id}`).remove()
        }
        return items
    }

    generateSettingItems(nativeId: string): Array<SettingItem> {
        let configId = this.configId(nativeId)
        let configTitle = `设置 ${this.name} 「${this.configFilename}」文件路径`
        return [
            Object.create({
                id: configId,
                name: configTitle,
                value: this.config,
            }),
        ]
    }

    isFinishConfig(): ApplicationConfigState {
        if (isEmpty(this.config)) {
            return ApplicationConfigState.empty
        } else {
            return ApplicationConfigState.done
        }
    }
}

export const applications: Array<Application<VsStudioProjectItemImpl>> = [
    new VsStudioApplicationImpl('vs-studio', 'Visual Studio', 'icon/ms-visual-studio.png'),
]
