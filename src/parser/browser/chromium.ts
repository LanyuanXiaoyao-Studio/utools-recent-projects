import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Platform} from '../../types'
import {SqliteBrowserApplicationImpl} from './index'
import {execFileSync} from 'child_process'
import {isEmpty, randomId} from 'licia'
import {join} from 'path'
import {copyFile, rm} from 'fs/promises'

const CHROMIUM: string = 'chromium'

export class ChromiumHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumHistoryApplicationImpl extends SqliteBrowserApplicationImpl<ChromiumHistoryProjectItemImpl> {
    constructor() {
        super(
            `${CHROMIUM}-history`,
            'Chromium History',
            `icon/browser-${CHROMIUM}.png`,
            CHROMIUM,
            [Platform.win32, Platform.darwin, Platform.linux],
            'Browser',
            'History',
            undefined,
            true,
        )
    }

    async generateProjectItems(): Promise<Array<ChromiumHistoryProjectItemImpl>> {
        let items: Array<ChromiumHistoryProjectItemImpl> = []
        let tmpPath = utools.getPath('temp')
        let tmpDatabasePath = join(tmpPath, randomId())
        await copyFile(this.config, tmpDatabasePath)
        // language=SQLite
        let sql = 'select v.id, u.url, u.title, v.visit_time from visits v, urls u where v.url = u.id and v.visit_time is not null and v.url is not null order by v.visit_time desc limit 100;'
        let jsonText = ''
        try {
            jsonText = execFileSync(this.executor, [tmpDatabasePath, sql, '-readonly', '-json'], { encoding: 'utf-8' })
        } catch (error) {
            console.log(error)
        } finally {
            await rm(tmpDatabasePath, { force: true })
        }
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
                    datetime: i['visit_time'] ?? 0,
                })
            })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<ChromiumHistoryProjectItemImpl>> = [
    new ChromiumHistoryApplicationImpl(),
]
