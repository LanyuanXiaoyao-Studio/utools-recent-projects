import {execSync} from 'child_process'
import {statSync} from 'fs'
import {isEmpty, isEqual, isNil, unique} from 'licia'
import {parse} from 'path'
import {Context} from '../../Context'
import {
    ApplicationCacheImpl,
    ApplicationImpl,
    Group,
    GroupName,
    Platform,
    ProjectItemImpl,
    ShellExecutor,
} from '../../Types'
import {existsOrNot, systemUser} from '../../Utils'
import {signCalculate} from '../../utils/files/SignCalculate'
import {generateFilePathIndex} from '../../utils/index-generator/FilePathIndex'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const XCODE: string = 'xcode'

const generateScript: (string) => string = configPath => `osascript -l JavaScript -e "ObjC.import('Foundation')
let paths = []
try {
    let data = \\$.NSData.dataWithContentsOfFile('${configPath}')
    let document = \\$.NSKeyedUnarchiver.unarchiveObjectWithData(data)
    let items = document.objectForKey('items')
    let length = items.count
    let keys = \\$([\\$.NSURLPathKey])
    for (let i = 0; i < length; i++) {
        try {
            let item = items.objectAtIndex(i)
            let source = item.objectForKey('Bookmark')
            let dict = \\$.NSURL.resourceValuesForKeysFromBookmarkData(keys, source)
            let path = dict.objectForKey('_NSURLPathKey')
            paths.push(ObjC.unwrap(path))
        } catch (e) {
            continue
        }
    }
} catch (e) {}
paths"
`

export class XcodeProjectItemImpl extends ProjectItemImpl {}

export class XcodeApplicationImpl extends ApplicationCacheImpl<XcodeProjectItemImpl> {
    private readonly configPath: string

    private sign: string = ''

    constructor() {
        super(
            XCODE,
            'Xcode',
            'https://developer.apple.com/xcode/',
            'icon/xcode.png',
            XCODE,
            [Platform.darwin],
            Group[GroupName.xcode],
            () => `Xcode 配置文件位置固定在 /Users/${systemUser()}/Library/Application Support/com.apple.sharedfilelist/com.apple.LSSharedFileList.ApplicationRecentDocuments/com.apple.dt.xcode.sfl2, 应该无需额外配置, 如果你的配置文件存在不在默认路径的情况, 请向我反馈`,
            true,
        )
        this.configPath = `${utools.getPath('home')}/Library/Application Support/com.apple.sharedfilelist/com.apple.LSSharedFileList.ApplicationRecentDocuments/com.apple.dt.xcode.sfl2`
    }

    async generateCacheProjectItems(context: Context): Promise<Array<XcodeProjectItemImpl>> {
        let items: Array<XcodeProjectItemImpl> = []
        if (isNil(statSync(this.configPath))) {
            throw new Error(`无法找到配置文件 ${this.configPath}`)
        }
        let result = execSync(generateScript(this.configPath), { encoding: 'utf-8', windowsHide: true })
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
                    searchKey: unique([
                        ...generatePinyinIndex(context, parseObj.name),
                        ...generateFilePathIndex(context, path),
                        parseObj.name,
                    ]),
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
