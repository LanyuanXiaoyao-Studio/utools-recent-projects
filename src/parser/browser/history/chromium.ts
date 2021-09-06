import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../types'
import {BrowserId, generatePathDescriptionById, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty} from 'licia'
import {removeAllQueryFromUrl} from '../../../utils'
import {Context} from '../../../context'

const CHROMIUM: string = 'chromium'

export class ChromiumHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumHistoryApplicationImpl extends SqliteBrowserApplicationImpl<ChromiumHistoryProjectItemImpl> {
    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string, beta: boolean = true, configName: string = '') {
        super(`${id}-history`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], description, beta, configName)
    }

    async generateProjectItems(context: Context): Promise<Array<ChromiumHistoryProjectItemImpl>> {
        let items: Array<ChromiumHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select v.id, u.url, u.title, cast(strftime(\'%s\', datetime((v.visit_time / 1000000) - 11644473600, \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom visits v\n         left join urls u on v.url = u.id\nwhere v.visit_time is not null\n  and v.url is not null\n  and v.visit_duration != 0\ngroup by u.last_visit_time\norder by timestamp desc\nlimit 100'
        let jsonText = ''
        await this.copyAndReadFile(this.config, path => {
            jsonText = execFileSync(this.executor, [path, sql, '-readonly', '-json'], { encoding: 'utf-8' })
        })
        if (!isEmpty(jsonText)) {
            let json = JSON.parse(jsonText)
            json.forEach(i => {
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
    new ChromiumHistoryApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, generatePathDescriptionById('chrome', configName), undefined, configName),
    new ChromiumHistoryApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, generatePathDescriptionById('edge', configName), undefined, configName),
    new ChromiumHistoryApplicationImpl('qq', 'QQ Browser', CHROMIUM, [Platform.win32], generatePathDescriptionById('qq', configName), undefined, configName),
    new ChromiumHistoryApplicationImpl('maxthon', 'Maxthon (傲游)', CHROMIUM, [Platform.win32], generatePathDescriptionById('maxthon', configName), undefined, configName),
    new ChromiumHistoryApplicationImpl('opera', 'Opera', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescriptionById('opera', configName), undefined, configName),
    new ChromiumHistoryApplicationImpl('brave', 'Brave', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescriptionById('brave', configName), undefined, configName),
    new ChromiumHistoryApplicationImpl('cent', 'CentBrowser (百分)', CHROMIUM, [Platform.win32], generatePathDescriptionById('cent', configName), undefined, configName),
    new ChromiumHistoryApplicationImpl('yandex', 'Yandex', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescriptionById('yandex', configName), undefined, configName),
    new ChromiumHistoryApplicationImpl('liebao', '猎豹浏览器', CHROMIUM, [Platform.win32], generatePathDescriptionById('liebao', configName), undefined, configName),
]
