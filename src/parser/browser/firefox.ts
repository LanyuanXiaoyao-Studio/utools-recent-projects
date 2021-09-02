import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../types'
import {SqliteBrowserApplicationImpl} from './index'
import {execFileSync} from 'child_process'
import {isEmpty} from 'licia'

const FIREFOX: string = 'firefox'

export class FirefoxHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxHistoryApplicationImpl extends SqliteBrowserApplicationImpl<FirefoxHistoryProjectItemImpl> {
    constructor() {
        super(
            `${FIREFOX}-history`,
            'Firefox History',
            `icon/browser-${FIREFOX}.png`,
            FIREFOX,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.browser],
            'places.sqlite',
            undefined,
            true,
        )
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
                    icon: this.icon,
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
    new FirefoxHistoryApplicationImpl(),
]
