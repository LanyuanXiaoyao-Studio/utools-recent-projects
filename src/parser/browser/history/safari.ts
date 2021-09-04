import {
    ApplicationConfigState,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    ElectronExecutor,
    Group,
    GroupName,
    InputSettingItem,
    Platform,
    SettingItem,
} from '../../../types'
import {SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty} from 'licia'
import {removeAllQueryFromUrl} from '../../../utils'
import {Context} from '../../../context'

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

    async generateProjectItems(context: Context): Promise<Array<SafariHistoryProjectItemImpl>> {
        let items: Array<SafariHistoryProjectItemImpl> = []
        let configPath = `${utools.getPath('home')}/Library/Safari/History.db`
        // language=SQLite
        let sql = 'select i.url, v.title, cast(strftime(\'%s\', datetime(v.visit_time + 978307200, \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom history_items i,\n     history_visits v\nwhere i.id = v.history_item\norder by v.visit_time desc\nlimit 100;'
        let jsonText = execFileSync(this.executor, [configPath, sql, '-readonly', '-json'], { encoding: 'utf-8' })
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

    generateSettingItems(nativeId: string): Array<SettingItem> {
        return [
            new InputSettingItem(
                this.executorId(nativeId),
                `设置 Sqlite3 可执行程序路径`,
                this.executor,
                '读取数据需要使用 Sqlite3 命令行程序, 可以自行前往「https://www.sqlite.org/download.html」下载对应平台的可执行文件',
            ),
        ]
    }

    isFinishConfig(): ApplicationConfigState {
        return this.executor ? ApplicationConfigState.done : ApplicationConfigState.empty
    }
}

export const applications: Array<ApplicationImpl<SafariHistoryProjectItemImpl>> = [
    new SafariHistoryApplicationImpl(),
]
