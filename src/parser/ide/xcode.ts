import {
    ApplicationConfigState,
    ApplicationImpl,
    Platform,
    ProjectItemImpl,
    SettingItem,
    UToolsExecutor,
} from '../../types'
import {execSync} from 'child_process'
import {isEmpty, isNil} from 'licia'
import {parse} from 'path'
import {statSync} from 'fs'

const XCODE: string = 'xcode'

const generateScript: (string) => string = configPath => `osascript -e "use framework \\"Foundation\\"
use scripting additions
property |⌘| : a reference to current application
set documentPaths to {}
try
  set recentDocumentsPath to \\"${configPath}\\"
  set plistData to |⌘|'s NSData's dataWithContentsOfFile:recentDocumentsPath
  set recentDocuments to |⌘|'s NSKeyedUnarchiver's unarchiveObjectWithData:plistData
  repeat with doc in (recentDocuments's objectForKey:\\"items\\")
    set documentBookmark to (doc's objectForKey:\\"Bookmark\\")
    set {documentURL, resolveError} to (|⌘|'s NSURL's URLByResolvingBookmarkData:documentBookmark options:0 relativeToURL:(missing value) bookmarkDataIsStale:(missing value) |error|:(reference))
    if resolveError is missing value then
      set end of documentPaths to documentURL's |path|() as string
    end if
  end repeat
  documentPaths as list
on error
  {}
end try"
`

export class XcodeProjectItemImpl extends ProjectItemImpl {}

export class XcodeApplicationImpl extends ApplicationImpl<XcodeProjectItemImpl> {
    constructor() {
        super(
            'xcode',
            'Xcode',
            'icon/xcode.png',
            XCODE,
            [Platform.darwin],
            'Xcode',
            'com.apple.dt.xcode.sfl2',
            'Xcode 配置文件位置固定在 /Users/xxx/Library/Application Support/com.apple.sharedfilelist/com.apple.LSSharedFileList.ApplicationRecentDocuments/com.apple.dt.xcode.sfl2, 应该无需额外配置, 如果你的配置文件存在不在默认路径的情况, 请向我反馈',
            true,
        )
    }

    async generateProjectItems(): Promise<Array<XcodeProjectItemImpl>> {
        let items: Array<XcodeProjectItemImpl> = []
        let userPath = utools.getPath('home')
        let configPath = `${userPath}/Library/Application Support/com.apple.sharedfilelist/com.apple.LSSharedFileList.ApplicationRecentDocuments/com.apple.dt.xcode.sfl2`
        if (isNil(statSync(configPath))) {
            throw new Error(`无法找到配置文件 ${configPath}`)
        }
        let result = execSync(generateScript(configPath), { encoding: 'utf-8' })
        if (!isNil(result) && !isEmpty(result)) {
            let paths = result.split(',').map(p => p.trim())
            paths.forEach(p => {
                let parseObj = parse(p)
                items.push({
                    id: '',
                    title: parseObj.name,
                    description: p,
                    icon: this.icon,
                    searchKey: parseObj.name,
                    command: new UToolsExecutor(p),
                })
            })
        }
        return items
    }

    generateSettingItems(nativeId: string): Array<SettingItem> {
        return []
    }

    isFinishConfig(): ApplicationConfigState {
        return ApplicationConfigState.done
    }
}

export const applications: Array<ApplicationImpl<XcodeProjectItemImpl>> = [
    new XcodeApplicationImpl(),
]