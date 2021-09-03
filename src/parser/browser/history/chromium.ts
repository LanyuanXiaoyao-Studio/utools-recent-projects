import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../types'
import {generatePathDescription, SqliteBrowserApplicationImpl} from './index'
import {execFileSync} from 'child_process'
import {isEmpty, randomId} from 'licia'
import {join} from 'path'
import {copyFile, rm} from 'fs/promises'

const CHROMIUM: string = 'chromium'

export class ChromiumHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumHistoryApplicationImpl extends SqliteBrowserApplicationImpl<ChromiumHistoryProjectItemImpl> {
    constructor(id: string, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], configName: string, description?: string, beta: boolean = true) {
        super(`${id}-history`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], configName, description, beta)
    }

    async generateProjectItems(): Promise<Array<ChromiumHistoryProjectItemImpl>> {
        let items: Array<ChromiumHistoryProjectItemImpl> = []
        let tmpPath = utools.getPath('temp')
        let tmpDatabasePath = join(tmpPath, randomId())
        await copyFile(this.config, tmpDatabasePath)
        // language=SQLite
        let sql = 'select v.id, u.url, u.title, cast(strftime(\'%s\', datetime((v.visit_time / 1000000) - 11644473600, \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom visits v,\n     urls u\nwhere v.url = u.id\n  and v.visit_time is not null\n  and v.url is not null\nand v.visit_duration != 0\norder by v.visit_time desc, v.id desc\nlimit 100'
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
                    icon: this.ifGetFavicon(url),
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

export const applications: Array<ApplicationImpl<ChromiumHistoryProjectItemImpl>> = [
    new ChromiumHistoryApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, 'History'),
    new ChromiumHistoryApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
    })),
    new ChromiumHistoryApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default',
    })),
    new ChromiumHistoryApplicationImpl('qq', 'QQ Browser', CHROMIUM, [Platform.win32], 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Tencent\\QQBrowser\\User Data\\Default',
    })),
    new ChromiumHistoryApplicationImpl('maxthon', 'Maxthon (傲游)', CHROMIUM, [Platform.win32], 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Maxthon\\Application\\User Data\\Default',
    })),
    new ChromiumHistoryApplicationImpl('opera', 'Opera', CHROMIUM, [Platform.win32, Platform.darwin], 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Roaming\\Opera Software\\Opera Stable',
    })),
    new ChromiumHistoryApplicationImpl('brave', 'Brave', CHROMIUM, [Platform.win32, Platform.darwin], 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default',
    })),
    new ChromiumHistoryApplicationImpl('cent', 'CentBrowser (百分)', CHROMIUM, [Platform.win32], 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\User Data\\Default',
    })),
    new ChromiumHistoryApplicationImpl('yandex', 'Yandex', CHROMIUM, [Platform.win32, Platform.darwin], 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Yandex\\YandexBrowser\\User Data\\Default',
    })),
    new ChromiumHistoryApplicationImpl('liebao', '猎豹浏览器', CHROMIUM, [Platform.win32], 'History', generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\liebao\\User Data\\Default',
    })),
]
