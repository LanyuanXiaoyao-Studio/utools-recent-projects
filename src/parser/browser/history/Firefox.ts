import {isEmpty, unique} from 'licia'
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
import {configExtensionFilter, removeAllQueryFromUrl} from '../../../Utils'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {queryFromSqlite} from '../../../utils/sqlite/SqliteExecutor'
import {BrowserApplicationImpl, BrowserId, getDefaultConfigPath, getHomepage} from '../index'

const FIREFOX: string = 'firefox'

export class FirefoxHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxHistoryApplicationImpl extends BrowserApplicationImpl<FirefoxHistoryProjectItemImpl> {
    private readonly browserId: BrowserId
    private readonly configName: string

    constructor(id: BrowserId, name: string | NameGetter, type: string, platforms: Array<Platform> = PLATFORM_ALL, beta: boolean = false, configName: string = '') {
        super(`${id}-history`, name, getHomepage(id), `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], () => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${this.defaultConfigPath()}`, beta, configName)
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

    async generateCacheProjectItems(context: Context): Promise<Array<FirefoxHistoryProjectItemImpl>> {
        let items: Array<FirefoxHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select p.url                                                                                         as url,\n       p.title                                                                                       as title,\n       p.description                                                                                 as description,\n       cast(strftime(\'%s\', datetime((h.visit_date / 1000000), \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom moz_historyvisits h,\n     moz_places p\nwhere h.place_id = p.id\n  and p.hidden = 0\n  and h.visit_date is not null\norder by h.visit_date desc\nlimit ' + context.browserHistoryLimit
        let array = await queryFromSqlite(this.config, sql)
        if (!isEmpty(array)) {
            array.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                let description: string = i['description'] ?? url
                if (isEmpty(description)) {
                    description = url
                }
                items.push({
                    id: '',
                    title: title,
                    description: description,
                    icon: this.ifGetFavicon(removeAllQueryFromUrl(url), context),
                    searchKey: unique([
                        ...generatePinyinIndex(context, title),
                        ...generateHostIndex(context, url),
                        ...generateFullUrlIndex(context, url),
                        title,
                    ]),
                    exists: true,
                    command: new ElectronExecutor(url),
                    datetime: i['timestamp'] ?? 0,
                })
            })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<FirefoxHistoryProjectItemImpl>> = [
    new FirefoxHistoryApplicationImpl('firefox', 'Firefox', FIREFOX, undefined, undefined, 'places.sqlite'),
]
