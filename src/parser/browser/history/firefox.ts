import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../types'
import {generatePathDescription, SqliteBrowserApplicationImpl} from './index'
import {execFileSync} from 'child_process'
import {isEmpty} from 'licia'
import {removeAllQueryFromUrl} from '../../../utils'

const FIREFOX: string = 'firefox'

export class FirefoxHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxHistoryApplicationImpl extends SqliteBrowserApplicationImpl<FirefoxHistoryProjectItemImpl> {
    constructor(id: string, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], configName: string, description?: string, beta: boolean = true) {
        super(`${id}-history`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], configName, description, beta)
    }

    async generateProjectItems(): Promise<Array<FirefoxHistoryProjectItemImpl>> {
        let items: Array<FirefoxHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select url, title, description, cast(strftime(\'%s\', datetime((last_visit_date / 1000000), \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom main.moz_places\nwhere last_visit_date is not null\norder by last_visit_date desc\nlimit 100'
        let jsonText = execFileSync(this.executor, [this.config, sql, '-readonly', '-json'], { encoding: 'utf-8' })
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
                    icon: this.ifGetFavicon(removeAllQueryFromUrl(url)),
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
    new FirefoxHistoryApplicationImpl('firefox', 'Firefox', FIREFOX, undefined, 'places.sqlite', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxx.default-release',
    })),
]
