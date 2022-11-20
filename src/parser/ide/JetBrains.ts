import {readFile} from 'fs/promises'
import {isEmpty, isNil, normalizePath, unique} from 'licia'
import {parse} from 'path'
import {Context} from '../../Context'
import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    DescriptionGetter,
    GROUP_IDE,
    NameGetter,
    NohupShellExecutor,
    Platform,
    PLATFORM_ALL,
    SettingProperties,
} from '../../Types'
import {configExtensionFilter, existsOrNotAsync} from '../../Utils'
import {generateFilePathIndex} from '../../utils/index-generator/FilePathIndex'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const JETBRAINS: string = 'jetbrains'

export interface RecentProjects {
    path: string
    datetime: number
}

export const parseRecentProjects: (context: Context, path: string) => Promise<Array<RecentProjects>> = async (context, path) => {
    let projectPaths: Array<RecentProjects> = []
    let buffer = await readFile(path)
    if (!isNil(buffer)) {
        let content = buffer.toString()
        let domParser = new DOMParser().parseFromString(content, 'application/xml')
        domParser.querySelectorAll('application option[name=additionalInfo] entry').forEach((element, index) => {
            let path = element.getAttribute('key') ?? ''
            let datetime = element.querySelector('option[name=projectOpenTimestamp]')?.getAttribute('value') ?? 0
            if (!isEmpty(path)) {
                path = path.replace('$USER_HOME$', utools.getPath('home'))
                projectPaths.push({
                    path: normalizePath(path),
                    datetime: parseInt(`${datetime}`),
                })
            }
        })
    }
    return projectPaths
}

export class JetBrainsProjectItemImpl extends DatetimeProjectItemImpl {}

/**
 * JetBrains 系列应用实现
 */
export class JetBrainsApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<JetBrainsProjectItemImpl> {
    constructor(id: string, name: string | NameGetter, homepage: string = '', icon: string, platform: Array<Platform> = PLATFORM_ALL, description: string | DescriptionGetter = '', beta: boolean = false, configFilename: string = 'recentProjects.xml') {
        super(id, name, homepage, icon, JETBRAINS, platform, GROUP_IDE, description, beta, configFilename)
    }

    override defaultConfigPath(): string {
        return ''
    }

    override defaultExecutorPath(): string {
        return ''
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: configExtensionFilter('xml'),
        }
    }

    async generateCacheProjectItems(context: Context): Promise<Array<JetBrainsProjectItemImpl>> {
        let items: Array<JetBrainsProjectItemImpl> = []
        let recentProjects = await parseRecentProjects(context, this.config)
        for (const recentProject of recentProjects) {
            let parseObj = parse(recentProject.path)
            let { exists, description, icon } = await existsOrNotAsync(recentProject.path, {
                description: recentProject.path,
                icon: this.icon,
            })
            items.push({
                id: '',
                title: parseObj.name,
                description: description,
                icon: icon,
                searchKey: unique([
                    ...generatePinyinIndex(context, parseObj.name),
                    ...generateFilePathIndex(context, recentProject.path),
                    parseObj.name,
                ]),
                exists: exists,
                command: new NohupShellExecutor(this.executor, recentProject.path),
                datetime: recentProject.datetime,
            })
        }
        return items
    }
}

export const androidApplications: Array<ApplicationImpl<JetBrainsProjectItemImpl>> = [
    new JetBrainsApplicationImpl('android', 'Android Studio', 'https://developer.android.com/studio', 'icon/jetbrains-android.png'),
]

export const applications: Array<ApplicationImpl<JetBrainsProjectItemImpl>> = [
    ...androidApplications,
    new JetBrainsApplicationImpl('appcode', 'AppCode', 'https://www.jetbrains.com/objc/', 'icon/jetbrains-appcode.png', [Platform.darwin]),
    new JetBrainsApplicationImpl('clion', 'CLion', 'https://www.jetbrains.com/clion/', 'icon/jetbrains-clion.png'),
    new JetBrainsApplicationImpl('datagrip', 'DataGrip', 'https://www.jetbrains.com/datagrip/', 'icon/jetbrains-datagrip.png'),
    new JetBrainsApplicationImpl('goland', 'GoLand', 'https://www.jetbrains.com/go/', 'icon/jetbrains-goland.png'),
    new JetBrainsApplicationImpl('idea', 'Intellij IDEA Ultimate', 'https://www.jetbrains.com/idea/', 'icon/jetbrains-idea.png'),
    new JetBrainsApplicationImpl('idea-ce', 'Intellij IDEA Community Edition', 'https://www.jetbrains.com/idea/', 'icon/jetbrains-idea-ce.png'),
    new JetBrainsApplicationImpl('idea-edu', 'Intellij IDEA Edu', 'https://www.jetbrains.com/idea/', 'icon/jetbrains-idea-edu.png'),
    new JetBrainsApplicationImpl('mps', 'MPS', 'https://www.jetbrains.com/mps/', 'icon/jetbrains-mps.png'),
    new JetBrainsApplicationImpl('phpstorm', 'PhpStorm', 'https://www.jetbrains.com/phpstorm/', 'icon/jetbrains-phpstorm.png'),
    new JetBrainsApplicationImpl('pycharm', 'PyCharm Professional', 'https://www.jetbrains.com/pycharm/', 'icon/jetbrains-pycharm.png'),
    new JetBrainsApplicationImpl('pycharm-ce', 'PyCharm Community', 'https://www.jetbrains.com/pycharm/', 'icon/jetbrains-pycharm-ce.png'),
    new JetBrainsApplicationImpl('pycharm-edu', 'PyCharm Edu', 'https://www.jetbrains.com/pycharm/', 'icon/jetbrains-pycharm-edu.png'),
    new JetBrainsApplicationImpl('rider', 'Rider', 'https://www.jetbrains.com/rider/', 'icon/jetbrains-rider.png', undefined, undefined, undefined, 'recentSolution.xml'),
    new JetBrainsApplicationImpl('rubymine', 'RubyMine', 'https://www.jetbrains.com/ruby/', 'icon/jetbrains-rubymine.png'),
    new JetBrainsApplicationImpl('webstorm', 'WebStorm', 'https://www.jetbrains.com/webstorm/', 'icon/jetbrains-webstorm.png'),
]
