import {
    ApplicationImpl,
    DatetimeProjectItemImpl,
    DescriptionGetter,
    ElectronExecutor,
    Group,
    GroupName,
    Platform,
} from '../../../types'
import {BrowserId, getPathDescription, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty, unique, Url} from 'licia'
import {generateSearchKeyWithPinyin, removeAllQueryFromUrl} from '../../../utils'
import {Context} from '../../../context'

const FIREFOX: string = 'firefox'

export class FirefoxHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxHistoryApplicationImpl extends SqliteBrowserApplicationImpl<FirefoxHistoryProjectItemImpl> {
    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string | DescriptionGetter, beta: boolean = false, configName: string = '') {
        super(`${id}-history`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], description, beta, configName)
    }

    async generateProjectItems(context: Context): Promise<Array<FirefoxHistoryProjectItemImpl>> {
        let items: Array<FirefoxHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select p.url                                                                                         as url,\n       p.title                                                                                       as title,\n       p.description                                                                                 as description,\n       cast(strftime(\'%s\', datetime((h.visit_date / 1000000), \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom moz_historyvisits h,\n     moz_places p\nwhere h.place_id = p.id\n  and p.hidden = 0\n  and h.visit_date is not null\norder by h.visit_date desc\nlimit 100'
        let result = ''
        await this.copyAndReadFile(this.config, path => {
            result = execFileSync(this.executor, [path, sql, '-readonly'], { encoding: 'utf-8', maxBuffer: 20971520 })
        })
        if (!isEmpty(result)) {
            let array = this.parseSqliteDefaultResult(result, ['url', 'title', 'description', 'n/timestamp'])
            array.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                let description: string = i['description'] ?? url
                if (isEmpty(description)) {
                    description = url
                }
                let searchKey = [...generateSearchKeyWithPinyin(title), title, description]
                try {
                    searchKey.push(Url.parse(url).hostname)
                } catch (ignore) {
                }
                items.push({
                    id: '',
                    title: title,
                    description: description,
                    icon: this.ifGetFavicon(removeAllQueryFromUrl(url), context),
                    searchKey: unique(searchKey),
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
    new FirefoxHistoryApplicationImpl('firefox', 'Firefox', FIREFOX, undefined, () => getPathDescription('firefox', 'places.sqlite'), undefined, 'places.sqlite'),
]
