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
} from '../../../Types'
import {SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty, unique, Url} from 'licia'
import {removeAllQueryFromUrl} from '../../../Utils'
import {Context} from '../../../Context'
import {existsSync} from 'fs'
import {i18n, sentenceKey} from '../../../i18n'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'

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
            undefined,
            false,
            'History.db',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<SafariHistoryProjectItemImpl>> {
        let items: Array<SafariHistoryProjectItemImpl> = []
        let configPath = `${utools.getPath('home')}/Library/Safari/History.db`
        if (!existsSync(configPath)) {
            return []
        }
        // language=SQLite
        let sql = 'select i.url                                                                                         as url,\n       v.title                                                                                       as title,\n       cast(strftime(\'%s\', datetime(v.visit_time + 978307200, \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom history_items i,\n     history_visits v\nwhere i.id = v.history_item\ngroup by i.url\norder by timestamp desc\nlimit 100'
        let result = ''
        await this.copyAndReadFile(configPath, path => {
            result = execFileSync(this.executor, [path, sql, '-readonly'], { encoding: 'utf-8', maxBuffer: 20971520 })
        })
        if (!isEmpty(result)) {
            let array = this.parseSqliteDefaultResult(result, ['url', 'title', 'n/timestamp'])
            array.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                let searchKey = [...generatePinyinIndex(context, title), title]
                try {
                    searchKey.push(Url.parse(url).hostname)
                } catch (ignore) {
                }
                items.push({
                    id: '',
                    title: title,
                    description: url,
                    icon: this.ifGetFavicon(removeAllQueryFromUrl(url), context),
                    searchKey: unique(searchKey),
                    exists: true,
                    command: new ElectronExecutor(url),
                    datetime: i['timestamp'] ?? 0,
                })
            })
        }
        return items
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            this.enabledSettingItem(context, nativeId),
            new InputSettingItem(
                this.executorId(nativeId),
                i18n.t(sentenceKey.sqlite3),
                this.executor,
                i18n.t(sentenceKey.sqlite3Desc),
            ),
        ]
    }

    override isFinishConfig(): ApplicationConfigState {
        return this.executor ? ApplicationConfigState.done : ApplicationConfigState.empty
    }
}

export const applications: Array<ApplicationImpl<SafariHistoryProjectItemImpl>> = [
    new SafariHistoryApplicationImpl(),
]
