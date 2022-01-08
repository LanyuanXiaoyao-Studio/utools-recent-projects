import {
    ApplicationConfigState,
    ApplicationImpl,
    ElectronExecutor,
    Group,
    GroupName,
    Platform,
    ProjectItemImpl,
    SettingItem,
} from '../../../Types'
import {BrowserApplicationImpl} from '../index'
import {Context} from '../../../Context'
import {parseFile} from 'bplist-parser'
import {isEmpty, isNil, unique} from 'licia'
import {generateParents, systemHome} from '../../../Utils'
import {existsSync} from 'fs'
import {i18n, sentenceKey} from '../../../i18n'
import {generatePinyinIndex} from '../../../utils/index-generator/PinyinIndex'
import {generateHostIndex} from '../../../utils/index-generator/HostIndex'
import {generateFullUrlIndex} from '../../../utils/index-generator/FullUrlIndex'

const SAFARI: string = 'safari'

export class SafariBookmarkProjectItemImpl extends ProjectItemImpl {}

export class SafariBookmarkApplicationImpl extends BrowserApplicationImpl<SafariBookmarkProjectItemImpl> {
    constructor() {
        super(
            `${SAFARI}-bookmark`,
            'Safari',
            `icon/browser-${SAFARI}.png`,
            SAFARI,
            [Platform.darwin],
            Group[GroupName.browserBookmark],
            () => i18n.t(sentenceKey.safariBookmarkDesc),
            false,
            'Bookmarks.plist',
        )
    }

    override defaultConfigPath(): string {
        return `${systemHome()}/Library/Safari/Bookmarks.plist`
    }

    async generateCacheProjectItems(context: Context): Promise<Array<SafariBookmarkProjectItemImpl>> {
        let items: Array<SafariBookmarkProjectItemImpl> = []
        let configPath = this.defaultConfigPath()
        if (!existsSync(configPath)) {
            return []
        }
        let result = await parseFile(configPath)
        let root = result?.[0]?.['Children'].filter(i => i?.['Title'] === 'BookmarksBar')?.[0]?.['Children']
        if (!isNil(root)) {
            let array = generateParents(undefined, root, 'Parents', 'Children')
            let findTitle: (p: any) => string = p => {
                let a = p?.['URIDictionary']?.['title']
                let b = p?.['Title']
                if (isNil(a) || isEmpty(a)) {
                    return b
                } else {
                    return a
                }
            }
            array.forEach(i => {
                let title = `${context.enableShowBookmarkCatalogue ? isNil(i?.['Parents']) || isEmpty(i?.['Parents']) ? '' : `[${i['Parents'].map(p => findTitle(p)).join('/')}] ` : ''}${findTitle(i) ?? ''}`
                let url = i?.['URLString']
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

export const applications: Array<ApplicationImpl<SafariBookmarkProjectItemImpl>> = [
    new SafariBookmarkApplicationImpl(),
]
