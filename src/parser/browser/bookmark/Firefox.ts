import {contain, isEmpty, isNil, reverse, unique} from 'licia'
import {Context} from '../../../Context'
import {i18n, sentenceKey} from '../../../i18n'
import {
    ApplicationImpl,
    DatetimeProjectItemImpl,
    ElectronExecutor,
    Group,
    GroupName,
    NameGetter,
    Platform,
    PLATFORM_ALL,
    SettingProperties,
} from '../../../Types'
import {configExtensionFilter} from '../../../Utils'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {queryFromSqlite} from '../../../utils/sqlite/SqliteExecutor'
import {BrowserApplicationImpl, BrowserId, getDefaultConfigPath, getHomepage} from '../index'

const FIREFOX: string = 'firefox'

export class FirefoxBookmarkProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxBookmarkApplicationImpl extends BrowserApplicationImpl<FirefoxBookmarkProjectItemImpl> {
    private readonly browserId: BrowserId
    private readonly configName: string

    constructor(id: BrowserId, name: string | NameGetter, type: string, platforms: Array<Platform> = PLATFORM_ALL, beta: boolean = false, configName: string = '') {
        super(`${id}-bookmark`, name, getHomepage(id), `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserBookmark], () => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${this.defaultConfigPath()}`, beta, configName)
        this.browserId = id
        this.configName = configName
    }

    override defaultConfigPath(): string {
        return `${getDefaultConfigPath(this.browserId)}${this.configName}`
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: configExtensionFilter('sqlite'),
        }
    }

    async generateCacheProjectItems(context: Context): Promise<Array<FirefoxBookmarkProjectItemImpl>> {
        let items: Array<FirefoxBookmarkProjectItemImpl> = []
        // language=SQLite
        let sql = 'select b.id as id, b.type as type, b.parent as parent, b.title as title, p.url as url, b.dateAdded as date_added\nfrom moz_bookmarks b\n         left join moz_places p on b.fk = p.id\norder by b.dateAdded desc'
        let array = await queryFromSqlite(this.config, sql)
        console.log(array)
        if (!isEmpty(array)) {
            let map = {}
            array.forEach(i => map[i.id] = i)
            array.forEach(i => i.parent = map[i.parent])
            let generateParent = item => {
                if (isNil(item?.parent)) {
                    return []
                }
                let parents = [item.parent]
                parents.push(...generateParent(item.parent))
                return parents
            }
            array.forEach(i => i.parents =
                reverse(generateParent(i))
                    .filter(i1 => !isEmpty(i1.title))
                    .filter(i1 => !contain(['menu', 'toolbar', 'tags', 'unfiled', 'mobile'], i1.title))
                    .map(i1 => i1.title)
                    .join('/'))
            array.filter(i => !isEmpty(i?.['url'] ?? ''))
                .forEach(i => {
                    let title = `${context.enableShowBookmarkCatalogue ? isEmpty(i?.['parents'] ?? '') ? '' : `[${i['parents']}] ` : ''}${i?.['title'] ?? ''}`
                    let url = i?.['url'] ?? ''
                    let time = Math.round(parseInt((i?.['date_added'] ?? '0')) / 1000)
                    items.push({
                        id: '',
                        title: title,
                        description: url,
                        icon: this.ifGetFavicon(url, context),
                        searchKey: unique([
                            ...generatePinyinIndex(context, title),
                            ...generateHostIndex(context, url),
                            ...generateFullUrlIndex(context, url),
                            title,
                        ]),
                        exists: true,
                        command: new ElectronExecutor(url),
                        datetime: time,
                    })
                })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<FirefoxBookmarkProjectItemImpl>> = [
    new FirefoxBookmarkApplicationImpl('firefox', 'Firefox', FIREFOX, undefined, undefined, 'places.sqlite'),
]
