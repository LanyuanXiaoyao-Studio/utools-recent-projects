import {
    ApplicationCacheImpl,
    ApplicationImpl,
    Group,
    GroupName,
    Platform,
    ProjectItemImpl,
    ShellExecutor,
} from '../../Types'
import {execSync} from 'child_process'
import {isEmpty, isEqual, isNil, unique} from 'licia'
import {parse} from 'path'
import {statSync} from 'fs'
import {existsOrNot} from '../../Utils'
import {Context} from '../../Context'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'
import {signCalculate} from '../../utils/files/SignCalculate'

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

export class XcodeApplicationImpl extends ApplicationCacheImpl<XcodeProjectItemImpl> {
    private readonly configPath: string

    private sign: string = ''

    constructor() {
        super(
            XCODE,
            'Xcode',
            'icon/xcode.png',
            XCODE,
            [Platform.darwin],
            Group[GroupName.xcode],
            'Xcode 配置文件位置固定在 /Users/xxx/Library/Application Support/com.apple.sharedfilelist/com.apple.LSSharedFileList.ApplicationRecentDocuments/com.apple.dt.xcode.sfl2, 应该无需额外配置, 如果你的配置文件存在不在默认路径的情况, 请向我反馈',
            true,
        )
        this.configPath = `${utools.getPath('home')}/Library/Application Support/com.apple.sharedfilelist/com.apple.LSSharedFileList.ApplicationRecentDocuments/com.apple.dt.xcode.sfl2`
    }

    async generateCacheProjectItems(context: Context): Promise<Array<XcodeProjectItemImpl>> {
        let items: Array<XcodeProjectItemImpl> = []
        if (isNil(statSync(this.configPath))) {
            throw new Error(`无法找到配置文件 ${this.configPath}`)
        }
        let result = execSync(generateScript(this.configPath), { encoding: 'utf-8' })
        if (!isNil(result) && !isEmpty(result)) {
            let paths = result.split(',').map(p => p.trim())
            paths.forEach(path => {
                let parseObj = parse(path)
                let { exists, description, icon } = existsOrNot(path, {
                    description: path,
                    icon: context.enableGetFileIcon ? utools.getFileIcon(path) : this.icon,
                })
                items.push({
                    id: '',
                    title: parseObj.name,
                    description: description,
                    icon: icon,
                    searchKey: unique([...generatePinyinIndex(context, parseObj.name), parseObj.name, path]),
                    exists: exists,
                    command: new ShellExecutor(`open ${path}`),
                })
            })
        }
        return items
    }

    isNew(): boolean {
        let last = this.sign
        this.sign = signCalculate(this.configPath)
        return isEmpty(last) ? true : !isEqual(this.sign, last)
    }
}

export const applications: Array<ApplicationImpl<XcodeProjectItemImpl>> = [
    new XcodeApplicationImpl(),
]
