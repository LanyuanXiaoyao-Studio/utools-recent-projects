import {
    ApplicationConfigState,
    ApplicationImpl,
    ElectronExecutor,
    Group,
    GroupName,
    Platform,
    ProjectItemImpl,
    SettingItem,
} from '../../../types'
import {BrowserApplicationImpl} from '../index'
import {Context} from '../../../context'
import {parseFile} from 'bplist-parser'
import {isEmpty, isNil} from 'licia'
import {generateParents} from '../../../utils'

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
            undefined,
            true,
            'Bookmarks.plist',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<SafariBookmarkProjectItemImpl>> {
        let items: Array<SafariBookmarkProjectItemImpl> = []
        let configPath = `${utools.getPath('home')}/Library/Safari/Bookmarks.plist`
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
                let title = `${isNil(i?.['Parents']) || isEmpty(i?.['Parents']) ? '' : `[${i['Parents'].map(p => findTitle(p)).join('/')}] `}${findTitle(i) ?? ''}`
                let url = i?.['URLString']
                items.push({
                    id: '',
                    title: title,
                    description: url,
                    icon: this.ifGetFavicon(url, context),
                    searchKey: `${title} ${url}`,
                    exists: true,
                    command: new ElectronExecutor(url),
                })
            })
        }
        return items
    }

    override generateSettingItems(nativeId: string): Array<SettingItem> {
        return []
    }

    override isFinishConfig(): ApplicationConfigState {
        return ApplicationConfigState.done
    }
}

export const applications: Array<ApplicationImpl<SafariBookmarkProjectItemImpl>> = [
    new SafariBookmarkApplicationImpl(),
]