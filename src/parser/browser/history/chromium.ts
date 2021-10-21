import {
    ApplicationImpl,
    DatetimeProjectItemImpl,
    DescriptionGetter,
    ElectronExecutor,
    Group,
    GroupName,
    Platform,
} from '../../../types'
import {BrowserId, getDescription, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {isEmpty, unique} from 'licia'
import {generateSearchKeyWithPinyin, removeAllQueryFromUrl} from '../../../utils'
import {Context} from '../../../context'
import {i18n, sentenceKey} from '../../../i18n'

const CHROMIUM: string = 'chromium'

export class ChromiumHistoryProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumHistoryApplicationImpl extends SqliteBrowserApplicationImpl<ChromiumHistoryProjectItemImpl> {
    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string | DescriptionGetter, beta: boolean = false, configName: string = '') {
        super(`${id}-history`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserHistory], description, beta, configName)
    }

    async generateProjectItems(context: Context): Promise<Array<ChromiumHistoryProjectItemImpl>> {
        let items: Array<ChromiumHistoryProjectItemImpl> = []
        // language=SQLite
        let sql = 'select v.id                                                                                                        as id,\n       u.url                                                                                                       as url,\n       u.title                                                                                                     as title,\n       cast(strftime(\'%s\', datetime((v.visit_time / 1000000) - 11644473600, \'unixepoch\',\n                                    \'localtime\')) as numeric)                                                      as timestamp\nfrom visits v\n         left join urls u on v.url = u.id\nwhere v.visit_time is not null\n  and v.url is not null\n  and v.visit_duration != 0\ngroup by u.last_visit_time\norder by timestamp desc\nlimit 100'
        let result = ''
        await this.copyAndReadFile(this.config, path => {
            result = execFileSync(this.executor, [path, sql, '-readonly'], { encoding: 'utf-8', maxBuffer: 20971520 })
        })

        // 获取 favicon 的尝试
        // language=SQLite
        /*let faviconSql = 'select (substr((replace(replace(m.page_url, \'https://\', \'\'), \'http://\', \'\')), 1,\n               instr((replace(replace(m.page_url, \'https://\', \'\'), \'http://\', \'\')),\n                     \'/\') - 1)) as url,\n       hex(b.image_data)        as icon\nfrom icon_mapping m\n         left join favicon_bitmaps b on m.icon_id = b.icon_id'
        let iconMap = {}
        await this.copyAndReadFile('/Users/lanyuanxiaoyao/Library/Application Support/Google/Chrome/Default/Favicons', path => {
            let iconResult = execFileSync(this.executor, [path, faviconSql, '-readonly'], {
                encoding: 'utf-8',
                maxBuffer: 524288000,
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

        if (!isEmpty(result)) {
            let array = this.parseSqliteDefaultResult(result, ['n/id', 'url', 'title', 'n/timestamp'])
            array.forEach(i => {
                let title: string = i['title'] ?? ''
                let url: string = i['url'] ?? ''
                items.push({
                    id: '',
                    title: title,
                    description: url,
                    // icon: iconMap[removeAllQueryFromUrl(url)],
                    icon: this.ifGetFavicon(removeAllQueryFromUrl(url), context),
                    searchKey: unique([...generateSearchKeyWithPinyin(title), title, url]),
                    exists: true,
                    command: new ElectronExecutor(url),
                    datetime: i['timestamp'] ?? 0,
                })
            })
        }
        return items
    }
}

const configName = 'History'
const handler = text => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${text}/${configName}`
export const applications: Array<ApplicationImpl<ChromiumHistoryProjectItemImpl>> = [
    new ChromiumHistoryApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, undefined, undefined, configName),
    new ChromiumHistoryApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, () => getDescription('chrome', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, () => getDescription('edge', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('qq', 'QQ Browser', CHROMIUM, [Platform.win32], () => getDescription('qq', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('maxthon', 'Maxthon (傲游)', CHROMIUM, [Platform.win32], () => getDescription('maxthon', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('opera', 'Opera', CHROMIUM, undefined, () => getDescription('opera', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('brave', 'Brave', CHROMIUM, undefined, () => getDescription('brave', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('cent', 'CentBrowser (百分)', CHROMIUM, [Platform.win32], () => getDescription('cent', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('yandex', 'Yandex', CHROMIUM, undefined, () => getDescription('yandex', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('liebao', '猎豹浏览器', CHROMIUM, [Platform.win32], () => getDescription('liebao', handler), undefined, configName),
    new ChromiumHistoryApplicationImpl('deepin', '深度浏览器', CHROMIUM, [Platform.linux], () => getDescription('deepin', handler), undefined, configName),
]
