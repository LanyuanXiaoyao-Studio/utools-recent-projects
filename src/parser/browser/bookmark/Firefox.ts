import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../Types'
import {BrowserId, getDefaultConfigPath, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {contain, isEmpty, isNil, reverse, unique} from 'licia'
import {Context} from '../../../Context'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {i18n, sentenceKey} from '../../../i18n'
import {parseSqliteDefaultResult} from '../../../utils/sqlite/ParseResult'
import {getSqliteExecutor, isEmptySqliteExecutor} from '../../../utils/sqlite/CheckSqliteExecutor'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'

const FIREFOX: string = 'firefox'

export class FirefoxBookmarkProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxBookmarkApplicationImpl extends SqliteBrowserApplicationImpl<FirefoxBookmarkProjectItemImpl> {
    private readonly browserId: BrowserId
    private readonly configName: string

    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], beta: boolean = false, configName: string = '') {
        super(`${id}-bookmark`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserBookmark], () => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${this.defaultConfigPath()}`, beta, configName)
        this.browserId = id
        this.configName = configName
    }

    override defaultConfigPath(): string {
        return `${getDefaultConfigPath(this.browserId)}${this.configName}`
    }

    async generateCacheProjectItems(context: Context): Promise<Array<FirefoxBookmarkProjectItemImpl>> {
        let items: Array<FirefoxBookmarkProjectItemImpl> = []
        if (isEmptySqliteExecutor(context, this.executor)) return items
        // language=SQLite
        let sql = 'select b.id as id, b.type as type, b.parent as parent, b.title as title, p.url as url, b.dateAdded as date_added\nfrom moz_bookmarks b\n         left join moz_places p on b.fk = p.id\norder by b.dateAdded desc'
        let result = ''
        await this.copyAndReadFile(this.config, path => {
            result = execFileSync(getSqliteExecutor(context, this.executor), [path, sql, '-readonly'], {
                encoding: 'utf-8',
                maxBuffer: 20971520,
            })
        })
        if (!isEmpty(result)) {
            let array = parseSqliteDefaultResult(result, ['n/id', 'n/type', 'n/parent', 'title', 'url', 'n/date_added'])
            let map = {}
            array.forEach(i => map[i.id] = i)
            array.forEach(i => i.parent = map[i.parent])
            let generateParent = item => {
                if (isNil(item?.parent)) {
                    return []
                }
                let parents = [item.parent]
                parents.push(...generateParent(item.parent))
                return parents
            }
            array.forEach(i => i.parents =
                reverse(generateParent(i))
                    .filter(i1 => !isEmpty(i1.title))
                    .filter(i1 => !contain(['menu', 'toolbar', 'tags', 'unfiled', 'mobile'], i1.title))
                    .map(i1 => i1.title)
                    .join('/'))
            array.filter(i => !isEmpty(i?.['url'] ?? ''))
                .forEach(i => {
                    let title = `${context.enableShowBookmarkCatalogue ? isEmpty(i?.['parents'] ?? '') ? '' : `[${i['parents']}] ` : ''}${i?.['title'] ?? ''}`
                    let url = i?.['url'] ?? ''
                    let time = Math.round(parseInt((i?.['date_added'] ?? '0')) / 1000)
                    items.push({
                        id: '',
                        title: title,
                        description: url,
                        icon: this.ifGetFavicon(url, context),
                        searchKey: unique([
                            ...generatePinyinIndex(context, title),
                            ...generateHostIndex(context, url),
                            ...generateFullUrlIndex(context, url),
                            title,
                        ]),
                        exists: true,
                        command: new ElectronExecutor(url),
                        datetime: time,
                    })
                })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<FirefoxBookmarkProjectItemImpl>> = [
    new FirefoxBookmarkApplicationImpl('firefox', 'Firefox', FIREFOX, undefined, undefined, 'places.sqlite'),
]
