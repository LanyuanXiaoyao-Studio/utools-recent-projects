import {readFile} from 'fs/promises'
import {isEmpty, unique} from 'licia'
import {Context} from '../../../Context'
import {i18n, sentenceKey} from '../../../i18n'
import {
    ApplicationImpl,
    DatetimeProjectItemImpl,
    GROUP_BROWSER_BOOKMARK,
    NameGetter,
    Platform,
    PLATFORM_ALL,
    PLATFORM_WINDOWS,
    UtoolsExecutor,
} from '../../../Types'
import {generateParents, parseTimeFrom1604} from '../../../Utils'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {BrowserApplicationImpl, BrowserId, getDefaultConfigPath, getHomepage} from '../index'

const CHROMIUM: string = 'chromium'
const configName = 'Bookmarks'
const handler = text => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${text}`

export class ChromiumBookmarkProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumBookmarkApplicationImpl extends BrowserApplicationImpl<ChromiumBookmarkProjectItemImpl> {
    private readonly browserId: BrowserId

    constructor(id: BrowserId, name: string | NameGetter, type: string, platforms: Array<Platform> = PLATFORM_ALL, description: boolean = true, beta: boolean = false, configName: string = '') {
        super(`${id}-bookmark`, name, getHomepage(id), `icon/browser-${id}.png`, type, platforms, GROUP_BROWSER_BOOKMARK, description ? () => handler(this.defaultConfigPath()) : undefined, beta, configName)
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
                command: new UtoolsExecutor(url),
                datetime: time,
            })
        })
        return items
    }
}

export const applications: Array<ApplicationImpl<ChromiumBookmarkProjectItemImpl>> = [
    new ChromiumBookmarkApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, false, undefined, configName),
    new ChromiumBookmarkApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('qq', () => `QQ ${i18n.t(sentenceKey.browser)}`, CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('maxthon', () => i18n.t(sentenceKey.maxthonBrowser), CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('opera', 'Opera', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('brave', 'Brave', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('vivaldi', 'Vivaldi', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('cent', () => i18n.t(sentenceKey.centBrowser), CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('yandex', 'Yandex', CHROMIUM, undefined, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('liebao', () => i18n.t(sentenceKey.liebaoBrowser), CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('deepin', () => i18n.t(sentenceKey.deepinBrowser), CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('xiaobai', () => i18n.t(sentenceKey.xiaobaiBrowser), CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('twinkstar', () => i18n.t(sentenceKey.twinkstarBrowser), CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('huawei', () => i18n.t(sentenceKey.huaweiBrowser), CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
    new ChromiumBookmarkApplicationImpl('catsxp', () => i18n.t(sentenceKey.catsxpBrowser), CHROMIUM, PLATFORM_WINDOWS, true, undefined, configName),
]
