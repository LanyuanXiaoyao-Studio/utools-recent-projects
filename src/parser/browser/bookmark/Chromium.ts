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
import {BrowserApplicationImpl, BrowserId, getDefaultConfigPath} from '../index'
import {Context} from '../../../Context'
import {readFile} from 'fs/promises'
import {isEmpty, unique} from 'licia'
import {generateParents, parseTimeFrom1604} from '../../../Utils'
import {i18n, sentenceKey} from '../../../i18n'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'

const CHROMIUM: string = 'chromium'
const configName = 'Bookmarks'
const handler = text => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${text}`

export class ChromiumBookmarkProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumBookmarkApplicationImpl extends BrowserApplicationImpl<ChromiumBookmarkProjectItemImpl> {
    private readonly browserId: BrowserId

    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description: boolean = true, beta: boolean = false, configName: string = '') {
        super(`${id}-bookmark`, `${name}`, `icon/browser-${id}.png`, type, platforms, Group[GroupName.browserBookmark], description ? () => handler(this.defaultConfigPath()) : undefined, beta, configName)
        this.browserId = id
    }

    override defaultConfigPath(): string {
        return `${getDefaultConfigPath(this.browserId)}${configName}`
    }

    async generateCacheProjectItems(context: Context): Promise<Array<ChromiumBookmarkProjectItemImpl>> {
        let items: Array<ChromiumBookmarkProjectItemImpl> = []
        let jsonText = await readFile(this.config, { encoding: 'utf-8' })
        let json = JSON.parse(jsonText)
        let array = [
            ...generateParents(undefined, (json?.['roots']?.['bookmark_bar']?.['children'] ?? []), 'parents', 'children'),
            ...generateParents(undefined, (json?.['roots']?.['other']?.['children'] ?? []), 'parents', 'children'),
            ...generateParents(undefined, (json?.['roots']?.['synced']?.['children'] ?? []), 'parents', 'children'),
        ]
        array.forEach(site => {
            let title = `${context.enableShowBookmarkCatalogue ? isEmpty(site?.['parents'] ?? []) ? '' : `[${site['parents'].map(i => i.name).join('/')}] ` : ''}${site?.['name'] ?? ''}`
            let url = site?.['url'] ?? ''
            let time = parseTimeFrom1604(parseInt((site?.['date_added'] ?? '0')))
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
        return items
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            new InputSettingItem(
                this.configId(nativeId),
                `${i18n.t(sentenceKey.configPrefix)} ${this.name} 「${this.configFilename}」${i18n.t(sentenceKey.configSuffix)}`,
                this.config,
            ),
        ]
    }

    override isFinishConfig(context: Context): ApplicationConfigState {
        if (this.disEnable())
            return ApplicationConfigState.empty
        if (isEmpty(this.config)) {
            return ApplicationConfigState.undone
        } else {
            return ApplicationConfigState.done
        }
    }
}

export const applications: Array<ApplicationImpl<ChromiumBookmarkProjectItemImpl>> = [
    new ChromiumBookmarkApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, false, undefined, configName),
    new ChromiumBookmarkApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('qq', 'QQ Browser', CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('maxthon', 'Maxthon (傲游)', CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('opera', 'Opera', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('brave', 'Brave', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('vivaldi', 'Vivaldi', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('cent', 'CentBrowser (百分)', CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('yandex', 'Yandex', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('liebao', '猎豹浏览器', CHROMIUM, [Platform.win32], true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('deepin', '深度浏览器', CHROMIUM, [Platform.linux], true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('xiaobai', '小白浏览器', CHROMIUM, [Platform.win32], true, undefined, configName),
]
