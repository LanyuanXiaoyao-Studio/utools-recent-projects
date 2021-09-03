import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../types'
import {SqliteBrowserApplicationImpl} from './index'
import {execFileSync} from 'child_process'
import {isEmpty} from 'licia'

const SAFARI: string = 'safari'

export class SafariHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class SafariHistoryApplicationImpl extends SqliteBrowserApplicationImpl<SafariHistoryProjectItemImpl> {
    constructor() {
        super(
            `${SAFARI}-history`,
            'Safari',
            `icon/browser-${SAFARI}.png`,
            SAFARI,
            [Platform.darwin],
            Group[GroupName.browserHistory],
            'History.db',
            undefined,
            true,
        )
    }

    async generateProjectItems(): Promise<Array<SafariHistoryProjectItemImpl>> {
        let items: Array<SafariHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select i.url, v.title, cast(strftime(\'%s\', datetime(v.visit_time + 978307200, \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom history_items i,\n     history_visits v\nwhere i.id = v.history_item\norder by v.visit_time desc\nlimit 100;'
        let jsonText = execFileSync(this.executor, [this.config, sql, '-readonly', '-json'], { encoding: 'utf-8' })
        if (!isEmpty(jsonText)) {
            let json = JSON.parse(jsonText)
            json.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                items.push({
                    id: '',
                    title: title,
                    description: url,
                    icon: this.icon,
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

export const applications: Array<ApplicationImpl<SafariHistoryProjectItemImpl>> = [
    new SafariHistoryApplicationImpl(),
]
