import {existsSync} from 'fs'
import {isEmpty, unique} from 'licia'
import {Context} from '../../../Context'
import {
    ApplicationConfigState,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    ElectronExecutor,
    GROUP_BROWSER_HISTORY,
    PLATFORM_MACOS,
    SettingItem,
} from '../../../Types'
import {removeAllQueryFromUrl, systemHome} from '../../../Utils'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {queryFromSqlite} from '../../../utils/sqlite/SqliteExecutor'
import {BrowserApplicationImpl} from '../index'

const SAFARI: string = 'safari'

export class SafariHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class SafariHistoryApplicationImpl extends BrowserApplicationImpl<SafariHistoryProjectItemImpl> {
    constructor() {
        super(
            `${SAFARI}-history`,
            'Safari',
            'https://www.apple.com/safari/',
            `icon/browser-${SAFARI}.png`,
            SAFARI,
            PLATFORM_MACOS,
            GROUP_BROWSER_HISTORY,
            undefined,
            false,
            'History.db',
        )
    }

    override defaultConfigPath(): string {
        return `${systemHome()}/Library/Safari/History.db`
    }

    async generateCacheProjectItems(context: Context): Promise<Array<SafariHistoryProjectItemImpl>> {
        let items: Array<SafariHistoryProjectItemImpl> = []
        let configPath = `${utools.getPath('home')}/Library/Safari/History.db`
        if (!existsSync(configPath)) {
            return []
        }
        // language=SQLite
        let sql = 'select i.url                                                                                         as url,\n       v.title                                                                                       as title,\n       cast(strftime(\'%s\', datetime(v.visit_time + 978307200, \'unixepoch\', \'localtime\')) as numeric) as timestamp\nfrom history_items i,\n     history_visits v\nwhere i.id = v.history_item\ngroup by i.url\norder by timestamp desc\nlimit ' + context.browserHistoryLimit
        let array = await queryFromSqlite(configPath, sql)
        if (!isEmpty(array)) {
            array.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                items.push({
                    id: '',
                    title: title,
                    description: url,
                    icon: this.ifGetFavicon(removeAllQueryFromUrl(url), context),
                    searchKey: unique([
                        ...generatePinyinIndex(context, title),
                        ...generateHostIndex(context, url),
                        ...generateFullUrlIndex(context, url),
                        title,
                    ]),
                    exists: true,
                    command: new ElectronExecutor(url),
                    datetime: i['timestamp'] ?? 0,
                })
            })
        }
        return items
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return []
    }

    override isFinishConfig(context: Context): ApplicationConfigState {
        if (this.disEnable())
            return ApplicationConfigState.empty
        return ApplicationConfigState.done
    }
}

export const applications: Array<ApplicationImpl<SafariHistoryProjectItemImpl>> = [
    new SafariHistoryApplicationImpl(),
]
