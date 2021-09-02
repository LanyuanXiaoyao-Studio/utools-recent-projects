import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Platform} from '../../types'
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
            'Browser',
            'places.sqlite',
            undefined,
            true,
        )
    }

    async generateProjectItems(): Promise<Array<FirefoxHistoryProjectItemImpl>> {
        let items: Array<FirefoxHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select url, title, last_visit_date, description from main.moz_places where last_visit_date is not null order by last_visit_date desc limit 100;'
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
                    datetime: i['last_visit_date'] ?? 0,
                })
            })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<FirefoxHistoryProjectItemImpl>> = [
    new FirefoxHistoryApplicationImpl(),
]
