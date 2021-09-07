import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../types'
import {BrowserId, getBookmarkDescription, getHistoryDescription, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty} from 'licia'
import {removeAllQueryFromUrl} from '../../../utils'
import {Context} from '../../../context'
import {ChromiumBookmarkApplicationImpl} from '../bookmark/chromium'

const CHROMIUM: string = 'chromium'

export class ChromiumHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumHistoryApplicationImpl extends SqliteBrowserApplicationImpl<ChromiumHistoryProjectItemImpl> {
    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string, beta: boolean = true, configName: string = '') {
        super(`${id}-history`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], description, beta, configName)
    }

    async generateProjectItems(context: Context): Promise<Array<ChromiumHistoryProjectItemImpl>> {
        let items: Array<ChromiumHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select v.id                                                                                                        as id,\n       u.url                                                                                                       as url,\n       u.title                                                                                                     as title,\n       cast(strftime(\'%s\', datetime((v.visit_time / 1000000) - 11644473600, \'unixepoch\',\n                                    \'localtime\')) as numeric)                                                      as timestamp\nfrom visits v\n         left join urls u on v.url = u.id\nwhere v.visit_time is not null\n  and v.url is not null\n  and v.visit_duration != 0\ngroup by u.last_visit_time\norder by timestamp desc\nlimit 100'
        let result = ''
        await this.copyAndReadFile(this.config, path => {
            result = execFileSync(this.executor, [path, sql, '-readonly'], { encoding: 'utf-8', maxBuffer: 20971520 })
        })
        if (!isEmpty(result)) {
            let array = this.parseSqliteDefaultResult(result, ['n/id', 'url', 'title', 'n/timestamp'])
            array.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                items.push({
                    id: '',
                    title: title,
                    description: url,
                    icon: this.ifGetFavicon(removeAllQueryFromUrl(url), context),
                    searchKey: `${title} ${url}`,
                    exists: true,
                    command: new ElectronExecutor(url),
                    datetime: i['timestamp'] ?? 0,
                })
            })
        }
        return items
    }
}

const configName = 'History'
export const applications: Array<ApplicationImpl<ChromiumHistoryProjectItemImpl>> = [
    new ChromiumHistoryApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, undefined, undefined, configName),
    new ChromiumHistoryApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, getHistoryDescription('chrome'), undefined, configName),
    new ChromiumHistoryApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, getHistoryDescription('edge'), undefined, configName),
    new ChromiumHistoryApplicationImpl('qq', 'QQ Browser', CHROMIUM, [Platform.win32], getHistoryDescription('qq'), undefined, configName),
    new ChromiumHistoryApplicationImpl('maxthon', 'Maxthon (傲游)', CHROMIUM, [Platform.win32], getHistoryDescription('maxthon'), undefined, configName),
    new ChromiumHistoryApplicationImpl('opera', 'Opera', CHROMIUM, undefined, getHistoryDescription('opera'), undefined, configName),
    new ChromiumHistoryApplicationImpl('brave', 'Brave', CHROMIUM, undefined, getHistoryDescription('brave'), undefined, configName),
    new ChromiumHistoryApplicationImpl('cent', 'CentBrowser (百分)', CHROMIUM, [Platform.win32], getHistoryDescription('cent'), undefined, configName),
    new ChromiumHistoryApplicationImpl('yandex', 'Yandex', CHROMIUM, undefined, getHistoryDescription('yandex'), undefined, configName),
    new ChromiumHistoryApplicationImpl('liebao', '猎豹浏览器', CHROMIUM, [Platform.win32], getHistoryDescription('liebao'), undefined, configName),
    new ChromiumBookmarkApplicationImpl('deepin', '深度浏览器', CHROMIUM, [Platform.linux], getBookmarkDescription('deepin'), undefined, configName),
]
