import {isEmpty, unique} from 'licia'
import {Context} from '../../../Context'
import {i18n, sentenceKey} from '../../../i18n'
import {
    ApplicationImpl,
    DatetimeProjectItemImpl,
    ElectronExecutor,
    Group,
    GroupName,
    NameGetter,
    Platform,
} from '../../../Types'
import {removeAllQueryFromUrl} from '../../../Utils'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {queryFromSqlite} from '../../../utils/sqlite/SqliteExecutor'
import {BrowserApplicationImpl, BrowserId, getDefaultConfigPath} from '../index'

const CHROMIUM: string = 'chromium'
const configName = 'History'
const handler = text => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${text}`

export class ChromiumHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumHistoryApplicationImpl extends BrowserApplicationImpl<ChromiumHistoryProjectItemImpl> {
    private readonly browserId: BrowserId

    constructor(id: BrowserId, name: string | NameGetter, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description: boolean = true, beta: boolean = false, configName: string = '') {
        super(`${id}-history`, name, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], description ? () => handler(this.defaultConfigPath()) : undefined, beta, configName)
        this.browserId = id
    }

    override defaultConfigPath(): string {
        return `${getDefaultConfigPath(this.browserId)}${configName}`
    }

    async generateCacheProjectItems(context: Context): Promise<Array<ChromiumHistoryProjectItemImpl>> {
        let items: Array<ChromiumHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select v.id                                                                                                        as id,\n       u.url                                                                                                       as url,\n       u.title                                                                                                     as title,\n       cast(strftime(\'%s\', datetime((v.visit_time / 1000000) - 11644473600, \'unixepoch\',\n                                    \'localtime\')) as numeric)                                                      as timestamp\nfrom visits v\n         left join urls u on v.url = u.id\nwhere v.visit_time is not null\n  and v.url is not null\n  and v.visit_duration != 0\ngroup by u.last_visit_time\norder by timestamp desc\nlimit ' + context.browserHistoryLimit
        let array = await queryFromSqlite(this.config, sql)
        if (!isEmpty(array)) {
            array.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                items.push({
                    id: '',
                    title: title,
                    description: url,
                    // icon: iconMap[removeAllQueryFromUrl(url)],
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

        // 获取 favicon 的尝试
        // language=SQLite
        /*let faviconSql = 'select (substr((replace(replace(m.page_url, \'https://\', \'\'), \'http://\', \'\')), 1,\n               instr((replace(replace(m.page_url, \'https://\', \'\'), \'http://\', \'\')),\n                     \'/\') - 1)) as url,\n       hex(b.image_data)        as icon\nfrom icon_mapping m\n         left join favicon_bitmaps b on m.icon_id = b.icon_id'
        let iconMap = {}
        await this.copyAndReadFile('/Users/lanyuanxiaoyao/Library/Application Support/Google/Chrome/Default/Favicons', path => {
            let iconResult = execFileSync(this.executor, [path, faviconSql, '-readonly'], {
                encoding: 'utf-8',
                maxBuffer: 524288000,
                windowsHide: true,
            })
            if (!isEmpty(iconResult)) {
                let array = this.parseSqliteDefaultResult(iconResult, ['url', 'hex'])
                array.forEach(icon => {
                    if (isNil(iconMap[icon.url]) || isEmpty(iconMap[icon.url])) {
                        iconMap[icon.url] = icon.hex
                    } else {
                        let last = iconMap[icon.url]
                        if (icon.hex.length > last.length) {
                            iconMap[icon.url] = icon.hex
                        }
                    }
                })
                Object.keys(iconMap).forEach(key => {
                    iconMap[key] = `data:image/png;base64,${Buffer.from(iconMap[key], 'hex').toString('base64')}`
                })
            }
        })*/

        return items
    }
}

export const applications: Array<ApplicationImpl<ChromiumHistoryProjectItemImpl>> = [
    new ChromiumHistoryApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, false, undefined, configName),
    new ChromiumHistoryApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumHistoryApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumHistoryApplicationImpl('qq', () => `QQ ${i18n.t(sentenceKey.browser)}`, CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumHistoryApplicationImpl('maxthon', () => i18n.t(sentenceKey.maxthonBrowser), CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumHistoryApplicationImpl('opera', 'Opera', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumHistoryApplicationImpl('brave', 'Brave', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumHistoryApplicationImpl('vivaldi', 'Vivaldi', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumHistoryApplicationImpl('cent', () => i18n.t(sentenceKey.centBrowser), CHROMIUM, [Platform.win32], false, undefined, configName),
    new ChromiumHistoryApplicationImpl('yandex', 'Yandex', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumHistoryApplicationImpl('liebao', () => i18n.t(sentenceKey.liebaoBrowser), CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumHistoryApplicationImpl('deepin', () => i18n.t(sentenceKey.deepinBrowser), CHROMIUM, [Platform.linux], true, undefined, configName),
    new ChromiumHistoryApplicationImpl('xiaobai', () => i18n.t(sentenceKey.xiaobaiBrowser), CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumHistoryApplicationImpl('huawei', () => i18n.t(sentenceKey.huaweiBrowser), CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumHistoryApplicationImpl('catsxp', () => i18n.t(sentenceKey.catsxpBrowser), CHROMIUM, [Platform.win32], true, undefined, configName),
]
