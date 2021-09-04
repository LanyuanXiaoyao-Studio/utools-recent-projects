import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../types'
import {generatePathDescription, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty, randomId} from 'licia'
import {join} from 'path'
import {copyFile, rm} from 'fs/promises'
import {removeAllQueryFromUrl} from '../../../utils'
import {Context} from '../../../context'

const CHROMIUM: string = 'chromium'

export class ChromiumHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumHistoryApplicationImpl extends SqliteBrowserApplicationImpl<ChromiumHistoryProjectItemImpl> {
    constructor(id: string, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string, beta: boolean = true, configName: string = '') {
        super(`${id}-history`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], description, beta, configName)
    }

    async generateProjectItems(context: Context): Promise<Array<ChromiumHistoryProjectItemImpl>> {
        let items: Array<ChromiumHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select v.id, u.url, u.title, cast(strftime(\'%s\', datetime((v.visit_time / 1000000) - 11644473600, \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom visits v,\n     urls u\nwhere v.url = u.id\n  and v.visit_time is not null\n  and v.url is not null\nand v.visit_duration != 0\norder by v.visit_time desc, v.id desc\nlimit 100'
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

export const applications: Array<ApplicationImpl<ChromiumHistoryProjectItemImpl>> = [
    new ChromiumHistoryApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, undefined, undefined, 'History'),
    new ChromiumHistoryApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
        mac: '/Users/xxx/Library/Application Support/Google/Chrome/Default',
    }), undefined, 'History'),
    new ChromiumHistoryApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default',
    }), undefined, 'History'),
    new ChromiumHistoryApplicationImpl('qq', 'QQ Browser', CHROMIUM, [Platform.win32], generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Tencent\\QQBrowser\\User Data\\Default',
    }), undefined, 'History'),
    new ChromiumHistoryApplicationImpl('maxthon', 'Maxthon (傲游)', CHROMIUM, [Platform.win32], generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Maxthon\\Application\\User Data\\Default',
    }), undefined, 'History'),
    new ChromiumHistoryApplicationImpl('opera', 'Opera', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Roaming\\Opera Software\\Opera Stable',
    }), undefined, 'History'),
    new ChromiumHistoryApplicationImpl('brave', 'Brave', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default',
    }), undefined, 'History'),
    new ChromiumHistoryApplicationImpl('cent', 'CentBrowser (百分)', CHROMIUM, [Platform.win32], generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\User Data\\Default',
    }), undefined, 'History'),
    new ChromiumHistoryApplicationImpl('yandex', 'Yandex', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Yandex\\YandexBrowser\\User Data\\Default',
    }), undefined, 'History'),
    new ChromiumHistoryApplicationImpl('liebao', '猎豹浏览器', CHROMIUM, [Platform.win32], generatePathDescription({
        win: 'C:\\Users\\Administrator\\AppData\\Local\\liebao\\User Data\\Default',
    }), undefined, 'History'),
]
