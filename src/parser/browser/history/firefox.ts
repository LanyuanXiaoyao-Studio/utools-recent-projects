import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../types'
import {generatePathDescription, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty} from 'licia'
import {removeAllQueryFromUrl} from '../../../utils'
import {Context} from '../../../context'

const FIREFOX: string = 'firefox'

export class FirefoxHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxHistoryApplicationImpl extends SqliteBrowserApplicationImpl<FirefoxHistoryProjectItemImpl> {
    constructor(id: string, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string, beta: boolean = true, configName: string = '') {
        super(`${id}-history`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], description, beta, configName)
    }

    async generateProjectItems(context: Context): Promise<Array<FirefoxHistoryProjectItemImpl>> {
        let items: Array<FirefoxHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select p.url as url, p.title as title, p.description as description, cast(strftime(\'%s\', datetime((h.visit_date / 1000000), \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom moz_historyvisits h,\n     moz_places p\nwhere h.place_id = p.id\n  and p.hidden = 0\n  and h.visit_date is not null\norder by h.visit_date desc\nlimit 100'
        let jsonText = ''
        await this.copyAndReadFile(this.config, path => {
            jsonText = execFileSync(path, [this.config, sql, '-readonly', '-json'], { encoding: 'utf-8' })
        })
        if (!isEmpty(jsonText)) {
            let json = JSON.parse(jsonText)
            json.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                let description: string = i['description'] ?? url
                items.push({
                    id: '',
                    title: title,
                    description: description,
                    icon: this.ifGetFavicon(removeAllQueryFromUrl(url), context),
                    searchKey: `${title} ${description} ${url}`,
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
    new FirefoxHistoryApplicationImpl('firefox', 'Firefox', FIREFOX, undefined, generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxx.default-release',
        mac: '/Users/xxx/Library/Application Support/Firefox/Profiles/xxx.default-release-xxx',
    }), undefined, 'places.sqlite'),
]
