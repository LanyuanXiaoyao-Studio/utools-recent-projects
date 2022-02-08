import {
    ApplicationImpl,
    DatetimeProjectItemImpl,
    ElectronExecutor,
    Group,
    GroupName,
    NameGetter,
    Platform,
} from '../../../Types'
import {BrowserId, getDefaultConfigPath, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty, unique} from 'licia'
import {getName, removeAllQueryFromUrl} from '../../../Utils'
import {Context} from '../../../Context'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {i18n, sentenceKey} from '../../../i18n'
import {parseSqliteDefaultResult} from '../../../utils/sqlite/ParseResult'
import {getSqliteExecutor, isEmptySqliteExecutor} from '../../../utils/sqlite/CheckSqliteExecutor'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'

const FIREFOX: string = 'firefox'

export class FirefoxHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxHistoryApplicationImpl extends SqliteBrowserApplicationImpl<FirefoxHistoryProjectItemImpl> {
    private readonly browserId: BrowserId
    private readonly configName: string

    constructor(id: BrowserId, name: string | NameGetter, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], beta: boolean = false, configName: string = '') {
        super(`${id}-history`, `${getName(name)}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], () => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${this.defaultConfigPath()}`, beta, configName)
        this.browserId = id
        this.configName = configName
    }

    override defaultConfigPath(): string {
        return `${getDefaultConfigPath(this.browserId)}${this.configName}`
    }

    async generateCacheProjectItems(context: Context): Promise<Array<FirefoxHistoryProjectItemImpl>> {
        let items: Array<FirefoxHistoryProjectItemImpl> = []
        if (isEmptySqliteExecutor(context, this.executor)) return items
        // language=SQLite
        let sql = 'select p.url                                                                                         as url,\n       p.title                                                                                       as title,\n       p.description                                                                                 as description,\n       cast(strftime(\'%s\', datetime((h.visit_date / 1000000), \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom moz_historyvisits h,\n     moz_places p\nwhere h.place_id = p.id\n  and p.hidden = 0\n  and h.visit_date is not null\norder by h.visit_date desc\nlimit ' + context.browserHistoryLimit
        let result = ''
        await this.copyAndReadFile(this.config, path => {
            result = execFileSync(getSqliteExecutor(context, this.executor), [path, sql, '-readonly'], {
                encoding: 'utf-8',
                maxBuffer: 20971520,
                windowsHide: true,
            })
        })
        if (!isEmpty(result)) {
            let array = parseSqliteDefaultResult(result, ['url', 'title', 'description', 'n/timestamp'])
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
