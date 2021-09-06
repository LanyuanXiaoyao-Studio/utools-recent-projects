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
import {BrowserApplicationImpl, BrowserId, generatePathDescriptionById} from '../index'
import {Context} from '../../../context'
import {readFile} from 'fs/promises'
import {isEmpty} from 'licia'
import {generateParents, parseTimeFrom1604} from '../../../utils'

const CHROMIUM: string = 'chromium'

export class ChromiumBookmarkProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumBookmarkApplicationImpl extends BrowserApplicationImpl<ChromiumBookmarkProjectItemImpl> {
    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string, beta: boolean = true, configName: string = '') {
        super(`${id}-bookmark`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserBookmark], description, beta, configName)
    }

    async generateProjectItems(context: Context): Promise<Array<ChromiumBookmarkProjectItemImpl>> {
        let items: Array<ChromiumBookmarkProjectItemImpl> = []
        let jsonText = await readFile(this.config, { encoding: 'utf-8' })
        let json = JSON.parse(jsonText)
        let array = [
            ...generateParents(undefined, (json?.['roots']?.['bookmark_bar']?.['children'] ?? []), 'parents', 'children'),
            ...generateParents(undefined, (json?.['roots']?.['other']?.['children'] ?? []), 'parents', 'children'),
            ...generateParents(undefined, (json?.['roots']?.['synced']?.['children'] ?? []), 'parents', 'children'),
        ]
        array.forEach(site => {
            let title = `${isEmpty(site?.['parents'] ?? []) ? '' : `[${site['parents'].map(i => i.name).join('/')}]`} ${site?.['name'] ?? ''}`
            let url = site?.['url'] ?? ''
            let time = parseTimeFrom1604(parseInt((site?.['date_added'] ?? '0')))
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
        return items
    }

    override generateSettingItems(nativeId: string): Array<SettingItem> {
        return [
            new InputSettingItem(
                this.configId(nativeId),
                `设置 ${this.name} 「${this.configFilename}」文件路径`,
                this.config,
            ),
        ]
    }

    override isFinishConfig(): ApplicationConfigState {
        return isEmpty(this.config) ? ApplicationConfigState.empty : ApplicationConfigState.done
    }
}

const configName = 'Bookmark'
export const applications: Array<ApplicationImpl<ChromiumBookmarkProjectItemImpl>> = [
    new ChromiumBookmarkApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, undefined, undefined, configName),
    new ChromiumBookmarkApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, generatePathDescriptionById('chrome', configName), undefined, configName),
    new ChromiumBookmarkApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, generatePathDescriptionById('edge', configName), undefined, configName),
    new ChromiumBookmarkApplicationImpl('qq', 'QQ Browser', CHROMIUM, [Platform.win32], generatePathDescriptionById('qq', configName), undefined, configName),
    new ChromiumBookmarkApplicationImpl('maxthon', 'Maxthon (傲游)', CHROMIUM, [Platform.win32], generatePathDescriptionById('maxthon', configName), undefined, configName),
    new ChromiumBookmarkApplicationImpl('opera', 'Opera', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescriptionById('opera', configName), undefined, configName),
    new ChromiumBookmarkApplicationImpl('brave', 'Brave', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescriptionById('brave', configName), undefined, configName),
    new ChromiumBookmarkApplicationImpl('cent', 'CentBrowser (百分)', CHROMIUM, [Platform.win32], generatePathDescriptionById('cent', configName), undefined, configName),
    new ChromiumBookmarkApplicationImpl('yandex', 'Yandex', CHROMIUM, [Platform.win32, Platform.darwin], generatePathDescriptionById('yandex', configName), undefined, configName),
    new ChromiumBookmarkApplicationImpl('liebao', '猎豹浏览器', CHROMIUM, [Platform.win32], generatePathDescriptionById('liebao', configName), undefined, configName),
]
