import {readFile} from 'fs/promises'
import {isEmpty, isNil, unique} from 'licia'
import {parse} from 'path'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    GROUP_IDE,
    PLATFORM_WINDOWS,
    SettingProperties,
    ShellExecutor,
} from '../../Types'
import {configExtensionFilter, executorExtensionFilter, existsOrNot, systemUser} from '../../Utils'
import {generateFilePathIndex} from '../../utils/index-generator/FilePathIndex'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const VS_STUDIO: string = 'vs-studio'

export class VsStudioProjectItemImpl extends DatetimeProjectItemImpl {}

export class VsStudioApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<VsStudioProjectItemImpl> {
    constructor() {
        super(
            VS_STUDIO,
            'Visual Studio',
            'https://visualstudio.microsoft.com/',
            'icon/ms-visual-studio.png',
            VS_STUDIO,
            PLATFORM_WINDOWS,
            GROUP_IDE,
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, ${i18n.t(sentenceKey.executorFileAt)} ${this.defaultExecutorPath()}`,
            false,
            'ApplicationPrivateSettings.xml',
        )
    }

    override defaultConfigPath(): string {
        return `C:\\Users\\${systemUser()}\\AppData\\Local\\Microsoft\\VisualStudio\\xxx\\ApplicationPrivateSettings.xml`
    }

    override defaultExecutorPath(): string {
        return `C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\devenv.exe`
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: configExtensionFilter('xml'),
        }
    }

    override executorSettingItemProperties(): SettingProperties {
        return {
            ...super.executorSettingItemProperties(),
            filters: executorExtensionFilter('exe'),
        }
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
                        searchKey: unique([
                            ...generatePinyinIndex(context, parseObj.name),
                            ...generateFilePathIndex(context, path),
                            parseObj.name,
                        ]),
                        exists: exists,
                        command: new ShellExecutor(`"${this.executor}" '${path}' /Edit`),
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
