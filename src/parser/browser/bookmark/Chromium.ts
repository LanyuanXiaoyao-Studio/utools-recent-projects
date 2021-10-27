import {
    ApplicationConfigState,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    DescriptionGetter,
    ElectronExecutor,
    Group,
    GroupName,
    InputSettingItem,
    Platform,
    SettingItem,
} from '../../../Types'
import {BrowserApplicationImpl, BrowserId, getDescription} from '../index'
import {Context} from '../../../Context'
import {readFile} from 'fs/promises'
import {isEmpty, unique, Url} from 'licia'
import {generateParents, parseTimeFrom1604} from '../../../Utils'
import {i18n, sentenceKey} from '../../../i18n'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'

const CHROMIUM: string = 'chromium'

export class ChromiumBookmarkProjectItemImpl extends DatetimeProjectItemImpl {}

export class ChromiumBookmarkApplicationImpl extends BrowserApplicationImpl<ChromiumBookmarkProjectItemImpl> {
    constructor(id: BrowserId, name: string, type: string, platforms: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], description?: string | DescriptionGetter, beta: boolean = false, configName: string = '') {
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
            let searchKey = [...generatePinyinIndex(context, title), title]
            try {
                searchKey.push(Url.parse(url).hostname)
            } catch (ignore) {
            }
            items.push({
                id: '',
                title: title,
                description: url,
                icon: this.ifGetFavicon(url, context),
                searchKey: unique(searchKey),
                exists: true,
                command: new ElectronExecutor(url),
                datetime: time,
            })
        })
        return items
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            this.enabledSettingItem(context, nativeId),
            new InputSettingItem(
                this.configId(nativeId),
                `${i18n.t(sentenceKey.configPrefix)} ${this.name} 「${this.configFilename}」${i18n.t(sentenceKey.configSuffix)}`,
                this.config,
            ),
        ]
    }

    override isFinishConfig(): ApplicationConfigState {
        return isEmpty(this.config) ? ApplicationConfigState.empty : ApplicationConfigState.done
    }
}

const configName = 'Bookmarks'
const handler = text => `${configName} ${i18n.t(sentenceKey.browserPathDescPrefix)} ${text}/${configName}`
export const applications: Array<ApplicationImpl<ChromiumBookmarkProjectItemImpl>> = [
    new ChromiumBookmarkApplicationImpl('chromium', 'Chromium', CHROMIUM, undefined, undefined, undefined, configName),
    new ChromiumBookmarkApplicationImpl('chrome', 'Google Chrome', CHROMIUM, undefined, () => getDescription('chrome', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('edge', 'Microsoft Edge', CHROMIUM, undefined, () => getDescription('edge', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('qq', 'QQ Browser', CHROMIUM, [Platform.win32], () => getDescription('qq', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('maxthon', 'Maxthon (傲游)', CHROMIUM, [Platform.win32], () => getDescription('maxthon', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('opera', 'Opera', CHROMIUM, undefined, () => getDescription('opera', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('brave', 'Brave', CHROMIUM, undefined, () => getDescription('brave', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('vivaldi', 'Vivaldi', CHROMIUM, undefined, () => getDescription('vivaldi', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('cent', 'CentBrowser (百分)', CHROMIUM, [Platform.win32], () => getDescription('cent', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('yandex', 'Yandex', CHROMIUM, undefined, () => getDescription('yandex', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('liebao', '猎豹浏览器', CHROMIUM, [Platform.win32], () => getDescription('liebao', handler), undefined, configName),
    new ChromiumBookmarkApplicationImpl('deepin', '深度浏览器', CHROMIUM, [Platform.linux], () => getDescription('deepin', handler), undefined, configName),
]