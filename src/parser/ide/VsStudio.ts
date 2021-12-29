import {
    ApplicationCacheConfigImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    ElectronExecutor,
    Group,
    GroupName,
    Platform,
} from '../../Types'
import {readFile} from 'fs/promises'
import {isEmpty, isNil, unique} from 'licia'
import {parse} from 'path'
import {existsOrNot} from '../../Utils'
import {Context} from '../../Context'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const VS_STUDIO: string = 'vs-studio'

export class VsStudioProjectItemImpl extends DatetimeProjectItemImpl {}

export class VsStudioApplicationImpl extends ApplicationCacheConfigImpl<VsStudioProjectItemImpl> {
    constructor() {
        super(
            VS_STUDIO,
            'Visual Studio',
            'icon/ms-visual-studio.png',
            VS_STUDIO,
            [Platform.win32],
            Group[GroupName.vsStudio],
            `历史项目将使用默认关联的应用打开, 想要实现直接通过 Visual Studio 打开, 需要自行设置 sln 文件与 Visual Studio 默认关联
本功能依据官网最新的 Visual Studio 2019 开发`,
            false,
            'ApplicationPrivateSettings.xml',
        )
    }

    override defaultConfigPath(): string {
        return ''
    }

    async generateCacheProjectItems(context: Context): Promise<Array<VsStudioProjectItemImpl>> {
        let items: Array<VsStudioProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let content = buffer.toString()
            let domParser = new DOMParser().parseFromString(content, 'text/html')
            let source = domParser.querySelector(`collection[name=CodeContainers\\.Offline] > value[name=value]`)?.textContent ?? ''
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
                        searchKey: unique([...generatePinyinIndex(context, parseObj.name), parseObj.name, path]),
                        exists: exists,
                        command: new ElectronExecutor(path),
                        datetime: parseInt(`${datetime}`),
                    })
                })
            }
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<VsStudioProjectItemImpl>> = [
    new VsStudioApplicationImpl(),
]
