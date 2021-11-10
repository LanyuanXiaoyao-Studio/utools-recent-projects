import {
    ApplicationCacheImpl,
    ApplicationConfigState,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    InputSettingItem,
    Platform,
    SettingItem,
    ShellExecutor,
} from '../../Types'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {every, has, isEmpty, isEqual, isNil, some, Url} from 'licia'
import {readFile} from 'fs/promises'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'
import {existsOrNot} from '../../Utils'
import {signCalculate} from '../../utils/files/SignCalculate'

const DEFAULT_FOLDER_X: string = 'default-folder-x'

export class DefaultFolderXProjectItemImpl extends DatetimeProjectItemImpl {}

export class DefaultFolderXApplicationImpl extends ApplicationCacheImpl<DefaultFolderXProjectItemImpl> {
    private recentFilesConfigPath: string = ''
    private recentFinderFoldersConfigPath: string = ''
    private recentFoldersConfigPath: string = ''
    private signs: { [keys: string]: string } = {}

    constructor() {
        super(
            DEFAULT_FOLDER_X,
            'Default Folder X',
            'icon/default-folder-x.png',
            DEFAULT_FOLDER_X,
            [Platform.darwin],
            Group[GroupName.system],
            '',
            true,
        )
    }

    async generateCacheProjectItems(context: Context): Promise<Array<DefaultFolderXProjectItemImpl>> {
        let items: Array<DefaultFolderXProjectItemImpl> = []
        let configPaths = [
            this.recentFilesConfigPath,
            this.recentFinderFoldersConfigPath,
            this.recentFoldersConfigPath,
        ]
        for (let index = 0; index < configPaths.length; index++) {
            const p = configPaths[index]
            if (isEmpty(p)) continue

            let buffer = await readFile(p)
            if (!isNil(buffer)) {
                let domParser = new DOMParser().parseFromString(buffer.toString(), 'application/xml')
                domParser.querySelectorAll('plist > array > dict')
                    .forEach(element => {
                        let children = element.children,
                            item: { [keys: string]: string } = {}
                        for (let index = 0; index < children.length; index++) {
                            let child = children[index]
                            if (child.tagName !== 'key') continue
                            let nextChild = children[index + 1]
                            let key = child?.textContent
                            if (isNil(key)) continue
                            item[key!] = nextChild?.textContent ?? ''
                        }
                        if (!has(item, 'url')) return
                        let url = item['url'],
                            decodeUrl = decodeURIComponent(url),
                            urlParsed = new Url(decodeUrl),
                            path = urlParsed.pathname,
                            title = item['name'] ?? '',
                            datetime = isNil(item['date']) ? 0 : Date.parse(item['date'])
                        let { exists, description, icon } = existsOrNot(path, {
                            description: path,
                            icon: context.enableGetFileIcon ? utools.getFileIcon(path) : this.icon,
                        })
                        items.push({
                            id: '',
                            title: title,
                            description: description,
                            icon: icon,
                            searchKey: [
                                ...generatePinyinIndex(context, title),
                                title,
                                path,
                            ],
                            exists: exists,
                            command: new ShellExecutor(''),
                            datetime: datetime,
                        })
                    })
            }
        }
        return items
    }

    override update(nativeId: string) {
        super.update(nativeId)
        this.recentFilesConfigPath = utools.dbStorage.getItem(this.recentFilesConfigPathId(nativeId))
        this.recentFinderFoldersConfigPath = utools.dbStorage.getItem(this.recentFinderFoldersConfigPathId(nativeId))
        this.recentFoldersConfigPath = utools.dbStorage.getItem(this.recentFoldersConfigPathId(nativeId))
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            ...super.generateSettingItems(context, nativeId),
            new InputSettingItem(
                this.recentFilesConfigPathId(nativeId),
                `${i18n.t(sentenceKey.configPrefix)}「RecentFiles.plist」${i18n.t(sentenceKey.configSuffix)}`,
                this.recentFilesConfigPath,
            ),
            new InputSettingItem(
                this.recentFinderFoldersConfigPathId(nativeId),
                `${i18n.t(sentenceKey.configPrefix)}「RecentFinderFolders.plist」${i18n.t(sentenceKey.configSuffix)}`,
                this.recentFinderFoldersConfigPath,
            ),
            new InputSettingItem(
                this.recentFoldersConfigPathId(nativeId),
                `${i18n.t(sentenceKey.configPrefix)}「RecentFolders.plist」${i18n.t(sentenceKey.configSuffix)}`,
                this.recentFoldersConfigPath,
            ),
        ]
    }

    override isFinishConfig(): ApplicationConfigState {
        let list = [
            this.recentFilesConfigPath,
            this.recentFinderFoldersConfigPath,
            this.recentFoldersConfigPath,
        ]
        // 如果全部配置项为空
        if (every(list, path => isEmpty(path))) return ApplicationConfigState.empty
        //  如果有一个配置项不为空且路径不存在
        else if (some(list, path => !isEmpty(path) && this.nonExistsPath(path))) return ApplicationConfigState.error
        else return ApplicationConfigState.done
    }

    isNew(): boolean {
        let list = [
            this.recentFilesConfigPath,
            this.recentFinderFoldersConfigPath,
            this.recentFoldersConfigPath,
        ].filter(p => !isEmpty(p) && this.existsPath(p))
        return some(list, p => {
            let last = this.signs[p] ?? ''
            this.signs[p] = signCalculate(p)
            return isEmpty(last) ? true : !isEqual(this.signs[p], last)
        })
    }

    private recentFilesConfigPathId(nativeId: string) {
        return `${nativeId}/${this.id}-recent-files`
    }

    private recentFinderFoldersConfigPathId(nativeId: string) {
        return `${nativeId}/${this.id}-recent-finder-folders`
    }

    private recentFoldersConfigPathId(nativeId: string) {
        return `${nativeId}/${this.id}-recent-folders`
    }
}

export const applications: Array<ApplicationImpl<DefaultFolderXProjectItemImpl>> = [
    new DefaultFolderXApplicationImpl(),
]
