import {ApplicationImpl, DatetimeProjectItemImpl, ElectronExecutor, Group, GroupName, Platform} from '../../../types'
import {BrowserId, getPathDescription, SqliteBrowserApplicationImpl} from '../index'
import {execFileSync} from 'child_process'
import {contain, isEmpty, isNil, reverse} from 'licia'
import {Context} from '../../../context'

const FIREFOX: string = 'firefox'

export class FirefoxBookmarkProjectItemImpl extends DatetimeProjectItemImpl {}

export class FirefoxBookmarkApplicationImpl extends SqliteBrowserApplicationImpl<FirefoxBookmarkProjectItemImpl> {
    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string, beta: boolean = true, configName: string = '') {
        super(`${id}-bookmark`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserBookmark], description, beta, configName)
    }

    async generateProjectItems(context: Context): Promise<Array<FirefoxBookmarkProjectItemImpl>> {
        let items: Array<FirefoxBookmarkProjectItemImpl> = []
        // language=SQLite
        let sql = 'select b.id as id, b.type as type, b.parent as parent, b.title as title, p.url as url, b.dateAdded as date_added\nfrom moz_bookmarks b\n         left join moz_places p on b.fk = p.id\norder by b.dateAdded desc'
        let result = ''
        await this.copyAndReadFile(this.config, path => {
            result = execFileSync(this.executor, [path, sql, '-readonly'], { encoding: 'utf-8', maxBuffer: 20971520 })
        })
        if (!isEmpty(result)) {
            let array = this.parseSqliteDefaultResult(result, ['n/id', 'n/type', 'n/parent', 'title', 'url', 'n/date_added'])
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
                    let title = `${isEmpty(i?.['parents'] ?? '') ? '' : `[${i['parents']}]`} ${i?.['title'] ?? ''}`
                    let url = i?.['url'] ?? ''
                    let time = Math.round(parseInt((i?.['date_added'] ?? '0')) / 1000)
                    items.push({
                        id: '',
                        title: title,
                        description: url,
                        icon: this.ifGetFavicon(url, context),
                        searchKey: `${title} ${url}`,
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
    new FirefoxBookmarkApplicationImpl('firefox', 'Firefox', FIREFOX, undefined, getPathDescription('firefox', 'places.sqlite'), undefined, 'places.sqlite'),
]
